const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { request } = require('http');

const PORT = process.env.PORT || 3001;

const app = express();

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
  
          fs.writeFile('./db/db.json', JSON.stringify(parsedNotes), (writeErr) =>
          writeErr
              ? res.status(500).json(err)
              : res.status(200).json('success')
          );
        }
      });
    } else {
      res.status(500).json('Error posting note');
    }
  });
  
