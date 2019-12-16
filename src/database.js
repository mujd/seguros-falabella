const mongoose = require("mongoose");

const mongoDB = async(res, err) => {
    await mongoose.connect('mongodb://localhost:27017/segurosFalabellaDB', {
        // useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    if (err) throw err;
    console.log("Database: \x1b[32m%s\x1b[0m", "online");
}

module.exports = { mongoDB };