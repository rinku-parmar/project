const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");

const Review =require("../models/reviews.js");
const Listing =require("../models/listing.js");
const {vaildateReview, isLoggedIn,isReviewAuthor}=require("../middleware.js");
const { required } = require("joi");



const reviewController=require("../controllers/reviews.js");
/*reviews----------------------*/
//post route 
router.post("/",
  isLoggedIn,
  vaildateReview,wrapAsync(reviewController.createReview));
  
// Delete -review route 
router.delete("/:reviewId",
  isLoggedIn,     // Ensure the user is logged in
  isReviewAuthor,  // Ensure the user is the review author
    wrapAsync(reviewController.destroyReview));



module.exports=router;