const express = require('express');
const authMiddleware = require('../middlewares/auth-middleware');
const adminMiddleware = require('../middlewares/admin-middleware');
const { uploadHandler } = require("../middlewares/upload-middleware"); //  Correct import
const {addIndustry,getIndustries,getIndustriesActive,getIndustryById,deleteIndustry,deleteSelectedIndustries,updateIndustries} = require('../controllers/industry-controller');
const router = express.Router();

//add industry
router.route("/addIndustry").post(authMiddleware,adminMiddleware,uploadHandler([{ name: "industry_image", maxCount: 1 }]),addIndustry)


//get indudtry admin side
router.route("/getIndustryAdmin").get(authMiddleware,adminMiddleware,getIndustries)

//get industry in frontend with active status
router.route("/getIndustry").get(getIndustriesActive)

//get industry by id
router.route("/getIndustryById/:id").get(getIndustryById)

//delete industry
router.route("/deleteIndustry/:id").delete(authMiddleware,adminMiddleware,deleteIndustry)

//delete selected industries
router.route("/deleteSelectedIndustries").post(authMiddleware,adminMiddleware,deleteSelectedIndustries)

//update industry
router.route("/updateIndustry/:id").put(authMiddleware,adminMiddleware, uploadHandler([{ name: "industry_image", maxCount: 1 }]),updateIndustries)
        
module.exports = router;