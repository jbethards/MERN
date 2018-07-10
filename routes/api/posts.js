const express=require('express');
const router= express.Router();
const mongoose=require('mongoose');
const passport = require('passport');
const Post = require('../../models/Post');
//profile model
const Profile = require('../../models/Profile');
const validatePostInput = require('../../validation/post');
//@route GET api/posts/test
//@desc tests posts route
//@access Public
router.get('/test',(req,res)=> res.json({msg:"Posts works"})
);
//@route Get api/posts
//@desc Get Post
//@access Public
router.get('/',(req,res)=>{
    Post.find().sort({date:-1})
    .then(posts=>res.json(posts))
    .catch(err=>res.status(404).json({nopostfound:"No post found with that ID"}));

});
//@route Get api/posts/:id
//@desc Get Post by ID
//@access Public
router.get('/:id',(req,res)=>{
    Post.findById(req.params.id)
    .then(post=>res.json(post))
    .catch(err=>res.status(404).json({nopostfound:"No post found with that ID"}));
});



//@route Post api/posts
//@desc Create Post
//@access Private
router.post('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const {errors, isValid}=validatePostInput(req.body);
    if(!isValid){
        //If any errors, send 400
        return res.status(400).json(errors);
    }
    const newPost= new Post({
        text:req.body.text,
        name:req.body.name,
        avatar:req.body.avatar,
        user:req.user.id
    });
    newPost.save().then(post=>res.json(post))
});
//@route delete api/posts/:id
//@desc delete post by ID
//@access Private
router.delete('/:id',passport.authenticate('jwt', {session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id})
    .then(profile=>{
        Post.findById(req.params.id)
        .then(post=>{
            //check for post owner
            if(post.user.toString() !==req.user.id){
                return res.status(401).json({notauthorized:"User not found"});

            }
            //delete
            post.remove().then(()=>res.json({success:true}));
        })
        .catch(err=>res.status(404).json({postnotfound:'Post not found'}));
    })
})
module.exports=router;