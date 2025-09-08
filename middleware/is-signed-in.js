// The function in this file should:
    // include logic that checks if req.session.user exists.
        // If it does, allows the request to continue on the normal chain by invoking next()
        // If a user session does not exist, the user should be redirected to the sign in page.


const isSignedIn = (req, res, next) => {
    if (req.session.user) return next()
    res.redirect("/auth/sign-in")
}


module.exports = isSignedIn