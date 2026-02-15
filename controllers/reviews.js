const Listing = require("../models/listing");
const Review = require("../models/reviews");
//post route 
module.exports.createReview = async (req, res) => {
  // console.log(req.params.id);
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;//save author
  // console.log(`review ${newReview}`);

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  req.flash("success", "New Review Created!")

  //   console.log('new review  save');//  res.send('new review  save');
  res.redirect(`/listings/${listing._id}`)

}

//delete route
module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  console.log(`Review ID: '${reviewId}'`);

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", " Review Deleted!")

  res.redirect(`/listings/${id}`)
}