const express= require("express");
const app =express();
const mongoose=require("mongoose");
const Listing =require("./models/listing");
const path =require("path");
const methodOverride = require('method-override');
const ejsMate=require("ejs-mate")
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review =require("./models/reviews.js");



const listings =require("./routes/listing.js");



const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log('connected to DB');
}).catch((err)=>{console.log(err);})

async function main() {
    await mongoose.connect(MONGO_URL);
  }


  app.set("view engine", "ejs");
 app.set("views",path.join(__dirname,"views"));
 app.use(express.urlencoded({extended:true}))
 app.use(methodOverride('_method'));
 app.engine('ejs', ejsMate);
 app.use(express.static(path.join(__dirname,"/public")))


app.get("/",(req,res)=>{
    res.send("hi i am root");
})


const vaildateReview=(req, res, next)=>{
    let {error}= reviewSchema.validate(req.body)
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg)
    }else{
        next();
    }
}

app.use("/listings",listings)

/*reviews----------------------*/
//post route 
app.post("/listings/:id/reviews",vaildateReview,wrapAsync(async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newReview =new Review(req.body.review);

    listing.reviews.push(newReview);

  await  newReview.save();
  await listing.save();

//   console.log('new review  save');//  res.send('new review  save');
res.redirect(`/listings/${listing._id}`)

}));
// Delete -review route 
app.delete("/listings/:id/reviews/:reviewId",
    wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    console.log(`Review ID: '${reviewId}'`);

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`)
}))

app.all("*" ,(req,res,next)=>{
    next(new ExpressError(404,"page not found!"))
})

app.use((err,req,res,next)=>{
    // res.send("somting wrong")
    let {statusCode=500,message="somting went wrong!"}=err;
   res.status(statusCode).render("error.ejs",{message})

    // res.status(statusCode).send(message)
    
})

app.listen(8080,()=>{
    console.log('sever is listenning to port 8080');
})


//Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
/* 
app.get("/testListing",async(req,res)=>{
let sampleListing= new Listing({
    title:"my new villa",
    description:"by the beach",
    price:1200,
    location:"Calangute, Goa",
    country:"india"
})
await sampleListing.save();
console.log('sample was saved');
res.send("suceesful testing")
 }); */


