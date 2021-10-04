const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

const Entry = require('./models/entry'); // Obtain the Entry class
const { addComment } = require('./models/entry');

// Get all entries
app.get('/entries', (req, res) => {
    const entriesArr = Entry.all;
    res.json(entriesArr);
});

// Get all entries by a particular user
app.get('/entries/:username', (req, res) => {
    const entriesArr = Entry.all;
    const requestedUsername = req.params.username;

    for (let e of entriesArr) {
        if (e.username === requestedUsername) {
            let index = entriesArr.indexOf(e);
            let entriesByUsername = Entry.getEntryByUsername(entriesArr[index].username);
            return res.send(entriesByUsername);
        } 
    }

    res.status(404).json({ message: `Entry by username ${requestedUsername} not found` });
});

// Get all comments on a particular entry
app.get('/entries/comments/:id', (req, res) => {
    const entriesArr = Entry.all;
    const requestedId = parseInt(req.params.id);

    for (let e of entriesArr) {
        if (e.id === requestedId) {
            let entry = Entry.getEntry(requestedId)
            return res.send(entry.comments)
        }
    }

    res.status(404).json({ message: `Entry of id ${requestedId} not found` });
});

// Post new entry
app.post('/entries', (req, res) => {
    const newData = req.body;

    // All fields are required
    if (!newData.title || !newData.username || !newData.message || !newData.gif) {
        return res.status(400).json({ message: 'Please fill in the required title, username, message and gif fields' });
    } else {
        const newEntry = Entry.addEntry(newData);
        res.status(201).send(newEntry);
    }
});

// Post new comment on a particular entry
app.post('/entries/comments/:id', (req, res) => {
    const entriesArr = Entry.all;
    const requestedId = parseInt(req.params.id);
    const newComment = req.body.comments;
    console.log(req.body)

    for (let e of entriesArr) {
        if (e.id === requestedId) {
            let addedComment = Entry.addComment(requestedId, newComment);
            res.status(201).send(addedComment);
        } else {
            return res.status(404).json({ message: `Entry of id ${requestedId} not found` });
        }
    }
});

// Change reaction on an entry
app.put('/entries/reactions/:id', (req, res) => {
    const entriesArr = Entry.all;
    const requestedId = parseInt(req.params.id);
    const reaction = req.body.target;
    
    if (requestedId || entriesArr.id.includes(requestedId)) {
        Entry.changeReaction(requestedId, reaction);
        res.status(201).json({ message: 'Reaction successfully updated'});
    } else {
        return res.status(404).json({ message: `Entry of id ${id} not found` });
    }
});

// Delete entry
app.delete('/entries/delete/:id', (req, res) => {
    const entriesArr = Entry.all;
    let requestedId = parseInt(req.params.id);
    console.log(requestedId)

    for (let e of entriesArr) {
        if (e.id === requestedId) {
            Entry.deleteEntry(requestedId);
            return res.status(204).json({ message: `Entry of id ${requestedId} successfully deleted` });
        }
    }

    return res.status(404).json({ message: `Entry of id ${requestedId} not found` });
});

module.exports = app;