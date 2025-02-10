const { model } = require("mongoose");
const Listing =require("./models/listing");

const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");


module.exports.isLoggedIn=(req,res,next)=>{
//  console.log(req.user);
// console.log(req);
//console.log(req.path,".." ,req.originalUrl);
    if(!req.isAuthenticated()){  
        req.session.redirectUrl=req.originalUrl; 
        req.flash("error","you must be logged in to create listing!");
          return res.redirect("/login");
    }
    next();
};

 module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
 }

 module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","you are not the owner of this listing");
        return  res.redirect(`/listings/${id}`);
    }
          next();
 }

 // validation for  listing schema(middleware)
module.exports. vaildatelisting=(req,res,next)=>{
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

//vaildate review
module.exports.vaildateReview=(req, res, next)=>{
    let {error}= reviewSchema.validate(req.body)
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg)
    }else{
        next();
    }
}