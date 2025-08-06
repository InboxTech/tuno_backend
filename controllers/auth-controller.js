const User = require("../models/user-model");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const sendEmail = require("../utils/sendEmail");
dotenv.config();
// Home logic
const home = async (req, res) => {
  try {
    res.status(200).send("Hello world! this is route");
  } catch (error) {
    console.log(error);
  }
};

// Register logic
const register = async (req, res) => {
  try {
    // console.log(req.body);
    const { username, email, phone, password } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "email already exists" });
    }

    // hash the password
    // const saltRound = 10;
    // const hash_password = await bcrypt.hash(password, saltRound);

    const userCreated = await User.create({ username, email, phone, password });

    res.status(201).json({
      msg: "Registeration successfull",
      token: await userCreated.generateToken(),
      userId: userCreated._id.toString(),
    });
  } catch (error) {
    res.status(500).json("internal server error");
  }
};

// Login logic
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await User.findOne({ email });
    // console.log(userExist);

    if (!userExist) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // const passwordCheck = await bcrypt.compare(password, userExist.password)
    const passwordCheck = await userExist.comparePassword(password);

    if (passwordCheck) {
      res.status(200).json({
        msg: "Login Successful",
        token: await userExist.generateToken(),
        userId: userExist._id.toString(),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json("internal server error");
  }
};

// to send user data - user logic
const user = async (req, res) => {
  try {
    const userData = req.user;
    // console.log(userData);
    return res.status(200).json({ userData });
  } catch (error) {
    console.log(`router from the user route ${error}`);
  }
};

/// change password
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    //  Just assign the new password – no need to hash manually
    user.password = newPassword;
    await user.save(); // the pre-save hook will hash it properly

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password update error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// forget password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "No user found with this email." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = Date.now() + 3600000; // 1 hour

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
    console.log("🔗 Reset URL:", resetUrl);

    await sendEmail({
      to: user.email,
      subject: "Reset Your Password",
      html: `
        <div style="border:1px solid #581c87; border-radius: 5px; padding:18px">
          <h2 styele="color: #581c87;">Password Reset</h2>
          <p>Secure your account with a new password</p>
          <p>  We received a request to reset your password. If you made this request, click the button below to create a new password. This link will expire in 24 hours for security reasons.</p>
          <a style="text-decoration: none;
            background-color: #581c87;
            color: #fff;
            font-size: 13px;
            padding: 5px;
            border-radius: 5px;" href="${resetUrl}" target="_blank"> Reset My Password
          </a>
        </div>
      `,
    });

    res.status(200).json({ message: "Reset link sent successfully." });
  } catch (error) {
    console.error(" Forgot password error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// reset passwored
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // check if token not expired
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    user.password = newPassword; // will be hashed by pre-save hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  home,
  register,
  login,
  user,
  changePassword,
  forgotPassword,
  resetPassword,
};
