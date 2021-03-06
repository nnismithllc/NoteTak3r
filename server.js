// Variables for Express Usage
const express = require("express");
const path = require("path");
const fs = require("fs");
const shortid = require("shortid"); ///library for unique id
var app = express();
var PORT = process.env.PORT || 3000;

// Use of Middleware to Connect the Server client Information
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Get Information to Join Paths on Directories
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

app.get("/api/notes", function (req, res) {
  fs.readFile("public/db/db.json", function (error, data) {
    if (error) {
      throw error;
    }
    let allNotes = JSON.parse(data);
    return res.json(allNotes);
  });
});

// Post Note Capture and ReadFile W/New Note Function
app.post("/api/notes", (req, res) => {
  fs.readFile("public/db/db.json", function (error, data) {
    if (error) {
      throw error;
    }

// Variable for New Notes Parsed with Layout
    let allNotes = JSON.parse(data);

    let newNote = {
      title: req.body.title,
      text: req.body.text,
      id: shortid.generate(),
    };
// Push New Notes to Write New File
    allNotes.push(newNote);

    fs.writeFile(
      "public/db/db.json",
      JSON.stringify(allNotes, null, 2),
      (error) => {
        if (error) {

// Error Comment if Function is Null
        throw error;
        }
        res.send("200");
      }
    );
  });
});

// Delete Posted Notes Function and Clear Console
app.delete("/api/notes/:id", (req, res) => {
  let chosen = req.params.id;

  fs.readFile("public/db/db.json", function (err, data) {
    if (err) throw err;
    let allNotes = JSON.parse(data);

    // Note Search by ID with Loop Information
    function searchChosen(chosen, allNotes) {
      for (var i = 0; i < allNotes.length; i++) {
        if (allNotes[i].id === chosen) {
          allNotes.splice(i, 1);
        }
      }
    }

    searchChosen(chosen, allNotes);

    // Select and Write Update with 200 Approval
    fs.writeFile(
      "public/db/db.json",
      JSON.stringify(allNotes, null, 2),
      (err) => {
        if (err) throw err;
        res.send("200");
      }
    );
  });
});

// Port Init Function
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
