// This function in this file should:
    // include logic that assigns req.session.user to res.locals.user (available in our views).
        // If no user is found, we set it to null. Then allow the request to continue on the normal chain by invoking next().


const passUserToView = (req, res, next) => {
    res.locals.user = req.session.user ? req.session.user : null
    next()
}

module.exports = passUserToView