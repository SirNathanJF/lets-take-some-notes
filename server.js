// These variables will set npm and node requirements, enable app as express, and sets listening port
const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');

const app = express()
const PORT = process.env.PORT || 3001

// requires db.json file for use in POST method 
const db = require('./db/db.json');

// sets up our server for urlencoding, json data, and static address to public folder
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))

// route to index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
})

// route to notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
})

// sets up our GET functionality for request to /api/notes
app.get('/api/notes', (req, res) => {
    res.json(db)
})

// sets a function for appending db later
const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(content);
        writeToFile(file, parsedData);
      }
    });
  };

// sets a function for write a file in the previous function
  const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

// sets up our POST functionality to /api/notes
app.post('/api/notes', (req, res) => {
    const newNote = req.body

    newNote.id = uuid();
    if(newNote){
    readAndAppend(newNote, './db/db.json');
      res.json(`Note added successfully 🚀`);
      db.push(newNote)
    } else {
      res.error('Error in adding note');
    }
})


// sets up fallback if requests are made to a nonexistent route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
})

// This adds delete method to delete a note
app.delete('/api/notes/:id', (req, res) => {
    const noteToBeDeleted = req.params.id

    for (let i = 0; i < db.length; i++) {

        if (noteToBeDeleted === db[i].id) {
            db.splice(i, 1)

            return res.send('Note removed.')
        }
    }

    return res.json(false)
})

// enables server to listen at our specified port
app.listen(PORT, (err) => {
    if (err) console.error(err);
    console.log(`App listening at http://localhost:${PORT} 🚀`)
})