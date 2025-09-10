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

router.get("/new", (req, res) => {
    res.render("games/new.ejs")
})

router.get("/:gameId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id)
        const currentGameStats = currentUser.gameStats.id(req.params.gameId)
        res.render("games/show.ejs", { currentUser, currentGameStats, })
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
})

router.get("/:gameId/edit", async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id)
        const currentGame = currentUser.gameStats.id(req.params.gameId)
        res.render("games/edit.ejs", { gameStats: currentGame,})
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
} )

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

// PUT ROUTES

router.put("/:gameId", async (req, res) => {
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

// DELETE ROUTES

router.delete("/:gameId", async (req, res) => {
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



module.exports = router