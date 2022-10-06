const mongoose = require('mongoose');

mongoose.connection.on("error", (err) => {
    console.error(`MongoDB connection error: ${err}`);
    process.exit(-1);
});

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const connectDB = async (user, pass, dbName) => {
    const conn = await mongoose.connect(`mongodb+srv://${user}:${pass}@cluster0-n25kv.mongodb.net/${dbName}?retryWrites=true&w=majority`, options);
    console.log(`MongoDB Connected: ${conn.connection.db.databaseName.substring(0, 3)}******`);
}

module.exports = connectDB;