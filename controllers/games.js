const express = require('express')
const router = express.Router()

const User = require('../models/user.js')

/* ------ ROUTER LOGIC ------ */
// "/users/:userId/games" is the prefix for all routes
    // established in server.js

// GET ROUTES

router.get("/", async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id)
        res.render("games/index.ejs", { gameStats: currentUser.gameStats, })
        // console.log(currentUser.gameStats)
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
})

router.get("/new", (req, res) => {
    res.render("games/new.ejs")
})

router.get("/:gameId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id)
        const currentGame = currentUser.gameStats.id(req.params.gameId)
        res.render("games/show.ejs", { gameStats: currentGame })
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
})



// POST ROUTES

router.post("/", async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id)
        currentUser.gameStats.push(req.body)
        // console.log(req.body)
        await currentUser.save()
        res.redirect(`/users/${currentUser._id}/games`)
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
})


module.exports = router