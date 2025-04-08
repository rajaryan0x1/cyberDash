require("dotenv").config(); // Load environment variables
const express = require("express");
const session = require("express-session")
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");  // Used axios here as it is better than fetch and it returns a promise 
const bodyParser = require("body-parser");
const User = require("./models/User"); // User model


const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.JWT_SECRET, // use a strong secret key in production
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set to true if using HTTPS
}));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Serve static files (for CSS)
app.use(express.static("public"));

// GET route for login page
app.get("/login", (req, res) => {
  res.render("login", { errorMessage: null });
});

// GET route for register page
app.get("/register", (req, res) => {
  res.render("register", { errorMessage: null });
});

// POST route for user registration
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.render("register", { errorMessage: "All fields are required!" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("register", { errorMessage: "Email already exists!" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to database
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.redirect("/login"); // Redirect to login page
  } catch (error) {
    res.render("register", { errorMessage: "Error registering user" });
  }
});

// POST route for user login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.render("login", { errorMessage: "All fields are required!" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.render("login", { errorMessage: "Invalid email or password!" });
    }

    // Store user data in session
    req.session.user = { id: user._id, name: user.name };
    res.redirect("/dashboard");

  } catch (error) {
    res.render("login", { errorMessage: "Error logging in" });
  }
});

// API Endpoint for fetching cybersecurity news
app.get("/api/news", async (req, res) => {
  try {
    const newsResponse = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q: "cybersecurity",
        language: "en",
        sortBy: "publishedAt",
        pageSize: 5,
        apiKey: process.env.NEWS_API_KEY,
      },
    });

    const articles = newsResponse.data.articles.map(article => ({
      title: article.title,
      url: article.url,
    }));

    res.json(articles); // Return only needed fields
  } catch (error) {
    console.error(" Error fetching news:", error.message);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

app.get("/dashboard", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  try {
    const newsResponse = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q: "cybersecurity",
        language: "en",
        sortBy: "publishedAt",
        pageSize: 10,
        apiKey: process.env.NEWS_API_KEY,
      },
    });

    const newsArticles = newsResponse.data.articles;
    res.render("dashboard", { username: req.session.user.name, news: newsArticles });

  } catch (error) {
    res.render("dashboard", { username: req.session.user.name, news: [] });
  }
});


app.get("/password-checker", (req, res) => {
  res.render("password-checker")
})

// Services Section
app.get("/services", (req, res) => {
  res.render('services');

})



app.get("/card-checker", (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  res.render("card-checker", { username: req.session.user.name, result: null });
});

app.post("/card-checker", (req, res) => {
  const { cardNumber, expiry, cvv } = req.body;

  if (!cardNumber || !expiry || !cvv) {
    return res.render("card-checker", {
      username: req.session.user.name,
      result: { error: "All fields are required." }
    });
  }

  // Simulated card usage data (normally fetched from DB or API)
  const usageSummary = {
    totalSpent: 32900,
    flagged: true,
    transactions: [
      { merchant: "Amazon", amount: 4999, date: "2024-12-21", suspicious: false },
      { merchant: "Flipkart", amount: 2999, date: "2024-12-18", suspicious: false },
      { merchant: "Ebay", amount: 19999, date: "2024-12-14", suspicious: true },
      { merchant: "Netflix", amount: 499, date: "2024-12-10", suspicious: false }
    ]
  };

  res.render("card-checker", {
    username: req.session.user.name,
    result: usageSummary
  });
});


// THis is for SeRver (REnder)
// Updated it to render a index page at root directory
app.get('/', (req, res) => {
  const isLoggedIn = req.session.user ? true : false;
  res.render('index', { isLoggedIn }); // Pass session status to view
});



// Logout Logic 

app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.send("Error Logging Out!")
    }
    res.redirect("/login")
  })
})

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
