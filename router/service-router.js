const express = require("express");
const {addServices,getServices,updateServices,deleteServices,getServiceById,deleteSelectedServices,getServicesAdmin} = require("../controllers/service-controller");
const { uploadHandler } = require("../middlewares/upload-middleware"); //  Correct import
const adminMiddleware = require("../middlewares/admin-middleware");
const authMiddleware = require("../middlewares/auth-middleware");


const router = express.Router();

router
  .route("/addService")
  .post(
    authMiddleware,
    adminMiddleware,
    uploadHandler([
      { name: "service_image", maxCount: 1 },
      { name: "thumbnail_image", maxCount: 1 },
    ]),
    addServices
  );

  //get all services for frontend
router.route("/getService").get(getServices);

  //get all services for admin with all status
router.route("/getServiceAdmin").get(getServicesAdmin);
//get single sevic by id
router.route("/getServiceById/:id").get(getServiceById);



router.route("/updateService/:id").put(
    authMiddleware,adminMiddleware,  uploadHandler([
      { name: "service_image", maxCount: 1 },
      { name: "thumbnail_image", maxCount: 1 },
    ]),
        updateServices);
router.route("/deleteService/:id").delete(authMiddleware,adminMiddleware,deleteServices);
router.route("/deleteSelectedService").post(authMiddleware,adminMiddleware,deleteSelectedServices);

module.exports = router;