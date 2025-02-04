const express=require("express");
const router=express.Router();

const Listing =require("../models/listing");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");



// validation for schema(middleware)
const vaildatelisting=(req,res,next)=>{
    let {error}= listingSchema.validate(req.body)
    if(error){
        // throw new ExpressError(400,error)
        //extact detail
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg)
    }else{
        next()
    }
}


//-------1-index route :show all
router.get("/",wrapAsync(async(req,res)=>{
    const allListings= await Listing.find({})
    //.then(res=>{ console.log(res) })
    res.render("listings/index.ejs",{allListings})
}))

// -----------3---new Route
router.get("/new",  (req, res) => {
    res.render("listings/new.ejs");
});

// --------2-show route-  indival information
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing})
    // console.log(id);
}))

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
router.post("/",vaildatelisting, wrapAsync(async (req,res,next)=>{  //using validation for schema(middleware)
 
        const newListing= new Listing(req.body.listing);
        await newListing.save();
        //flash
        req.flash("success","New Listing Created!");
          res.redirect("/listings");
    
    }) 
    )

//edit
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
       res.render("listings/edit.ejs",{listing})
}))

//update route
router.put("/:id",
    vaildatelisting,
    wrapAsync(async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"send valid data for listing")
     }
    let {id}=req.params;
   const result= await Listing.findByIdAndUpdate(id,{...req.body.listing});

   req.flash("success","Listing Updated!");

  res.redirect(`/listings/${id}`) //show route
//  console.log(result);
}))

//DELETE route
router.delete("/:id",wrapAsync(async(req,res)=>{
   let {id}=req.params;
   let deletedListing= await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   req.flash("success","Listing Deleted !")
   res.redirect("/listings");
}))

module.exports=router;