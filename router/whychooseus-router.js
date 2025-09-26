const express = require('express');
const authMiddleware = require('../middlewares/auth-middleware');
const adminMiddleware = require('../middlewares/admin-middleware');
const {uploadHandler} = require('../middlewares/upload-middleware');
const {addWhyChooseUs,getWhyChooseUsFrontend,getWhychooseUs,getProcessById,deleteWhyChooseUs,deleteSelectedWhyChooseUs,updateWhyChooseUs} = require('../controllers/whychooseus-controller');
const router = express.Router();

//add whychooseus
router.route("/addWhyChooseUs").post(authMiddleware,adminMiddleware,uploadHandler([{ name: "image1", maxCount: 1 },{ name: "image2", maxCount: 1 }]),addWhyChooseUs);

//get whychooseus for frontend
router.route("/getWhyChooseUs").get(getWhyChooseUsFrontend);

//get whychoose us for admin with all status
router.route("/getWhyChooseUsAdmin").get(authMiddleware,adminMiddleware,getWhychooseUs);

//get single process by id
router.route("/getProcessById/:id").get(getProcessById);

//delete whychooseus
router.route("/deleteWhyChooseUs/:id").delete(authMiddleware,adminMiddleware,deleteWhyChooseUs);

//delete selected whychooseus
router.route("/deleteSelectedWhyChooseUs").post(authMiddleware,adminMiddleware,deleteSelectedWhyChooseUs);


//update whychooseus
router.route("/updateWhyChooseUs/:id").put(authMiddleware,adminMiddleware,uploadHandler([{ name: "image1", maxCount: 1 },{ name: "image2", maxCount: 1 }]),updateWhyChooseUs);

module.exports = router;
