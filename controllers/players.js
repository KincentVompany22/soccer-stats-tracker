const express = require('express')
const router = express.Router()

const User = require('../models/user.js')


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
            let totalGoalDiff = 0
            let totalWins = 0
            let totalLosses = 0
            let totalDraws = 0

        // Looping through each player's games
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
            player.totals = { totalGames, totalGoals, totalAssists, totalGoalDiff, totalWins, totalLosses, totalDraws}
            player.averages = { avgGoals, avgAssists, winPercentage, avgGoalDiff }
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
        currentPlayer.totals = { totalGames, totalGoals, totalAssists, totalGoalDiff, totalWins, totalLosses, totalDraws}
        currentPlayer.averages = { avgGoals, avgAssists, winPercentage, avgGoalDiff }

        res.render("players/show.ejs", { currentPlayer, gameStats, mostRecentGame })

    
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
})

router.get("/:playerId/games/:gameId", async (req, res) => {
    try {
        const currentPlayer = await User.findById(req.params.playerId)
        const currentGameStats = currentPlayer.gameStats.id(req.params.gameId)
        res.render("players/show-game.ejs", { currentPlayer, currentGameStats })
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
})



module.exports = router