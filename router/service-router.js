const express = require("express");
const {addServices,getServices,updateServices,deleteServices,getServiceById,deleteSelectedServices,getServicesAdmin} = require("../controllers/service-controller");
const { uploadHandler } = require("../middlewares/upload-middleware"); //  Correct import
const adminMiddleware = require("../middlewares/admin-middleware");
const authMiddleware = require("../middlewares/auth-middleware");


const router = express.Router();

router
  .route("/service/addService")
  .post(
    authMiddleware,
    adminMiddleware,
    uploadHandler([
      { name: "service_image", maxCount: 1 },
      { name: "service_images", maxCount: 10 },
    ]),
    addServices
  );

  //get all services for frontend
router.route("/service/getService").get(getServices);

  //get all services for admin with all status
router.route("/service/getServiceAdmin").get(getServicesAdmin);
//get single sevic by id
router.route("/service/getServiceById/:id").get(getServiceById);



router.route("/service/updateService/:id").put(
    authMiddleware,adminMiddleware,  uploadHandler([
      { name: "service_image", maxCount: 1 },
      { name: "service_images", maxCount: 10 },
    ]),
        updateServices);
router.route("/service/deleteService/:id").delete(authMiddleware,adminMiddleware,deleteServices);
router.route("/service/deleteSelectedService").post(authMiddleware,adminMiddleware,deleteSelectedServices);

module.exports = router;