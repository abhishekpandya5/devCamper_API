const mongoose = require('mongoose');

/* we can also use promise and .then(conn) syntax
const connectDB = () => {
    mongoose.connect().then(conn)
} */

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline.bold);
};
//await because it returns a promise

module.exports = connectDB;
