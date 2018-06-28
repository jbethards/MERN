const express= require('express');
const mongoose = require('mongoose');
const bodyParser=require('body-parser');
const users=require('./routes/api/users');
const profile=require('./routes/api/profile');
const posts=require('./routes/api/posts');

const app=express();
const db = require('./config/keys').mongoURI;
//body parser middlewate
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
mongoose
    .connect(db)
    .then(()=>console.log('MongoDB connected'))
    .catch(err=>console.log(err));
app.get('/',(req,res)=> res.send('Hello World! 1:35'));
//Use routes
app.use('/api/users',users);
app.use('/api/profile',profile);
app.use('/api/posts',posts);


const port=process.env.PORT || 5000;
app.listen(port,()=>console.log(`server running on port ${port}`));
