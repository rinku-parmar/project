const Listing=require("../models/listing")

//store  all callback
//index
module.exports.index = async(req,res)=>{
    const allListings= await Listing.find({});
    //.then(res=>{ console.log(res) })
    res.render("listings/index.ejs",{allListings})
}

// new route 
module.exports.renderNewForm=  (req, res) => {
    /*.without login user cann't create listings*/
    // console.log(req.user);
    // if(!req.isAuthenticated()){  
    //     req.flash("error","you must be logged in to create listing!");
    // //    return res.redirect("/listings");
    //       return res.redirect("/login");
    // }
    res.render("listings/new.ejs");
}

//show route
module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    }).populate("owner");
    //flash
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings")
    }
    // console.log(listing);
    res.render("listings/show.ejs",{listing})
    // console.log(id);
}

// create route
module.exports.createListing=async (req,res,next)=>{  //using validation for schema(middleware)
 
        const newListing= new Listing(req.body.listing);
        newListing.owner=req.user._id; 
        await newListing.save();
        //flash
        req.flash("success","New Listing Created!");
          res.redirect("/listings");
    
    }

    // edit 
    module.exports.renderEditForm=async(req,res)=>{
        let {id}=req.params;
        const listing=await Listing.findById(id);
        if(!listing){
            req.flash("error","Listing you requested for does not exist!");
            res.redirect("/listings")
        }
           res.render("listings/edit.ejs",{listing})
    }
    //update route
    module.exports.updateListing=async(req,res)=>{
        // if(!req.body.listing){
        //     throw new ExpressError(400,"send valid data for listing")
        //  }
        let {id}=req.params;
       const result= await Listing.findByIdAndUpdate(id,{...req.body.listing});
    
       req.flash("success","Listing Updated!");
    
      res.redirect(`/listings/${id}`) //show route
    //  console.log(result);
    }

    //delete 
    module.exports.destroyListing=async(req,res)=>{
       let {id}=req.params;
       let deletedListing= await Listing.findByIdAndDelete(id);
       console.log(deletedListing);
       req.flash("success","Listing Deleted !")
       res.redirect("/listings");
    }