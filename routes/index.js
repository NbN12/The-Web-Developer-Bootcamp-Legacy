var routes      = require("express").Router(),
    User        = require("../models/user"),
    passport    = require("passport");

// INDEX PAGE
routes.get("/",function(req,res){
    res.render("landing");
});

// GET REGISTER FORM
routes.get("/register",function(req,res){
    res.render("register");
});

// LOGIC SIGN UP
routes.post("/register",function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password,function(err,user){
        if(err)
        {
            console.log(err);
            //return res.render("register",{"error":err.message});
            req.flash("error",err.message)
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success","Welcome to Yelpcamp "+user.username);
            res.redirect("/campgrounds");
        });
    });
});

// SHOW LOGIN FORM
routes.get("/login", function(req, res){
    res.render("login");
});

// LOGIC LOGIN FORM
routes.post("/login",passport.authenticate("local",
{
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash:'User or Password not correct or User or Password not exist',
    successFlash: "Welcome to Yelpcamp"
}),function(req, res){
});

// LOGOUT ROUTE
routes.get("/logout",function(req, res){
    req.logout();
    req.flash("success", "You have logged out");
    res.redirect("/campgrounds");
});

module.exports = routes;