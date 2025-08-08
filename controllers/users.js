const User=require("../models/user");
//signup
module.exports.renderSingupForm = (req, res) => {
    res.render("users/signup.ejs");
}


module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {  //login after signup
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        })
        // req.flash("success","Welcome to Wanderlust!");
        // res.redirect("/listings");
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup")
    }

}

//login
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs")
}

module.exports.login = async (req, res) => {
    //res.send("Welcome to Wanderlust! You are logged in!");
    req.flash("success", "Welcome back to Wanderlust");
    //  res.redirect("/listings");
    // res.redirect( req.session.redirectUrl) //prblm
    // res.redirect(res.locals.redirectUrl);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

//logout
module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    })
}    