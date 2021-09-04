// These variables will set npm and node requirements, enable app as express, and sets listening port
const express = require('express');
const path = require('path');
const fs = require('fs');

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
    res.sendFile(path.join(__dirname, '/index.html'))
})

// route to notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
})

// sets up our GET functionality for request to /api/notes
app.get('/api/notes', (req, res) => {
    res.json(db)
})

// sets up our POST functionality to /api/notes
app.post('/api/notes', (req, res) => {
    const newNote = req.body

    newNote.id = newNote.title.replace(/\s+/g, "").toLowerCase()

    console.log(newNote)

    db.push(newNote)

    res.json(newNote)
})

// sets up fallback if requests are made to a nonexistent route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

// enables server to listen at our specified port
app.listen(PORT, (err) => {
    if (err) console.error(err);
    console.log(`App listening at http://localhost:${PORT} 🚀`)
})