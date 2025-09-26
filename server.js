require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs"); 
const authRoute = require("./router/auth-router");
const contactRoute = require("./router/contact-router");
const serviceRoute = require("./router/service-router");
const industryeRoute = require("./router/industry-router");
const jobApplyRoute = require("./router/jobApplication-router");
const careerRoute = require("./router/career-router");
const blogRoute = require("./router/blog-router");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const adminRouter = require('./router/admin-router')

const teamRouter = require ('./router/team-route')
const testimonialRouter = require ('./router/testimonial-routes')
const projectRouter = require ('./router/project-routes')
const subscribeRouter = require('./router/subscribe-router')
const bannerRouter = require('./router/banner-router')
const whyChooseUsRouter = require('./router/whychooseus-router')
const connectDB = require("./utils/db");
const errorMiddleware = require("./middlewares/error-middleware");
const path = require("path");
//  Enable CORS - Place this at the very top
app.use(cors({
  origin:["http://localhost:5173", "http://localhost:5174", "http://test.inboxtechs.com", "http://admin.inboxtechs.com", "https://test.inboxtechs.com", "https://admin.inboxtechs.com"],
  credentials: true,
}));
// img uploaad
const uploadsPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
  console.log(" 'uploads' folder created automatically");
}

app.use("/uploads", express.static(uploadsPath));
app.use(express.json());

//  Routes
app.use("/api/auth", authRoute);
app.use("/api/form", contactRoute);

// admin user router
app.use("/api/admin",adminRouter);
app.use("/api/data", blogRoute);
app.use("/api/teamMember",teamRouter);
app.use("/api/testimonialData",testimonialRouter);
app.use("/api/projectData",projectRouter);
app.use("/api/subscribeData",subscribeRouter);

//admin service router
app.use("/api/service", serviceRoute);

app.use("/api/industry",industryeRoute);
//job application router
app.use("/api/jobApplication", jobApplyRoute);

// career router
app.use("/api/career", careerRoute);

//banner router
app.use("/api/banner", bannerRouter);

//whychooseus router
app.use("/api/whychooseus", whyChooseUsRouter);
//  Error handler
app.use(errorMiddleware);


const PORT = 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running at port: ${PORT}`);
  });
});
