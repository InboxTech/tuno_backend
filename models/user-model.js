  const mongoose = require("mongoose");
  const bcrypt = require("bcryptjs");
  const jwt = require("jsonwebtoken");

  const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true, 
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: "",
    },

    password: {
      type: String,
      required: true,
    },
    deleted: {
      type: Boolean,
      default: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["Admin", "User", "Hr"],
      default: "User",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Pending"],
      default: "Active",
    },
    avatar: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  });

  //  Hash the password before saving
  userSchema.pre("save", async function (next) {
    const user = this;

    if (!user.isModified("password")) {
      return next();
    }

    try {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  });

  //  JWT Token Generator
  userSchema.methods.generateToken = async function () {
    try {
      return jwt.sign(
        {
          userId: this._id.toString(),
          email: this.email,
          isAdmin: this.isAdmin,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "30d" }
      );
    } catch (error) {
      console.error(error);
    }
  };

  //  Compare hashed password
  userSchema.methods.comparePassword = async function (password) {
    try {
      return bcrypt.compare(password, this.password);
    } catch (error) {
      console.error(error);
    }
  };


  const User = mongoose.model("User", userSchema);
  module.exports = User;
