const express = require('express');
const cors = require("cors");
const app = express();
const IndexRouter = require('./routes/index');
const AuthRouter = require('./routes/auth');
require("dotenv").config();

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.use(cors());
app.use(express.json())
app.use("/", IndexRouter);
app.use("/", AuthRouter);




const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});