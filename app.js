const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

app.use(bodyParser.json());

const db = require("./db");
const collection = "todo";

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/getTodos", (req, res) => {
  db.getDB()
    .collection(collection)
    .find({})
    .toArray((err, documents) => {
      if (err) {
        console.log(err);
      } else {
        console.log(documents);
        res.json(documents);
      }
    });
});

//UPDATE A TODO ITEM
app.put("/:id", (req, res) => {
  const todoID = req.params.id;
  const userInput = req.body;

  console.log("the user input is ", userInput);
  db.getDB()
    .collection(collection)
    .findOneAndUpdate(
      { _id: db.getPrimaryKey(todoID) },
      { $set: { todo: userInput.todo } },
      { returnOriginal: false },
      (err, results) => {
        if (err) {
          console.log(err);
        } else {
          res.json(results);
        }
      }
    );
});

const PORT = process.env.PORT || 5000;

db.connect(err => {
  if (err) {
    console.log("Can Not connect to Database");
    process.exit(1);
  } else {
    app.listen(PORT, () => {
      console.log("Port is running on port ", PORT);
    });
  }
});
