//create api send states to backend
//inside api directory, we have express app for backend

const express = require('express')
const cors = require('cors');
const Transaction = require('./models/transaction')
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res)=>{
    res.json('test ok5');
})

app.post('/api/transactions', async(req, res)=>{
    //connect to mongo database using mongoose
    await mongoose.connect(process.env.MONGO_URL)
    //grab all data from req body
    const{name,price, description, datetime} = req.body;
    //now putting data inside transaction model
    const transaction= await Transaction.create({name,price, description, datetime})

    //response with json file
    res.json(transaction);

})
app.get('/api/transactions', async(req, res)=>{
    //connect with database
    await mongoose.connect(process.env.MONGO_URL)
    const transaction = await Transaction.find({})
    res.json(transaction)
})

//4040 for backend, 3000 for react app=== start both at same time

//use this port if only running on local machine
if(process.env.API_PORT){
    app.listen(process.env.API_PORT);
}

//preparing for vercel deployment
module.exports = app;