const express=require("express");
const router=express.Router();

const Listing =require("../models/listing");
const wrapAsync=require("../utils/wrapAsync.js");


const{isLoggedIn,isOwner,vaildatelisting}=require("../middleware.js");


const listingController =require("../controllers/listings.js");

const multer  = require('multer') // for image link passing multi-part/form-data
const { storage } = require('../cloudConfig.js'); // Import cloudinary config
const upload = multer({storage})//const upload = multer({ dest: 'uploads/' })

router.route("/")
.get(wrapAsync(listingController.index))//INDEX route
 .post(isLoggedIn,
   
    upload.single('listing[image]'),
     vaildatelisting,
    wrapAsync(listingController.createListing)////CREATE route
)
//  .post(upload.single('listing[image]'), (req,res)=>{
//     // res.send(req.body);
//     res.send(req.file);
//  })

// -----------3---new Route
router.get("/new", isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing)) //SHOW route
.put(
    isLoggedIn,// Ensure user is logged in
    isOwner,// Ensure user is the owner
    vaildatelisting,
    wrapAsync(listingController.updateListing)) //UPADTE  route
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing)) //DELETE route

//edit
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))


//-------1-index route :show all
// router.get("/",wrapAsync(listingController.index));

// // -----------3---new Route
// router.get("/new", isLoggedIn,listingController.renderNewForm);

// --------2-show route-  indival information
//router.get("/:id",wrapAsync(listingController.showListing));

//--4.create route

// app.post("/listings",async (req,res)=>{
// //   let {title,description,image,price,country,location}=req.body
//     // let listing=req.body.listing; //js obj
//     //console.log(listing);
//    // new Listing(listing) //instance
//    const newListing= new Listing(req.body.listing);
// //    console.log(newListing);
//  await newListing.save();
//    res.redirect("/listings")
// }) 
// app.post("/listings", wrapAsync(async (req,res,next)=>{ //without joi add wrapsync
//         //  if(!req.body.listing){
//         //     throw new ExpressError(400,"send valid data for listing")
//         //  }
//         const newListing= new Listing(req.body.listing);
//         // if(!newListing.title){ //use joi
//         //     throw new ExpressError(400,"Title is missing")
//         // }
//          await newListing.save();
//           res.redirect("/listings")

//     }) 
// )
    
// app.post("/listings", wrapAsync(async (req,res,next)=>{ //joi
//    let result= listingSchema.validate(req.body)
//    console.log(result);
//    if(result.error){
//     throw new ExpressError(400,result.error)
//    }
//     const newListing= new Listing(req.body.listing);
//     await newListing.save();
//       res.redirect("/listings")

// }) 
// )
// router.post("/",isLoggedIn,vaildatelisting, wrapAsync(listingController.createListing) 
//     )

// //edit
// router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))

//update route
// router.put("/:id",
//     isLoggedIn,// Ensure user is logged in
//     isOwner,// Ensure user is the owner
//     vaildatelisting,
//     wrapAsync(listingController.updateListing))

//DELETE route
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))

module.exports=router;