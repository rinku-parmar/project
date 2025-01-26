const express= require("express");
const app =express();
const mongoose=require("mongoose");
const Listing =require("./models/listing");
const path =require("path");
const methodOverride = require('method-override');
const ejsMate=require("ejs-mate")
const wrapAsync=require("./utils/wrapAsync.js")

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

//-------1-index route :show all
app.get("/listings",async(req,res)=>{
    const allListings= await Listing.find({})
    //.then(res=>{ console.log(res) })
    res.render("listings/index.ejs",{allListings})
})

// -----------3---new Route
app.get("/listings/new",  (req, res) => {
    res.render("listings/new.ejs");
});

// --------2-show route-  indival information
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing})
    // console.log(id);
})

//--4.crate route
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
app.post("/listings",async (req,res,next)=>{
    try{
        const newListing= new Listing(req.body.listing);
         await newListing.save();
          res.redirect("/listings")
    }catch(err){
        next(err);
    }
       
    }) 
    

//edit
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
       res.render("listings/edit.ejs",{listing})
})

//update route
app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params;
   const result= await Listing.findByIdAndUpdate(id,{...req.body.listing})
  res.redirect(`/listings/${id}`) //show route
//  console.log(result);
})

//DELETE route
app.delete("/listings/:id",async(req,res)=>{
   let {id}=req.params;
   let deletedListing= await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   res.redirect("/listings");
})



app.listen(8080,()=>{
    console.log('sever is listenning to port 8080');
})

app.use((err,req,res,next)=>{
    res.send("somting wrong")
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


