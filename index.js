const express = require('express');
const mongodb = require('mongodb');

const app = express();
const MongoClient= mongodb.MongoClient;

const dbUrl ='mongodb+srv://jyotipatil:jyoti1234@cluster0.o6uv7.mongodb.net/';
const dbName= 'db1';

app.use(express.json());

let client;

// intialize MongoDB Connection Once
async function connectDB(){
    if(!client){
    try{
        client = await MongoClient.connect(dbUrl);
      console.log("Connected to MongoDB");
    }catch(error){
        console.error('mongoDB connection error:',error);
        throw new Error('failed to connect to MongoDB');
    }
    }
    return client.db(dbName);
}
//get all users
app.get('/',async(req,res)=>{
    try{
        const db=await connectDB();
            const users= await db.collection('userDetails').find().toArray();
            res.json({message:'Displaying all records',users});
    }
    catch(error){ 
        console.error(error);
        res.status(500).json({message:'Internal Server Error'});
    }
});
// insert New Record
app.post('/',async(req,res)=>{
    try{
        const db=await connectDB();
        const result=await db.collection('userDetails').insertOne(req.body);
        res.json({message:'Record inserted',insertedId: result.insertedId});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message:'Internal Server Error'});
    }
});
//fetch user by id
app.get('/fectch/:id',async(req,res)=>{
    try{
        const db = await connectDB();
        const id = parseInt(req.params.id);
        const user= await db.collection('userDetails').findOne({id});
        if(user){
            res.json({message:'Record Found',user});
        }
        else{
            res.status(404).json({message:'Record not found'});
        }
    }
    catch(error){
        console.error(error);
        res.status(500).json({message:'Internal Server Error'});
    }
});
//update user by name
app.put('/update/:name',async(req,res)=>
{
    try{
        const db=await connectDB();
        const name= req.params.name;
        const updateData ={$set:req.body};
        const result=await db.collection('userDtails').updateOne({name},updatedData);
        if(result.modifiedCount>0)
        {
            res.json({message:'Record Updated'});
        }
        else{
            res.status(404).json({message:'Record not found or no change made'});
        }
    }
    catch(error){
        console.error(error);
        res.status(500).json({message:'Internal Server Eror'});
    }
});
// delete the user by name
app.delete('/delete/:name',async(req,res)=>{
    try{
        const db = await connectDB();
        const name = req.params.name;
        const result=await db.collection('userDetails').deleteOne({name});
        if(result.deletedCount>0){
            res.json({message:'Record is Deleted'});
    }
    else{
        res.status(404).json({message:'Record not found'});
    }
    }
    catch(error){
        console.error(error);
        res.status(500).json({message:'Internal Server Eror'});
    }
});
app.listen(8000,()=> console.log('server is running on port 8000'));
