const mongoose = require("mongoose");
const initData = require("./data.js"); //require
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
        // console.log(err.errors.image.properties.message);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: '67a45b0ba7773652b40120d2' }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB(); //clg