const mongoose = require('mongoose')

const gameStatsSchema = new mongoose.Schema ({
  number: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    // Solves date issue with form date being day later than displayed date
    // Still need to convert date in view to string toDateString() to format properly
    set: date => {
      if (typeof date === 'string') {
        const [y,m,d] = date.split("-").map(Number)
        return new Date(y, m - 1, d)
      }
      return date
    }
  }, 
  location: {
    type: String,
    enum: ["Brickell S&P", "Stadio", "Downtown Soccer"],
  },
  result: {
    type: String,
    enum: ["Win", "Loss", "Draw"],
    required: true,
  },
  goalDiff: {
    type: Number,
  },
  goals: {
    type: Number,
  },
  assists: {
    type: Number,
  },
})

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastInitial: {
    type: String,
    require: true,
  },
  gameStats: [gameStatsSchema]
})

const User = mongoose.model("User", userSchema)

module.exports = User
