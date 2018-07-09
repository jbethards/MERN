const express=require('express');
const router= express.Router();
const mongoose= require('mongoose');
const passport=require('passport');
//load profile model
const Profile=require('../../models/Profile');
//load user profile
const User=require('../../models/User');
//load validation
const validateProfileInput=require('../../validation/profile');


//@route GET api/profile/test
//@desc tests profile route
//@access Public
router.get('/test',(req,res)=> res.json({msg:"Profile works"})
);

//@route GET api/profile
//@desc get current users profile
//@access Private
router.get('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const errors={};
    Profile.findOne({user:req.user.id})
    .populate('user',['name','avatar'])
    .then(profile=>{
        if(!profile){
            errors.noprofile="There is no profile for this user";
            return res.status(404).json(errors);
        }
        res.json(profile);

    })
    .catch(err=>res.status(404).json(err));
});
//@route GET api/profile/all
//@desc Get all profiles
//@access public
router.get('/all',(req,res)=>{
    Profile.find()
    .populate('user',['name','avatar'])
    .then(profiles=>{
        if(!profiles){
            errors.noprofile="There are profile for this user";
            return res.status(404).json(errors);
        }
        res.json(profiles)
    }).catch(err=>
        res.status(404).json({profile:'There are no profiles'})
    );
});



//@route GET api/profile/handle/handle
//@desc Get Profile by handle
//@access public
router.get('/handle/:handle',(req,res)=>{
    const errors={};
    Profile.findOne({handle:req.params.handle})
    .populate('user',['name','avatar'])
    .then(profile=>{
        if(!profile){
            error.noprofile="There is no profile for this user.";
            res.status(404),json(errors);
        }
        res.json(profile);
    }).catch(err=>res.status(404).json(err));
});
//@route GET api/profile/user/:user_id
//@desc Get Profile by user_id
//@access public
router.get('/user/:user_id',(req,res)=>{
    const errors={};
    Profile.findOne({user:req.params.user_id})
    .populate('user',['name','avatar'])
    .then(profile=>{
        if(!profile){
            error.noprofile="There is no profile for this user.";
            res.status(404),json(errors);
        }
        res.json(profile);
    }).catch(err=>res.status(404).json({profile:"There is no prfile for this user."}));
});



//@route POST api/profile
//@desc create or edit current users profile
//@access Private
router.post('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const {errors,isValid}=validateProfileInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }
    //get fields
    const profileFields={};
    profileFields.user=req.user.id;
    if(req.body.handle)profileFields.handle=req.body.handle;
    if(req.body.website)profileFields.website=req.body.website;
    if(req.body.company)profileFields.company = req.body.company;
    if(req.body.location)profileFields.location=req.body.location;
    if(req.body.bio)profileFields.bio=req.body.bio;
    if(req.body.status)profileFields.status=req.body.status;
    if(req.body.githubusername)profileFields.githubusername=req.body.githubusername;
   //skills split intoa a array
    if(typeof req.body.skills !== 'undefined'){
        profileFields.skills= req.body.skills.split(",");
    }
    profileFields.social={};
    if(req.body.youtube)profileFields.social.youtube=req.body.youtube;
    if(req.body.twitter)profileFields.social.twitter=req.body.twitter;
    if(req.body.facebook)profileFields.social.facebook=req.body.facebook;
    if(req.body.linkedin)profileFields.social.linkedin=req.body.linkedin
   if(req.body.instagram)profileFields.instagram=req.body.instagram;
    Profile.findOne({user:req.user.id}).then(profile=>{
        if(profile){
            Profile.findOneAndUpdate(
                {user:req.user.id},
                {$set: profileFields},
                {new:true})
                .then(profile => res.json(profile));
        }
        else{
            //create

            //check if handle exists
            Profile.findOne({handle:profileFields.handle}).then(profile=>{
                if(profile){
                    errors.handle = "that handle already exists";
                    res.status(400).json(errors);
                }
                //save profile
                new Profile(profileFields).save().then(profile=>res.json(profile));
            });
        
        }
    })
    

});
module.exports=router;