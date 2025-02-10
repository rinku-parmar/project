const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");

const Review =require("../models/reviews.js");
const Listing =require("../models/listing.js");
const {vaildateReview, isLoggedIn}=require("../middleware.js");




/*reviews----------------------*/
//post route 
router.post("/",
  isLoggedIn,
  vaildateReview,wrapAsync(async(req,res)=>{
    // console.log(req.params.id);
    let listing= await Listing.findById(req.params.id);
    let newReview =new Review(req.body.review);
    newReview.author=req.user._id;//save author
   // console.log(`review ${newReview}`);

    listing.reviews.push(newReview);

  await  newReview.save();
  await listing.save();

  req.flash("success","New Review Created!")

//   console.log('new review  save');//  res.send('new review  save');
res.redirect(`/listings/${listing._id}`)

}));
// Delete -review route 
router.delete("/:reviewId",
    wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    console.log(`Review ID: '${reviewId}'`);

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success"," Review Deleted!")

    res.redirect(`/listings/${id}`)
}))



module.exports=router;