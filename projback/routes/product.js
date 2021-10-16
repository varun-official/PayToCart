const express = require("express");
const router=express.Router();


const {getproductById,createProduct,getProduct,photo,deleteProduct,updateProduct,getAllProduct,getAllUniqueCategoryes}=require("../controllers/product");
const {isSignedIn,isAuthenticated,isAdmin,}=require("../controllers/auth");
const {getUserById,}=require("../controllers/user");

//param
router.param("userId", getUserById);
router.param("productId", getproductById);

//actual routes
//create routes
router.post("/product/create/:userId",isSignedIn,isAuthenticated,isAdmin,createProduct);

//read routes
router.get("/product/:productId",getProduct);
router.get("/product/photo/:productId",photo);

//delete routes
router.delete("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,deleteProduct);

//update routes
router.put("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,updateProduct);


//list routes
router.get("/products",getAllProduct);
router.get("/products/categoryes",getAllUniqueCategoryes);





module.exports=router