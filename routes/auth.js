const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");


const JWT_SECRET = "12345-abcde-67890-fghij-12345";


// Create a new user api : POST "/api/auth/createuser"
router.post(
  "/createuser",
  [
    body("name").isLength({ min: 3 }).withMessage("Name must be at least 3 characters long"),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").isLength({ min: 5 }).withMessage("Password must be at least 5 characters long"),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);

    // If there are validation errors, respond with them
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check if a user with the same email already exists
      let existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({success, error:"A user with this email already exists. Please use a different email."});
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      // for creating new user and save the details in the database
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });

      const data = {
        user: {
          id: user.id,
        }
      };

      const authtoken = jwt.sign(data, JWT_SECRET);

      success = true;
      res.json({ success, authtoken });

      //res.json({ message: 'User created successfully', user: { name: user.name, email: user.email, password: user.password } });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);



// Create User Login api : POST "/api/auth/login"
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").exists().withMessage("Password is required"),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    // Check for validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if user exists with the given email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ success, error: "Invalid email or password" });
      }

      // Compare provided password with stored hashed password
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {

        return res.status(400).json({ success, error: "Invalid email or password" });
      }

      // Create a payload with user ID
      const data = {
         user: { 
          id: user.id 
        } 
      };

      // Sign JWT token
      const authToken = jwt.sign(data, JWT_SECRET);

      // Send token in response
      success = true;
      res.json({ success, authToken });
    } 
    
    catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);



//Get logged in user details using: POST "/api/auth/getuser". Login required
router.post(
  "/getuser",
  fetchuser, //fetchuser is a middleware, it is using for get particular user data by using the proper jwttoken of already login user
  async (req, res) => {

    try {
      userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      res.send(user);
      
    } 
    
    catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
