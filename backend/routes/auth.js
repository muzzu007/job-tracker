const express = require("express");
const router = express.Router();

const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {

            return res.status(400).json({
                message: "Name, Email and Password are required"
            });

        }
        const user = await User.findOne({
            email: req.body.email,
        })
        if (user) {
            return res.status(400).json({
                message: "Email Already exists",
            })
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });
        await newUser.save();
        res.json({
            message: "Registered succesfull",
        })

    } catch (error) {
        res.status(500).json({
            message: error.message,
        })

    }
});



router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email,
        })
        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password",
            });
        }
        const isMatch = await bcrypt.compare(
            req.body.password,
            user.password

        )
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password",
            })
        }
        const token = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );
        res.json({
            message: "Login Successful",
            token,
            user: {
                name: user.name
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router
