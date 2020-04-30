var routes      = require("express").Router({mergeParams: true}),
    Comment     = require("../models/comment"),
    Campground  = require("../models/campground"),
    middleware  = require("../middleware");
    

// NEW COMMENT
routes.get("/new", isLoggedIn, function(req,res){
    Campground.findById(req.params.id,function(err, campground){
        if(err)
        {
            res.render("/campgrounds");
        }
        else
        {
            // console.log(campground);
            res.render("comments/new",{campground: campground});
        }
    });
});

// CREATE COMMENT
routes.post("/", isLoggedIn, function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err)
        {
            
            res.redirect("/campgrounds");
        }
        else
        {
            // create new comment
            Comment.create(req.body.comment,function(err,comment){
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    console.log("New user will be: "+req.user.username);
                    // save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment);
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// EDIT COMMENT
routes.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err || !foundCampground)
        {
            req.flash("error","No campground found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err)
           {
               res.redirect("back");
           }
           else
           {
               res.render("comments/edit",{campground_id: req.params.id,comment:foundComment })
           }
   });
    });
   
});

// UPDATE COMMENT
routes.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err)
   {
      if(err)
      {
          res.redirect("back");
      }
      else
      {
          res.redirect("/campgrounds/"+req.params.id);
      }
   });
});

// DELETE COMMENT
routes.delete("/:comment_id",middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err)
        {
            res.redirect("back");
        }
        else 
        {
            req.flash("success","Comment deleted");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

// middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect("/login");
}

module.exports = routes;