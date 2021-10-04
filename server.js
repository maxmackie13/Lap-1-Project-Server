const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

const Entry = require('./models/entry'); // Obtain the Entry class

// Get all entries
app.get('/entries', (req, res) => {
    const entriesArr = Entry.all;
    res.json(entriesArr);
});

// Get all entries by a particular user
app.get('/entries/:username', (req, res) => {
    const entriesArr = Entry.all;
    const requestedUsername = req.params.username;
    
    // Check an username is requested or if it is requested, if it is in the existing entries
    if (username || entriesArr.username.includes(username)) {
        let entriesByUsername = Entry.getEntryByUsername(requestedUsername);
        res.json(entriesByUsername);
    } else {
        return res.status(404).json({ message: `Entry of id ${id} not found` });
    }
});

// Get a gif based on a search term
app.get('/gifs/:search', (req, res) => {
    let searchWord = req.params.search;
    let possibleGifs = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${searchWord}`

    // Search term is required
    if (!searchWord) {
        return res.status(400).json({ message: 'Please enter a search word' });
    } else {
        fetch(possibleGifs)
            .then(function (gifs) {
                res.send(gifs.data.data);
            })
            .catch(function (error) {
                return res.json({ message: `${error.message}` })
            });
    }
});

// Post new entry
app.post('/entries', (req, res) => {
    const newData = req.body;

    // All fields are required
    if (!newData.title || !newData.username || !newData.message || !newData.gif) {
        return res.status(400).json({ message: 'Please fill in the required title, username, message and gif fields' });
    } else {
        Entry.addEntry(newData);
        const newId = newData.id;
        const newEntry = Entry.getEntry(newId);
        res.status(201).send(newEntry);
    }
});

// Post new comment on a particular entry
app.post('/entries/comments/:id', (req, res) => {
    const entriesArr = Entry.all;
    const requestedId = parseInt(req.params.id);
    const newComment = req.body.comment;

    // Check an id is requested or if it is requested, if it is in the existing entries
    if (id || entriesArr.id.includes(id)) {
        Entry.addComment(requestedId, newComment);
        const entry = Entry.getEntry(requestedId);
        res.status(201).send(entry);
    } else {
        return res.status(404).json({ message: `Entry of id ${id} not found` });
    }
});

// Change reaction on an entry
app.put('/entries/reactions/:id', (req, res) => {
    const entriesArr = Entry.all;
    const requestedId = parseInt(req.params.id);
    const reaction = req.body.target;
    
    if (id || entriesArr.id.includes(id)) {
        Entry.changeReaction(requestedId, reaction);
        res.status(201).json({ message: 'Reaction successfully updated'});
    } else {
        return res.status(404).json({ message: `Entry of id ${id} not found` });
    }
});

// Delete entry
app.delete('/entries/delete/:id', (req, res) => {
    const entriesArr = Entry.all;
    let requestedEntry = parseInt(req.params.id);
    
    if (id || entriesArr.id.includes(id)) {
        Entry.deleteEntry(requestedEntry);
        res.json({ message: `Entry of id ${id} successfully deleted`});
    } else {
        return res.status(404).json({ message: `Entry of id ${id} not found` });
    }
});

module.exports = app;