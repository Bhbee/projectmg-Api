const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

router.get('^/$ |/home(.html)?', authController.login, (req, res) => {
    res.sendFile("home.html", { root: './public/' })
});
router.get('/register(.html)?', (req, res) => {
    res.sendFile("register.html", { root: './public/' })
});
router.get('/login(.html)?', (req, res) => {
    res.sendFile("login.html", { root: './public/' })
});
router.get('/profile.html', authController.login, async (req, res) => {
    if (req.user) {
        res.sendFile("projects.html", { root: './public/' })
    } else {
        res.sendFile("login.html", { root: './public/' });
    }
})

module.exports = router;