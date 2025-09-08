const express = require('express')
const router = express.Router()

const User = require('../models/user.js')


// ROUTES
// "/players" is the prefix for all routes
    // established in server.js


router.get("/", async (req, res) => {
    try {
        const allPlayers = await User.find()
        console.log(allPlayers)
        res.render("players/index.ejs", { users: allPlayers })
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
})




module.exports = router