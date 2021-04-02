const bcrypt = require('bcrypt');
const User = require('../models/User');
const mongoose = require('mongoose');
const modelUser = mongoose.model('User');

let userController ={};

userController.allUsers = (req, res)=>{
    modelUser.find()
        .then(results => res.json(results))
        .catch(err => res.send(err));
}


module.exports={
async newUser(req,res){
    if(req.body.username && req.body.password){
        if(req.body.password2 && req.body.password == req.body.password2){

           await modelUser.findOne({'username':req.body.username})
                .then(user=>{
                    if(user){
                        res.json({sucess:false,message:'Username invalid'});
                    }else{
                        bcrypt.hash(req.body.password,10)
                            .then(hash =>{
                                let encryptedPassword = hash;

                                let newUser = new modelUser({
                                    name:req.body.name,
                                    email:req.body.email,
                                    username:req.body.username,
                                    password:encryptedPassword,
                                    isAdmin:req.body.isAdmin
                                });

                                newUser.save()
                                    .then(()=>res.json({success:true,massage:'User created successfully',statusCode:201}))
                                    .catch(err=> res.json({sucess:false, message:err,statusCode:500}));
                            })
                            .catch(err=> res.json({sucess:false, message:err,statusCode:500}));
                    }
                })
        }else{
            res.json({sucess:false, message:'Password invalid',statusCode:400});
        }
    }else{
        res.json({sucess:false, message:'User and password invalid',statusCode:400});
    }
},

async updateUser(req,res){
    bcrypt.hash(req.body.password,10)
        .then(hash =>{
            let encryptedPassword = hash;
            let updateUser = {
                name:req.body.name,
                email:req.body.email,
                username:req.body.username,
                password:encryptedPassword,
                isAdmin:req.body.isAdmin
            };
            console.log(updateUser)
            const id=req.body.id;
            modelUser.findOneAndUpdate({"_id":id},{$set:updateUser},{new:true},(err,model)=>{
                if(err){
                    res.json({sucess:false, message:err,statusCode:500})
                }
                else{
                    res.json({success:true,update:model,statusCode:200})
                }
            })
    
        })
    }
}