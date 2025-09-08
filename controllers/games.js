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

        // CALCS
        // Totals
        const totalGames = gameStats.length

        let totalGoals = 0
            gameStats.forEach((game) => {
                totalGoals += game.goals
            })

        let totalAssists = 0
        gameStats.forEach((game) => {
            totalAssists += game.assists
        })

        let totalWins = 0
        gameStats.forEach((game) => {
            if (game.result === "Win") {
                return totalWins += 1
            }
        })

        let totalLosses = 0
        gameStats.forEach((game) => {
            if (game.result === "Loss") {
                return totalLosses += 1
            }
        })

        let totalDraws = 0
        gameStats.forEach((game) => {
            if (game.result === "Draw") {
                return totalDraws += 1
            }
        })

        // Averages
        const avgGoals = totalGoals / totalGames
        const avgAssists = totalAssists / totalGames
        const winPercentage = (totalWins / totalGames)*100

        // Grouping
        const totals = { totalGames, totalGoals, totalAssists, totalWins, totalLosses, totalDraws}
        const averages = { avgGoals, avgAssists, winPercentage}

        res.render("games/index.ejs", 
            { gameStats, totals, averages } )
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
        res.render("games/show.ejs", { currentGameStats })
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
})

router.get("/:gameId/edit", async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id)
        const currentGame = currentUser.gameStats.id(req.params.gameId)
        res.render("games/edit.ejs", { gameStats: currentGame })
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