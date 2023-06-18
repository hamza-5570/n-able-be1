const express = require("express");
var cors = require("cors");
const app = express();
const routes = require("./routers/routes");




app.use(express.json({ urlencoded: true }));

app.use(cors());


const PORT = process.env.PORT || 3900;

/***Route binding*/
app.use("/", routes);

/*******MongoDB Connectivity */
const connectDB = require("./config/database");

connectDB();


const server = app.listen(PORT, () => {
  console.log(
    "The project is running on PORT 3900 AdminJS is under http://localhost:3900/admin"
  );
});




