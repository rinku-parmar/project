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
