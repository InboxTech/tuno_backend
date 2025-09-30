const mongoose = require("mongoose");
const subscribe = require("../models/subscribe-model");
const nodemailer = require("nodemailer");


// Create transporter (using your email provider)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,   // your Gmail
    pass: process.env.EMAIL_PASS,   // Google App Password
  },
});
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

    // Save subscription
    const newSub = await subscribe.create({ email });

    // Send notification email to admin
    await transporter.sendMail({
      from: `"Website Subscription" <${process.env.EMAIL_USER}>`,  // must match authenticated user
      to: process.env.ADMIN_EMAIL, // where you want notification
      subject: "New Newsletter Subscription",
      html: `
         <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); overflow: hidden;">
        
        <!-- Header Section -->
        <div style="background-color: #581c87; padding: 40px 30px; text-align: center; position: relative;">
            <div style="background-color: rgba(255, 255, 255, 0.15); border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
                <div style="font-size: 36px; color: #ffffff;">🎉</div>
            </div>
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">New Subscriber!</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0; font-size: 16px;">Someone just joined your community</p>
        </div>
        
        <!-- Content Section -->
        <div style="padding: 40px 30px;">
            <!-- Email Info Card -->
            <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 10px; padding: 25px; border-left: 4px solid #667eea; margin-bottom: 30px; position: relative;">
                <div style="position: absolute; top: -10px; right: 20px; background-color: #10b981; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase;">New</div>
                
                <div style="margin-bottom: 20px;">
                    <div style="display: flex; align-items: center; margin-bottom: 8px;">
                        <div style="width: 12px; height: 12px; background-color: #667eea; border-radius: 50%; margin-right: 12px;"></div>
                        <span style="color: #64748b; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Email Address</span>
                    </div>
                    <p style="color: #1e293b; font-size: 18px; font-weight: 600; margin: 0; padding-left: 24px;">${newSub.email}</p>
                </div>
                
                <div>
                    <div style="display: flex; align-items: center; margin-bottom: 8px;">
                        <div style="width: 12px; height: 12px; background-color: #10b981; border-radius: 50%; margin-right: 12px;"></div>
                        <span style="color: #64748b; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Subscription Date</span>
                    </div>
                    <p style="color: #1e293b; font-size: 16px; font-weight: 500; margin: 0; padding-left: 24px;">${new Date().toLocaleString()}</p>
                </div>
            </div>
            
            <!-- Action Section -->
            <div style="text-align: center; margin: 30px 0;">
                <div style="background-color: #f1f5f9; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                    <p style="color: #64748b; margin: 0; font-size: 14px;">🚀 Your subscriber list is growing! Time to create amazing content.</p>
                </div>
                
               
            </div>
        </div>
        
     
    </div>
      `,
    });

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
