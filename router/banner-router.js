const express = require('express');
const {addBanner,getBanner, deleteBanner,updateBanner,getBannerFrontend} = require('../controllers/banner-controller');
const authMiddleware = require('../middlewares/auth-middleware');
const adminMiddleware = require('../middlewares/admin-middleware');
const {uploadHandler} = require('../middlewares/upload-middleware');
const router = express.Router();


//add banner
router.route("/addBanner").post(authMiddleware,adminMiddleware,uploadHandler([{ name: "image", maxCount: 1 }]),addBanner);

 //get banner for admin with all status
router.route("/getBanner").get(authMiddleware,adminMiddleware,getBanner);

//get banner for frontend with active status
router.route("/getBannerFrontend").get(getBannerFrontend);

//delete banner
router.route("/deleteBanner/:id").delete(authMiddleware,adminMiddleware,deleteBanner);

//update banner
router.route("/updateBanner/:id").put(authMiddleware,adminMiddleware,uploadHandler([{ name: "image", maxCount: 1 }]),updateBanner);


module.exports = router;