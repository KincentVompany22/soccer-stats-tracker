const express = require('express')
const router = express.Router()

const User = require('../models/user.js')

/* ------ ROUTER LOGIC ------ */
// "/users/:userId" is the prefix for all routes
    // established in server.js

// GET ROUTES

//// All Games Page
router.get("/games", async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id)
        const gameStats = currentUser.gameStats
        const mostRecentGame = gameStats.length > 0 ? gameStats[gameStats.length - 1] : null

        const totalGames = gameStats.length
        let totalGoals = 0
        let totalAssists = 0
        let totalGoalDiff = 0
        let totalWins = 0
        let totalLosses = 0
        let totalDraws = 0

        // Looping through the current player's games
            // Calculating totals
            gameStats.forEach ((game) => {
                    totalGoals += game.goals
                    totalAssists += game.assists
                    totalGoalDiff += game.goalDiff
                    if (game.result === "Win") {
                        totalWins += 1
                    }
                    if (game.result === "Loss") {
                        totalLosses += 1
                    }
                    if (game.result === "Draw") {
                        totalDraws += 1
                    }
                })

        // Calculating averages
        const avgGoals = (Math.round((totalGoals / totalGames)*10))/10 // (Math.round(num*10))/10 - way to round to nearest decimal place
        const avgAssists = (Math.round((totalAssists / totalGames)*10))/10
        const winPercentage = ((Math.round((totalWins / totalGames)*10))/10)*100
        const avgGoalDiff = (Math.round((totalGoalDiff/ totalGames)*10))/10

        // Grouping calculations for reference
        currentUser.totals = { totalGames, totalGoals, totalAssists, totalGoalDiff, totalWins, totalLosses, totalDraws}
        currentUser.averages = { avgGoals, avgAssists, winPercentage, avgGoalDiff }
        
        res.render("games/index.ejs", { currentUser, gameStats, mostRecentGame } )

    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
})

//// New Game Form
router.get("/games/new", (req, res) => {
    res.render("games/new.ejs")
})


//// Single Game Page
router.get("/games/:gameId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id)
        const currentGameStats = currentUser.gameStats.id(req.params.gameId)
        res.render("games/show.ejs", { currentUser, currentGameStats, })
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
})

//// Edit Game Form
router.get("/games/:gameId/edit", async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id)
        const currentGame = currentUser.gameStats.id(req.params.gameId)
        res.render("games/edit.ejs", { gameStats: currentGame,})
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
} )

//// Edit Profile Page Form
router.get("/edit", async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id)
        res.render("auth/edit-profile-page.ejs", { currentUser })
        // console.log(currentUser)
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
})


// POST ROUTES

//// Add Game Form Submission
router.post("/games", async (req, res) => {
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

// PUT ROUTES

//// Edit Game Form Submission
router.put("/games/:gameId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id)
        const currentGame = currentUser.gameStats.id(req.params.gameId)
        // console.log(req.params.gameId)
        currentGame.set(req.body)
        await currentUser.save()
        res.redirect(`/users/${currentUser._id}/games/${currentGame._id}`)
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
})

//// Edit Profile Page Form Submission
router.put("/edit", async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id)
        currentUser.set(req.body)
        // console.log(req.body)
        await currentUser.save()
        res.redirect(`/users/${currentUser._id}/games`)
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
})



// DELETE ROUTES

//// Delete game
router.delete("/games/:gameId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id)
        const currentGame = currentUser.gameStats.id(req.params.gameId)
        currentGame.deleteOne()
        await currentUser.save()
        res.redirect(`/users/${currentUser._id}/games`)
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
})

//// Delete account
router.delete("/", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.session.user._id)
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
})

module.exports = router