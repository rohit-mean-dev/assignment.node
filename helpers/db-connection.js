const mongoose = require('mongoose');

module.exports = () => {

    mongoose.connect(process.env.DB_URI,
        { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
        .then(() => console.log(`MongoDB Connection Succeeded.`))
        .catch((error) => console.log(`Error in DB connection: ${error}`));

    mongoose.connection.on("connected", () => {
        console.log("Mongoose connected to db...");
    });

    mongoose.connection.on("error", (error) => {
        console.log(error.message);
    });

    mongoose.connection.on("disconnected", () => {
        console.log("Mongoose connection is disconnected...");
    });

    process.on("SIGINT", async () => {
        await mongoose.connection.close();
        process.exit(0);
    });
}