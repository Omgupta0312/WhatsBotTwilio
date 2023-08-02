const express = require("express");
const User = require("./models/user.js");
const userRouters = require("./routes/user.js");

require("dotenv").config();

const mongoose = require("mongoose");
mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
const port = 3000; // Change the port as needed

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//router
app.use("/", userRouters);

app.listen(port || process.env.PORT, () => {
  console.log(`Server running on port ${port}`);
});
