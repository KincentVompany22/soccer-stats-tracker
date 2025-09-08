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
        res.render("players/index.ejs", { allPlayers })
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
})

router.get("/:playerId", async (req, res) => {
    try {
        const currentPlayer = await User.findById(req.params.playerId)
        const gameStats = currentPlayer.gameStats

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

        res.render("players/show.ejs", 
            { currentPlayer, gameStats, totals, averages })

        
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
})





module.exports = router