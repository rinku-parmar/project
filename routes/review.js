const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {reviewSchema}=require("../schema.js");
const Review =require("../models/reviews.js");
const Listing =require("../models/listing");



//vaildate review
const vaildateReview=(req, res, next)=>{
    let {error}= reviewSchema.validate(req.body)
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg)
    }else{
        next();
    }
}

/*reviews----------------------*/
//post route 
router.post("/",vaildateReview,wrapAsync(async(req,res)=>{
    console.log(req.params.id);
    let listing= await Listing.findById(req.params.id);
    let newReview =new Review(req.body.review);

    listing.reviews.push(newReview);

  await  newReview.save();
  await listing.save();

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

    res.redirect(`/listings/${id}`)
}))



module.exports=router;