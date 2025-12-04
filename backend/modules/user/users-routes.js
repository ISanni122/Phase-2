const { Router } = require("express");
const registerRules = require("./middlewares/register-rules");
const loginRules = require("./middlewares/login-rules");
const { randomNumberOfNDigits } = require("../../shared/compute-utils");

const UserModel = require("./users-model");
const OTPModel = require("./otp-model");
const sendEmail = require("../../shared/email-utils");
const { matchPassword } = require("../../shared/password-utils");
const { encodeToken } = require("../../shared/jwt-utils");
const authorize = require("../../shared/middlewares/authorize");
const verifyLoginRules = require("./middlewares/verify-login-rules");


const usersRoute = Router();

/**
 * Login Route
 */
usersRoute.post("/users/login", loginRules, async (req, res) => {
  const { email, password } = req.body;
  const foundUser = await UserModel.findOne({ email });
  if (!foundUser) {
    return res.status(404).send({
      errorMessage: `User with ${email} doesn't exist`,
    });
  }
  const passwordMatched = matchPassword(password, foundUser.password);
  if (!passwordMatched) {
    return res.status(401).send({
      errorMessage: `Email and password didn't matched`,
    });
  }
  // don't issue a login token until OTP is verified. Generate & save an OTP
  const otp = randomNumberOfNDigits(6);

  try {
    // upsert OTP for this account (one active OTP per account)
    await OTPModel.findOneAndUpdate(
      { account: foundUser._id },
      { $set: { otp, createdAt: Date.now() } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const emailSubject = "Your OTP Code";
    const emailMessage = `Your OTP code is: ${otp}. It will expire in 5 minutes.`;
    await sendEmail(foundUser.email, emailSubject, emailMessage);

    // return a message confirming OTP was sent; token will be returned at verify
    return res.json({ message: "OTP has been sent to your email address." });
  } catch (error) {
    console.error("Login/OTP error:", error);
    return res.status(500).send({
      errorMessage: "Failed to send OTP email. Please try again later.",
    });
  }

});

/**
 * Verify Login Route
 */
usersRoute.post(
  "/users/verify-login",
  verifyLoginRules,
  async (req, res) => {
    const { email, otp } = req.body;

    const foundUser = await UserModel.findOne({ email });
    if (!foundUser) {
      return res.status(404).send({
        errorMessage: `User with ${email} doesn't exist`,
      });
    }

    const savedOTPEntry = await OTPModel.findOne({ account: foundUser._id, otp });
    if (!savedOTPEntry) {
      return res.status(401).send({
        errorMessage: "OTP verification failed. Invalid OTP.",
      });
    }

    // OTP valid: remove saved OTP and issue JWT
    await OTPModel.deleteOne({ _id: savedOTPEntry._id });

    const user = { ...foundUser.toJSON(), password: undefined };
    const token = encodeToken({ id: foundUser._id, roles: foundUser.roles });
    return res.json({ message: "OTP verified successfully.", token, user });

    
  }
);

/**
 * Register Route
 */
usersRoute.post("/users/register",  registerRules, async (req, res) => {
  const newUser = req.body;
  const existingUser = await UserModel.findOne({
    email: newUser.email,
  });
  if (existingUser) {
    return res.status(500).json({
      errorMessage: `User with ${newUser.email} already exist`,
    });
  }
  const addedUser = await UserModel.create(newUser);
  if (!addedUser) {
    return res.status(500).send({
      errorMessage: `Oops! User couldn't be added!`,
    });
  }
  const user = { ...addedUser.toJSON(), password: undefined };
  res.json(user);
});

/**
 * Get all users Route
 */
usersRoute.get("/users", authorize(["admin"]), async (req, res) => {
  const allUsers = await UserModel.find().select("-password");
  if (!allUsers) res.send([]);
  res.json(allUsers);
});

/**
 * Get user by id Route
 */
usersRoute.get(
  "/users/:id",
  authorize(["admin", "customer"]),
  async (req, res) => {
    const userID = req.params.id;

    const foundUser = await UserModel.findById(userID);
    if (!foundUser) {
      return res
        .status(404)
        .send({ errorMessage: `User with ${userID} doesn't exist` });
    }
    res.json(foundUser);
  }
);

/**
 * Update user Route
 */
usersRoute.put("/users/:id",  authorize(["admin", "customer"]), async (req, res) => {
  const userID = req.params.id;
  const newUser = req.body;
  if (!newUser) {
    return res.status(421).json({ errorMessage: "Nothing to update" });
  }

  const foundUser = await UserModel.findById(userID);
  if (!foundUser) {
    return res
      .status(404)
      .send({ errorMessage: `User with ${userID} doesn't exist` });
  }
  const updatedUser = await UserModel.findByIdAndUpdate(
    userID,
    {
      $set: newUser,
    },
    { new: true }
  ).select("-password");

  if (!updatedUser) {
    return res
      .status(500)
      .send({ errorMessage: `Oops! User couldn't be updated!` });
  }
  res.json(updatedUser);
});

/**
 * Delete user Route
 */
usersRoute.delete("/users/:id", authorize(["admin"]), async (req, res) => {
  const userID = req.params.id;
  const foundUser = await UserModel.findById(userID);
  const isAdmin = req.account.roles.includes("admin");
  if(!isAdmin) {
    return res.status(401).json({
      errorMessage:
        "You don't have permission to delete users. Please contact the support team for the assistance!",
    });
  }
  if (!foundUser) {
    return res
      .status(404)
      .send({ errorMessage: `User with ${userID} doesn't exist` });
  }
  const deletedUser = await UserModel.findByIdAndDelete(userID).select(
    "-password"
  );
  if (!deletedUser) {
    return res
      .status(500)
      .send({ errorMessage: `Oops! User couldn't be deleted!` });
  }
  res.json(deletedUser);
});

module.exports = { usersRoute };
