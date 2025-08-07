const Listing=require("../models/listing")


module.exports.index = async(req,res)=>{
    const allListings= await Listing.find({});
    //.then(res=>{ console.log(res) })
    res.render("listings/index.ejs",{allListings})
}