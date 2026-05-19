const express=require('express');
const cors=require('cors');
const fs=require('fs-extra');
require('dotenv').config();

const app=express();

app.use(cors());
app.use(express.json());

const DB='./database.json';

async function loadDB(){
 return await fs.readJson(DB);
}

async function saveDB(data){
 await fs.writeJson(DB,data,{spaces:2});
}

app.post('/register',async(req,res)=>{
 const db=await loadDB();

 const user={
   id:'BR'+Date.now(),
   name:req.body.name,
   phone:req.body.phone,
   password:req.body.password,
   balance:2000,
   referrals:[]
 };

 db.users.push(user);

 await saveDB(db);

 res.json({
   success:true,
   user
 });
});

app.post('/login',async(req,res)=>{
 const db=await loadDB();

 const user=db.users.find(x=>
   x.phone===req.body.phone &&
   x.password===req.body.password
 );

 if(!user){
   return res.json({success:false});
 }

 res.json({
   success:true,
   user
 });
});

app.post('/admin-login',(req,res)=>{
 if(req.body.pin===process.env.ADMIN_PIN){
   return res.json({success:true});
 }

 res.json({success:false});
});

app.get('/withdraw/:id',async(req,res)=>{
 const db=await loadDB();

 const wd=db.withdraws.find(x=>x.id===req.params.id);

 if(!wd){
   return res.json({success:false});
 }

 const user=db.users.find(x=>x.id===wd.userId);

 res.json({
   success:true,
   withdraw:wd,
   user
 });
});

app.listen(process.env.PORT||3000,()=>{
 console.log('SERVER RUNNING');
});