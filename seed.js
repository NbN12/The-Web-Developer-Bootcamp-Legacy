var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name:"Newton Campground",
        image:"http://www.buyseaislenj.com/sea_isle_city_cape_may_county_campgrounds_island_realty_group_12072011.jpg",
        description:"blah blah blur"
    },
    {
        name:"National Campground",
        image:"http://www.nationalparks.nsw.gov.au/~/media/DF58734103EF43669F1005AF8B668209.ashx",
        description:"blah blah blur"
    },
    {
        name:"Madison Campground",
        image:"https://www.justahead.com/wp-content/uploads/2015/08/madison-campground-11.jpg",
        description:"blah blah blur"
    }
]

function seedDB(){
    Campground.remove({},function(err){
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log("remove all campgrounds");
            data.forEach(function(seed){
                    Campground.create(seed,function(err,campground){
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        console.log("added a campground");
                        Comment.create(
                            {
                                text:"This place is great, but i wish there was internet",
                                author:"Homer"
                                
                            },function(err,comment){
                                if(err)
                                {
                                    console.log(err);
                                }
                                else
                                {
                                    // Create a new comment
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Create new comment");
                                }
                            });
                    }
                });
            });
        }
    });
    // add a few campgrounds
    // not safe to use in nodejs
    // data.forEach(function(seed){
    //         Campground.create(seed,function(err,data){
    //         if(err)
    //         {
    //             console.log(err);
    //         }
    //         else
    //         {
    //             console.log("added a campground");
    //         }
    //     });
    // });
}
module.exports = seedDB;