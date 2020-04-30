var Campground = require("../models/campground");
var Comment    = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCommentOwnership = function(req,res,next){
    // if user logged in
    if(req.isAuthenticated())
    {
        Comment.findById(req.params.comment_id, function(err,foundComment){
            if(err || !foundComment)
            {
                req.flash("error","Comment not found");
                res.redirect("back");
            }
            else 
            {
                // does user is author of this post
                if(foundComment.author.id.equals(req.user._id))
                {
                    next();
                }
                else
                {
                    req.flash("error","You dont have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }
    else
    {
        req.flash("error","You have to logged in to do that!");
        res.redirect("back");
    }
}

middlewareObj.checkOwnership = function(req,res,next){
    // if user logged in
    if(req.isAuthenticated())
    {
        Campground.findById(req.params.id, function(err,foundCampground){
            if(err || !foundCampground)
            {
                req.flash("error","Campground not found");
                res.redirect("back");
            }
            else 
            {
                // does user is author of this post
                if(foundCampground.author.id.equals(req.user._id))
                {
                    next();
                }
                else
                {
                    
                    req.flash("error","You have to logged in to do that!");
                    res.redirect("back");
                }
            }
        });
    }
    else
    {
        req.flash("error","You dont have permission to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated())
    {
        return next();
    }
    req.flash("error","You have to logged in to do that!");
    res.redirect("/login");
}
module.exports = middlewareObj;
