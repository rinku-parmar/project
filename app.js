const express= require("express");
const app =express();
const mongoose=require("mongoose");
const Listing =require("./models/listing");
const path =require("path");
const methodOverride = require('method-override');
const ejsMate=require("ejs-mate")
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");





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
app.get("/listings",wrapAsync(async(req,res)=>{
    const allListings= await Listing.find({})
    //.then(res=>{ console.log(res) })
    res.render("listings/index.ejs",{allListings})
}))

// -----------3---new Route
app.get("/listings/new",  (req, res) => {
    res.render("listings/new.ejs");
});

// --------2-show route-  indival information
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
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
app.post("/listings",vaildatelisting, wrapAsync(async (req,res,next)=>{  //using validation for schema(middleware)
       let result= listingSchema.validate(req.body)
       console.log(result);
       if(result.error){
        throw new ExpressError(400,result.error)
       }
        const newListing= new Listing(req.body.listing);
        await newListing.save();
          res.redirect("/listings")
    
    }) 
    )

//edit
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
       res.render("listings/edit.ejs",{listing})
}))

//update route
app.put("/listings/:id",
    vaildatelisting,
    wrapAsync(async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"send valid data for listing")
     }
    let {id}=req.params;
   const result= await Listing.findByIdAndUpdate(id,{...req.body.listing})
  res.redirect(`/listings/${id}`) //show route
//  console.log(result);
}))

//DELETE route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
   let {id}=req.params;
   let deletedListing= await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   res.redirect("/listings");
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


