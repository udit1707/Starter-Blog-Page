var express = require("express"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    app = express();
mongoose.connect("mongodb://localhost/blog_app", { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
var blogSchema = new mongoose.Schema({ title: String, image: String, body: String, created: { type: Date, default: Date.now } });
var Blog = mongoose.model("Blog", blogSchema);
//ROUTES CONFIG
app.get("/", function(req, res) {
    res.redirect("/blogs");
});
app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs) {
        if (err) { console.log(err); } else { res.render("index", { blogs: blogs }); }
    });

});
app.get("/blogs/new", function(req, res) {
    res.render("new");
});
app.post("/blogs", function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newblog) {
        if (err) res.render("new");
        else { res.redirect("/blogs"); }
    });
});
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundblog) {
        if (err) { res.redirect("/"); } else
            res.render("show", { blog: foundblog });
    });
});
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundblog) {
        if (err) { res.redirect("/"); } else
            res.render("edit", { bl: foundblog });
    });

});
app.put("/blogs/:id", function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
        if (err) { res.redirect("/blogs"); } else
            res.redirect("/blogs/" + req.params.id);
    });
});
app.delete("/blogs/:id", function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if (err)
            res.redirect("/blogs");
        else
            res.redirect("/blogs");
    });

});







app.listen(2911, function() {
    console.log("Blog_App Server has started");
});