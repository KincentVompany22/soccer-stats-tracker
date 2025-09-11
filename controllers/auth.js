const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

const User = require('../models/user.js')

/* ------ ROUTER LOGIC ------ */
// "/auth" is the prefix for all routes
    // established in server.js

// GET ROUTES

router.get('/sign-up', async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username })
  const passwordMismatch = req.body.password !== req.body.confirmPassword
  res.render('auth/sign-up.ejs' , { userInDatabase, passwordMismatch } )
})

router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in.ejs')
})


router.get('/sign-out', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

router.get("/sign-in-error", (req, res) => {
  res.render("auth/sign-in-error.ejs")
})


// POST ROUTES

router.post('/sign-up', async (req, res) => {
  try {
    // Check if the username is already taken
    const userInDatabase = await User.findOne({ username: req.body.username })
    const passwordMismatch = req.body.password !== req.body.confirmPassword

    if (userInDatabase) {
      return res.render("auth/sign-up.ejs" , { userInDatabase, passwordMismatch } )
    }
  
    // Username is not taken already!
    // Check if the password and confirm password match
    if (passwordMismatch) {
      return res.render("auth/sign-up.ejs", { userInDatabase, passwordMismatch } )
    }
  
    // Must hash the password before sending to the database
    const hashedPassword = bcrypt.hashSync(req.body.password, 10)
    req.body.password = hashedPassword
  
    // All ready to create the new user!
    await User.create(req.body)
  
    res.redirect('/auth/sign-in')

  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})


router.post('/sign-in', async (req, res) => {
  try {
    // First, get the user from the database
    const userInDatabase = await User.findOne({ username: req.body.username })
    
    if (!userInDatabase) {
      return res.redirect("/auth/sign-in-error")
    }
  
    // There is a user! Time to test their password with bcrypt
    const validPassword = bcrypt.compareSync(
      req.body.password,
      userInDatabase.password
    )
    if (!validPassword) {
      return res.redirect("/auth/sign-in-error")
    }
  
    // There is a user AND they had the correct password. Time to make a session!
    req.session.user = {
      username: userInDatabase.username,
      _id: userInDatabase._id
    }
    res.redirect('/players')
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

module.exports = router
