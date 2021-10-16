const express = require("express");
const router=express.Router();

const {isSignedIn,isAuthenticated,isAdmin,}=require("../controllers/auth");
const {getUserById,pushOrderInPurchaceList}=require("../controllers/user");
const {getOrderById,createOrder,getAllOrders,updateStatus,getOrderstatus}=require("../controllers/order");
const {updatestock,}=require("../controllers/product");

//param
router.param("userId", getUserById);
router.param("orderId", getOrderById);

//actual routes
//create
router.post("/order/create/:userId",isSignedIn,isAuthenticated,pushOrderInPurchaceList,updatestock,createOrder);
router.get("/order/all/:userId",isSignedIn,isAuthenticated,isAdmin,getAllOrders)

//status routes
router.get("/order/status/:userId",isSignedIn,isAuthenticated,isAdmin,getOrderstatus)
router.put("/order/:orderId/status/:userId",isSignedIn,isAuthenticated,isAdmin,updateStatus)




module.exports = router;

