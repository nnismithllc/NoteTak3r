const express = require("express")
const path = require ("path")
const fs = require ("fs")
const shortid = require ("shortid");///library for unique id
var app = express();
var PORT = process.env.PORT|| 3000;




// Sets up the Express App// =============================================================var app = express();var port = process.env.PORT || 3000;
// Sets up the Express app to handle data 
// parsingapp.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public',)));


app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname,'public', "index.html"));
});
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, 'public',"notes.html"));
});

app.get("/api/notes", function (req, res) {
  fs.readFile("public/db/db.json", function(error,data){
    if(error){
      throw error
    };
    let allNotes=JSON.parse(data)
    return res.json(allNotes);
  });
});

// app.get("/api/*", function (req, res) {
//   /*for (var i = 5; i < customers.length; i++) {res.json(customers[i]); }*/ return res.json(exit);
// });

app.post('/api/notes', (req, res) => {

  fs.readFile("public/db/db.json", function(error, data) {
    if (error) {
      throw error;
    };
    let allNotes = JSON.parse(data);

    let newNote = {
      title: req.body.title,
      text: req.body.text,
      id: shortid.generate()
    }

    allNotes.push(newNote);

    fs.writeFile("public/db/db.json", JSON.stringify(allNotes, null, 2), (error) => {
      if (error) {
        throw error;
      };
      res.send('200');
    });

  });

});

app.delete('/api/notes/:id', (req, res) => {
  let chosen = req.params.id;

  fs.readFile("public/db/db.json", function (err,data) {
    if (err) throw err;
    let allNotes = JSON.parse(data);

    function searchChosen(chosen, allNotes) {
      for (var i=0; i < allNotes.length; i++) {
          if (allNotes[i].id === chosen) {
              allNotes.splice(i, 1);
          }
      }
    }

    searchChosen(chosen,allNotes);

    fs.writeFile("public/db/db.json", JSON.stringify(allNotes, null, 2), (err) => {
      if (err) throw err;
      res.send('200');
    });

  });

});

app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
