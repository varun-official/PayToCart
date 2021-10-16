const express = require("express");
const router=express.Router();

const {getcategoryById,createCategory,getCategory,getAllCategory,updateCategory,removeCategory}=require("../controllers/category");
const {isSignedIn,isAuthenticated,isAdmin,}=require("../controllers/auth");
const {getUserById,}=require("../controllers/user");

//param
router.param("userId", getUserById);
router.param("categoryId", getcategoryById);

//actual routes
router.post("/category/create/:userId",isSignedIn,isAuthenticated,isAdmin,createCategory);

//read 
router.get("/category/:categoryId",getCategory);
router.get("/categories",getAllCategory);

//update
router.put("/category/:categoryId/:userId",isSignedIn,isAuthenticated,isAdmin,updateCategory);



//delete
router.delete("/category/:categoryId/:userId",isSignedIn,isAuthenticated,isAdmin,removeCategory);



module.exports=router