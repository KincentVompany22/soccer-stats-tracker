const express = require('express')
const router = express.Router()

const User = require('../models/user.js')
const { all } = require('./auth.js')


// ROUTES
// "/players" is the prefix for all routes
    // established in server.js


router.get("/", async (req, res) => {
    try {
        const allPlayers = await User.find()

        // Looping through each player
        allPlayers.forEach((player) => {
            const gameStats = player.gameStats
            const totalGames = gameStats.length

            let totalGoals = 0
            let totalAssists = 0
            let totalWins = 0
            let totalLosses = 0
            let totalDraws = 0

        // Looping through each player's games
            // Calculating totals
            gameStats.forEach ((game) => {
                totalGoals += game.goals
                totalAssists += game.assists
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
            const avgGoals = totalGoals/totalGames
            const avgAssists = totalAssists / totalGames
            const winPercentage = (totalWins / totalGames)*100
            
        // Grouping calculations for reference
            player.totals = { totalGames, totalGoals, totalAssists, totalWins, totalLosses, totalDraws}
            player.averages = { avgGoals, avgAssists, winPercentage}
        })
       
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

        const totalGames = gameStats.length
        let totalGoals = 0
        let totalAssists = 0
        let totalWins = 0
        let totalLosses = 0
        let totalDraws = 0

        // Looping through the current player's games
            // Calculating totals
            gameStats.forEach ((game) => {
                    totalGoals += game.goals
                    totalAssists += game.assists
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
        const avgGoals = totalGoals / totalGames
        const avgAssists = totalAssists / totalGames
        const winPercentage = (totalWins / totalGames)*100

        // Grouping calculations for reference
        currentPlayer.totals = { totalGames, totalGoals, totalAssists, totalWins, totalLosses, totalDraws}
        currentPlayer.averages = { avgGoals, avgAssists, winPercentage}

        res.render("players/show.ejs", { currentPlayer, gameStats })

    
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
})

router.get("/:playerId/games/:gameId", async (req, res) => {
    try {
        const currentPlayer = await User.findById(req.params.playerId)
        const currentGameStats = currentPlayer.gameStats.id(req.params.gameId)
        res.render("players/show-game.ejs", { currentGameStats })
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
})



module.exports = router