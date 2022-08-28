const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

//var admin = false;
var passcode = "g9admin2022";

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));

//------------------------------------------------- MONGOOSE CONNECT --------------------------------------------

//mongoose.connect('mongodb://localhost:27017/blogDocsDB', {useNewUrlParser: true});
mongoose.connect('mongodb+srv://admin-mitadru:yHwIPYWVm5MbaJoQ@cluster0.hvkjs.mongodb.net/BlogDocs', {useNewUrlParser: true});
const itemSchema = {
  date: String,
  head: String,
  text: String
}
const Item = mongoose.model("Item", itemSchema);

var today = new Date();
var dated = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

//------------------------------------------------- HOMEPAGE & COMPOSE --------------------------------------------

app.get("/", function (req, res) {
  Item.find({}, function (err, dataArr) {
    res.render("home", {listItems: dataArr});
  });
});

app.get("/admin", function (req, res) {
  Item.find({}, function (err, dataArr) {
    res.render("list", {listItems: dataArr});
  });
});
app.post("/admin", function (req, res) {
  res.sendFile(__dirname + "/compose.html");
});

app.post("/compose", function (req, res) {
  var heading = req.body.divHead;
  var textual = req.body.divText;
  const newBlog = new Item({
    date: dated,
    head: heading,
    text: textual
  });
  newBlog.save();
  res.redirect("/admin");
});

//------------------------------------------------- NAVBAR BUTTONS --------------------------------------------

app.get("/about", function (req, res) {
  var aboutData = "A blog (a truncation of 'weblog') is a discussion or informational website published on the World Wide Web consisting of discrete, often informal diary-style text entries (posts). Posts are typically displayed in reverse chronological order, so that the most recent post appears first, at the top of the web page. $ Nowadays, a blog is a regularly updated website or web page, and can either be used for personal use or to fulfill a business need. $ This Website is all about Personal Blogging. Here anyone can view admin's Daily Study Work Journal as well as contact to admin about more details. But only Admin has access to Compose, post and delete blogs. Each Blogs will be associated with post date and heading...";
  var aboutDatas = aboutData.split("$");
  res.render("info", {Title: "About", Content: aboutDatas});
});
app.get("/contact", function (req, res) {
  var contactData = "If you want to know more about these blogs and how I did/learnt those tasks or else you found any doubt about this website working or the blogging process or you want to know the backend working process of this Website, please feel free to contact us at the given Phone Number or Mail at given EMail Id";
var contactDatas = contactData.split("$");
  res.render("info", {Title: "Contact", Content: contactDatas});
});

//------------------------------------------------- ADMIN SECTION --------------------------------------------

app.get("/signup", function (req, res) {
  res.sendFile(__dirname + "/sign-up.html");
});
app.post("/signup", function (req, res) {
  var password = req.body.pass;
  if(password === passcode){
    // admin = true;
    res.redirect("/admin");
  }
  else res.redirect("/signup");
});

app.post("/logout", function (req, res) {
  // admin = false;
  res.redirect("/");
});

//------------------------------------------------- DELETE BLOGS --------------------------------------------

app.post("/delete", function (req, res) {
  let idDel = req.body.delButton;
  Item.findByIdAndRemove(idDel, function (err) {
    if(!err){
      res.redirect("/admin");
    }
  });
});

//__________________________________________________________________________________________________________

let port = process.env.PORT;
if(port == null || port == "")
  app.listen(3000);
else app.listen(port);

//C:\Program Files\MongoDB\Server\5.0\bin
