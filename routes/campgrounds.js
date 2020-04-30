var routes      = require("express").Router(),
    Campground  = require("../models/campground"),
    middleware  = require("../middleware");

// SHOW CAMPGROUNDS
routes.get("/",function(req,res){
    // Get all campground from db
    Campground.find({},function(err,allCampgrounds)
    {
        if(err)
        {
            console.log("Error");
        }
        else
        {
            res.render("campgrounds/index",{campgrounds:allCampgrounds});
        }
    });
    // res.render("campgrounds",{campgrounds:campgrounds});
});

// CREATE CAMPGROUND
routes.post("/",middleware.isLoggedIn,function(req,res){
    // get data using body-parser
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCamp = {name:name,image:image, description: desc, author: author}
    // Create a new campground and save to DB
    Campground.create(newCamp,function(err,newlyCreated){
        if(err){
            console.log("Error");
        }
        else
        {
            // redirect to campgrounds
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});

// NEW CAMPGROUND PAGE
routes.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});

// SHOW CAMPGROUND INFO
routes.get("/:id",function(req, res){
    // find campground with provide ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground)
        {
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds");
        }
        else
        {
            // render show template with that campground.
            res.render("campgrounds/show",{campground: foundCampground}) ;
        }
    });
});

// EDIT CAMPGROUND
routes.get("/:id/edit",middleware.checkOwnership,function(req, res) {
    Campground.findById(req.params.id, function(err,foundCampground){
        res.render("campgrounds/edit",{campground:foundCampground});
    });
});

// UPDATE CAMPGROUND
routes.put("/:id",middleware.checkOwnership,function(req,res){
   // find and update the correct campground
   Campground.findByIdAndUpdate(req.params.id, req.body.campground,function(err, updatedCampground){
        if(err)
        {
            res.redirect("/campgrounds");
        }
        else
        {
            // redirect somewhere(show page)
            res.redirect("/campgrounds/" + req.params.id);
        }
   });
});

// DESTROY CAMPGROUND
routes.delete("/:id",middleware.checkOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err)
        {
            res.redirect("/campgrounds");
        }
        else 
        {
            res.redirect("/campgrounds");
        }
    });
});






module.exports = routes;