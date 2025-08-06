const mongoose = require("mongoose");
const subscribe = require("../models/subscribe-model");

// submit form
const subscribeForm = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if already subscribed
    const alreadySubscribed = await subscribe.findOne({ email });
    if (alreadySubscribed) {
      return res.status(409).json({ message: "You have already subscribed" });
    }

    await subscribe.create({ email });
    return res.status(200).json({ message: "Subscribed successfully" });
  } catch (error) {
    console.error("Error saving subscribe form:", error);
    return res.status(500).json({ message: "Subscription failed" });
  }
};

// get all subscribe
const getAllsubscribe = async (req, res) => {
  try {
    const subscribeUser = await subscribe
      .find({ deleted: { $ne: true } })
      .sort({ createdAt: -1 });

    if (!subscribeUser || subscribeUser.length === 0) {
      return res.status(404).json({ msg: "No subscribe found" });
    }

    return res.status(200).json(subscribeUser);
  } catch (error) {
    console.error("Error fetching subscribes:", error);
    return res.status(500).json({ msg: "Failed to fetch subscribes" });
  }
};

//  Soft delete (single)
const softDeleteSubscribe = async (req, res) => {
  try {
    const updated = await subscribe.findByIdAndUpdate(
      req.params.id,
      { deleted: true },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ success: false, message: "Not found" });

    res
      .status(200)
      .json({ success: true, message: "Soft deleted", Subscribe: updated });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Soft delete failed",
      error: error.message,
    });
  }
};

//  Soft delete (bulk)
const softDeleteSelectedSubscribes = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No Subscribe IDs provided",
      });
    }

    const validIds = ids.filter((id) => mongoose.Types.ObjectId.isValid(id));
    if (validIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid Subscribe IDs provided",
      });
    }

    const result = await subscribe.updateMany(
      { _id: { $in: validIds } },
      { $set: { deleted: true } }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} Subscribes soft deleted`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Bulk soft delete failed",
      error: error.message,
    });
  }
};

module.exports = {
  subscribeForm,
  getAllsubscribe,
  softDeleteSubscribe,
  softDeleteSelectedSubscribes,
};
