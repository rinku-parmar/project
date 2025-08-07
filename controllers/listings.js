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