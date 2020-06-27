var express = require("express"),
methodOverride = require("method-override"),
bodyParser=require("body-parser"),
mongoose=require("mongoose"),
app = express();

mongoose.connect("mongodb://localhost/store_management");
var port = process.env.PORT || 8080;
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

var storeSchema = new mongoose.Schema({
    itemCode: String,
    item: String,
    itemName: String,
    qty: String,
    costPrice: Number,
    sellPrice: Number
});
var Item = mongoose.model("Item", storeSchema);

app.get("/", function(req,res){
    res.render("login");
});

app.get("/home", function(req,res){
    Item.find({}, function(err, items){
        if(err){
            console.log("ERROR!");
        } else {
            res.render("index", {items: items});
        }
    });
});

app.get("/add", function(req,res){
    res.render("add");
});

app.post("/items", function(req,res){
    Item.create(req.body.item, function(err, newItem){
        if(err){
            console.log("ERROR!");
        }else {
            res.redirect("/home");
        }
    });
});

app.get("/items/:id/edit", function(req,res){
    Item.findById(req.params.id, function(err, foundItem){
        if(err){
            console.log("ERROE!");
        }else{
            res.render("edit", {item: foundItem});
        }
    });
});

app.put("/items/:id", function(req,res){
   Item.findByIdAndUpdate(req.params.id, req.body.item, function(err, updated){
    if(err){
        console.log("ERROR!");
    }else{
        res.redirect("/home");
    }
   });
});

app.delete("/items/:id", function(req,res){
    Item.findByIdAndRemove(req.params.id, function(err){
        if(err){
        console.log("ERROR!");
        }else{
            res.redirect("/home");
        }
    });
});

app.get("/bill", function(req,res){
    res.render("bill");
});

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});