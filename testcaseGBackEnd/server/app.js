const express = require("express");
const downloadsRoutes = require("./routes/downloads")
const path = require('path')
const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Request-With, Content-Type,Accept,Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE,PUT, OPTIONS"
  );
  next();
});

app.get("/test",(req,res,next)=>{
  console.log("test")
  res.status(200).json({
    messgae:'test api'
  })
})

app.use("/api/downloads", downloadsRoutes);
app.use("/files", express.static(path.join(__dirname,"files")));



module.exports = app