var express = require("express");
var app = express();
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

app.use(express.static("public"));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost/blogapp");

//SETUP SCHEMA
var blogappSchema = new mongoose.Schema({
    title: String,
    image: String,
    body : String,
    created: {type: Date, default: Date.now}
});
//Compile Schema into a model 
var Blogapp = mongoose.model("Blogapp", blogappSchema);

//Blogapp.create({
 //   title: "Test blog",
 //   image: "http://semantic-ui.com/images/devices.png",
//    body:  "Its a test"
//}, function(err, newblog){
 //   if (err){
 //       console.log(err);
 //   } else {
 //       console.log("new blog created");
 //   }
//});
app.get("/", function(req, res){
   res.redirect("/blogs"); 
});

app.get("/blogs", function(req, res){
    Blogapp.find({}, function(err, findBlog){
        if(err){
            console.log(err);
        } else {
            res.render("index", {findBlog:findBlog});
        }
    });
});
//NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new");
});
//create Route
app.post("/blogs", function(req, res){
    //this code will prevent javascript from beein written in the blog.body
    req.body.blog.body  = req.sanitize(req.body.blog.body);
    
    //create blog
    Blogapp.create(req.body.blog, function(err, newBlog){
    if (err){
        console.log(err);
    } else {
         //then, redirect to the index
         res.redirect("/blogs");   
         }
   });
   
});
// Show Route
app.get("/blogs/:id", function(req, res){
    //res.send("show page");
    Blogapp.findById(req.params.id, function(err, foundBlog){
    if (err){
        res.redirect("/blogs");
    } else {
         //then, redirect to the index
         res.render("show", {blog:foundBlog});   
         }
   });
    
});
// Edit Route
app.get("/blogs/:id/edit", function(req, res){
    Blogapp.findById(req.params.id, function(err, foundBlog){
    if (err){
        res.redirect("/blogs");
    } else {
         //then, redirect to the index
         res.render("edit", {blog:foundBlog});   
         }
   });
    
});
// Update Route
app.put("/blogs/:id", function(req, res){
   // res.send("Update Route");
      Blogapp.findByIdAndUpdate(req.params.id,req.body.blog, function(err, updatedBlog){
      if (err){
        res.redirect("/blogs");
    } else {
        //then, redirect to the index
        res.redirect("/blogs/" + req.params.id)   ;
         }
   });
});
// Destroy Route
app.delete("/blogs/:id", function(req, res){
   // res.send("Update Route");
      Blogapp.findByIdAndRemove(req.params.id, function(err, updatedBlog){
      if (err){
        res.redirect("/blogs");
    } else {
        //then, redirect to the index
        res.redirect("/blogs");
         }
   });
});




app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server has started"); 
});