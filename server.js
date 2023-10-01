const express = require('express');
const path = require('path');
const fs = require('fs');

//used phind to find a way to generate unique IDS
const { v4: uuidv4 } = require('uuid');

//port that works locally and on heroku
const PORT = process.env.PORT || 3001;

const app = express();

//tells express to use these different middlewares
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.listen(PORT, () => console.log(`App listening on port http://localhost:${PORT}`));

//post route for new notes
app.post('/api/notes', async (req, res) => {
  console.log(req.body)

  let title = req.body.title
  let text = req.body.text

  
    if (title && text) {
      const newNote = {
        id: uuidv4(),
        title,
        text,
      };
  
      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          res.status(500).json(err);
        } else {
          const parsedNotes = JSON.parse(data);
  
          parsedNotes.push(newNote);
  
          fs.writeFile('./db/db.json', JSON.stringify(parsedNotes), err => {
          if (err) {
            res.status(500).json('Error writing file');
        } else {
          res.json(JSON.parse("success posting data" + data));
        }
          }
          );
        }
      });
    } else {
      res.status(500).json('Error posting note');
    }
  });


//   get route for getting all notes
  app.get('/api/notes', async (req, res) => {
  
    fs.readFile ('./db/db.json', 'utf8', (err, data) => {
       if (err) {
        res.status(500).json('Error posting note');
      } else {
        res.json(JSON.parse(data));
      }
    });
});

//delete route

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
  
    // gets all contents of file to be updated
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        res.status(500).json(err);
        return;
      }
  
      const parsedNotes = JSON.parse(data);
  // had phinds help with the most efficient way to filter the notes

      const updatedNotes = parsedNotes.filter(note => note.id !== id);
  // writes file with all but the selected note
      fs.writeFile('./db/db.json', JSON.stringify(updatedNotes), err => {
        if (err) {
          res.status(500).json(err);
        } else {
          res.status(200).json('Note deleted successfully');
        }
      });
    });
  });
  
