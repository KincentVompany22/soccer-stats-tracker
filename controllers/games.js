const express = require('express')
const router = express.Router()

const User = require('../models/user.js')

/* ------ ROUTER LOGIC ------ */
// "/users/:userId/games" is the prefix for all routes
    // established in server.js

// GET ROUTES

router.get("/", (req, res) => {
    res.render("games/index.ejs")
})

router.get("/new", (req, res) => {
    res.render("games/new.ejs")
})



module.exports = router