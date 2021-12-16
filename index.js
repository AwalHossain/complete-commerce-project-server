const express = require("express");
const app = express();
const port = process.env.PORT || 7000;
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
// middleware
app.use(express.json());
//environment config
const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB connection successful"))
  .catch((err) => console.log(err));

//Reat api

app.use("/api/auth", authRoute);
app.use("/api", userRoute);

app.listen(port, () => {
  console.log(`This app listening at https: ${port}`);
});
