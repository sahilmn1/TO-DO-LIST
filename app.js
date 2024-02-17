const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
// Set the views directory
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose
  .connect("mongodb://127.0.0.1:27017/tolistDB")
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });

const todoSchema = new mongoose.Schema({
  listname: String,
});

const Item = mongoose.model("Item", todoSchema);

const item1 = new Item({
  listname: "Welcome sir to our todo list",
});

const item2 = new Item({
  listname: "Khana khaunga",
});

const item3 = new Item({
  listname: "Pani piunga",
});

const defaultArray = [item1, item2, item3];



app.get("/", function (req, res) {
  Item.find({})
    .then((foundItems) => {
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    })
    .catch((err) => {
      console.log("Error:", err);
      res.status(500).send("Internal Server Error");
    });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const item = new Item({
    listname: itemName,
  });
  item
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log("Error:", err);
      res.status(500).send("Internal Server Error");
    });
});
// Define workItems here
app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  Item.findOneAndDelete({ _id: checkedItemId })
    .then(() => {
      console.log("successfully deleted the marked item");
      res.redirect("/");
    })
    .catch((err) => {
      console.log("Error:", err);
      res.status(500).send("Internal Server Error");
    });
});
const workItems = [];
app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});