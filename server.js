const express  = require('express');
const cors = require("cors");
const dotenv = require('dotenv');
const mysqlPool = require('./config/db');

require("dotenv").config();

const loginRouter = require("./routes/loginRouter");
const categoryRouter = require("./routes/categoryRouter");
const subCategoryRouter = require("./routes/subCategoryRouter");
const itemRouter = require("./routes/itemRouter");
 const cartRouter = require("./routes/cartRouter");

dotenv.config();
//rest object 
const app  = express()
//port
const port = process.env.PORT || 8000

//conditoionalli listen
mysqlPool.query('select 1').then(()=>{

    console.log("mysql db connected");
    
app.listen(port,() =>{
   console.log(`server running welcome ${process.env.PORT}`)
});
}).catch(()=>{
console.log("connection error");

})

app.use(cors());
app.use(express.json());

app.use("/api/auth", loginRouter);
app.use("/api/menu", categoryRouter);
app.use("/api/subcategories", subCategoryRouter);
app.use("/api/items", itemRouter);
app.use("/api/cart", cartRouter);

//route  
app.get('/test', (req,res) =>{
    res.status(200).send('<h1> nodejs my sql welcome</h1>')
})

app.use(express.json());




const transporter = require("./config/email");

app.get("/test-mail", async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // send to yourself
      subject: "Test Email",
      text: "Email setup is working 🎉"
    });

    res.send("Email sent successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Email failed");
  }
});

 

