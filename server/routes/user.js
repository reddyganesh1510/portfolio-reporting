const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

router.get("/getusers", async (req, res) => {
  try {
    let users = await User.find({}, { displayName: 1, email: 1 });
    return res.status(200).send({
      data: users,
      message: "Records fetched successfully",
    });
  } catch (error) {
    return res.status(201).send({
      message: "Records fetching unsuccessful",
    });
  }
});

// Register
router.post("/register", async (req, res) => {
  try {
    // console.log(req.body);
    let { email, password, passwordCheck, displayName } = req.body;

    // validate
    if (!email)
      return res.status(201).send({ msg: "Not all fields have been entered." });
    if (password.length < 5)
      return res
        .status(201)
        .send({ msg: "The password needs to be at least 5 characters long." });
    if (password !== passwordCheck)
      return res
        .status(201)
        .send({ msg: "Enter the same password twice for verification." });

    const existingUser = await User.findOne({ email: email });
    if (existingUser)
      return res
        .status(201)
        .send({ msg: "An account with this email already exists." });
    if (!displayName) displayName = email;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new User({
      email,
      password: passwordHash,
      displayName,
    });
    const savedUser = await newUser.save();
    res.send(savedUser);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});
// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // validate
    if (!email || !password)
      return res.status(201).send({ msg: "Not all fields have been entered." });
    const user = await User.findOne({ email: email });
    if (!user)
      return res
        .status(201)
        .send({ msg: "No account with this email has been registered." });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(201).send({ msg: "Invalid credentials." });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.send({
      token,
      user: {
        id: user._id,
        displayName: user.displayName,
      },
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});
// Delete
router.delete("/delete", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user);
    res.send(deletedUser);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});
// Check if token is valid
router.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    // console.log(token);
    if (!token) return res.send(false);
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.send(false);
    const user = await User.findById(verified.id);
    if (!user) return res.send(false);
    return res.send(true);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});
router.get("/", async (req, res) => {
  const user = await User.findById(req.user);
  res.send({
    displayName: user.displayName,
    id: user._id,
  });
});
module.exports = router;
