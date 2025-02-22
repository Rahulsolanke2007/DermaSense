const express = require("express");
const router = express.Router();

const {signup,login} = require("../controllers/authController.js");
const{imageUpload} = require("../controllers/imageUpload.js");
const{auth} = require("../middlewares/authMiddleware.js")


router.post("/signup",signup);
router.post("/login",login);
// router.post("/localFileUpload",localFileUpload );
router.post("/imageUpload",auth,imageUpload );


module.exports = router;
