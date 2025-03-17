import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// Load environment variables
dotenv.config()

// Initialize Express app
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
)

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Define User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

// Define Contact Schema
const contactSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullName: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], default: "Male" },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

// Create models
const User = mongoose.model("User", userSchema)
const Contact = mongoose.model("Contact", contactSchema)

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token

    if (!token) {
      return res.status(401).json({ message: "Authentication required" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }

    req.user = { id: user._id, email: user.email }
    next()
  } catch (error) {
    console.error("Auth error:", error)
    return res.status(401).json({ message: "Invalid token" })
  }
}

// Auth Routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new user
    const user = new User({
      email,
      password: hashedPassword,
    })

    await user.save()

    res.status(201).json({ message: "User registered successfully" })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Create token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" })

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: "strict",
    })

    res.json({ id: user._id, email: user.email })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("token")
  res.json({ message: "Logged out successfully" })
})

app.get("/api/auth/me", authenticate, (req, res) => {
  res.json(req.user)
})

// Contact Routes
app.get("/api/contacts", authenticate, async (req, res) => {
  try {
    const contacts = await Contact.find({ userId: req.user.id }).sort({ createdAt: -1 })
    res.json(contacts)
  } catch (error) {
    console.error("Error fetching contacts:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.get("/api/contacts/:id", authenticate, async (req, res) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.id, userId: req.user.id })

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" })
    }

    res.json(contact)
  } catch (error) {
    console.error("Error fetching contact:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.post("/api/contacts", authenticate, async (req, res) => {
  try {
    const { fullName, gender, email, phoneNumber } = req.body

    const contact = new Contact({
      userId: req.user.id,
      fullName,
      gender,
      email,
      phoneNumber,
    })

    await contact.save()

    res.status(201).json(contact)
  } catch (error) {
    console.error("Error creating contact:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.put("/api/contacts/:id", authenticate, async (req, res) => {
  try {
    const { fullName, gender, email, phoneNumber } = req.body

    const contact = await Contact.findOne({ _id: req.params.id, userId: req.user.id })

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" })
    }

    contact.fullName = fullName
    contact.gender = gender
    contact.email = email
    contact.phoneNumber = phoneNumber

    await contact.save()

    res.json(contact)
  } catch (error) {
    console.error("Error updating contact:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.delete("/api/contacts/:id", authenticate, async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({ _id: req.params.id, userId: req.user.id })

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" })
    }

    res.json({ message: "Contact deleted successfully" })
  } catch (error) {
    console.error("Error deleting contact:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

