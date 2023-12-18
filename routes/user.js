const express = require('express');
const connection = require('../connection');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
// signing up will enter information into database
router.post('/signup', (req, res) => {
    // user information is taken from body
    let user = req.body;
    // query to check if user exists
    query = "select email, password , role, status from user where email =?"
    // checks email
    connection.query(query, [user.email], (err, results) => {

        try {
            if (results.length <= 0) {
                // all requirements for user database are required and inserted
                query = "insert into user (name, contact_number, email, password, status, role) values(?,?,?,?,'false','user')"
                connection.query(query, [user.name, user.contact_number, user.email, user.password], (err, results) => {
                    try {
                        return res.status(200).json({ message: "Successfully Registered" });

                    } catch {
                        return res.status(500).json(err);
                    }
                })
            }
            else {
                return res.status(400).json({ message: "Email Already Exists" })
            }
        }
        catch (err) {
            return res.status(500).json(err);
        }
    })
});
// login will check if user exists and if user is verified
router.post('/login', (req, res) => {
    // user information is taken from body
    const user = req.body;
    // query to check if user exists
    query = "select email, password , role, status from user where email =?";
    //  checks if user exists
    connection.query(query, [user.email], (err, results) => {
        try {
            // if user does not exist
            if (results.length <= 0 || results[0].password != user.password) {
                //  if user does not exist or password is incorrect
                return res.status(401).json({ message: "Incorrect username or password" });
            }
            // if user exists and password is correct
            else if (results[0].status === 'false') {
                // if user is not verified
                return res.status(401).json({ message: "User not verified" });
            }
            // if user exists and password is correct and user is verified
            else if (results[0].password === user.password) {
                const response = { email: results[0].email, role: results[0].role };
                // token is created
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '8h' });
                // token is sent
                res.status(200).json({ token: accessToken });
            }
            else {
                return res.status(400).json({ message: "Something went wrong" })
            }
        }
        // if user exists and password is correct and user is verified
        catch {
            return res.status(500).json(err);
        }
    })
});
var transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});
// forgot password will send password to user email if user exists in database 
router.post('/forgotpassword', (req, res) => {
    const user = req.body;
    query = "select email, password from user where email =?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                return res.status(200).json({ message: "Password sent to email" });
            }
            else {
                // email information is taken from body and sent to user email
                var mailOptions = {
                    from: process.env.EMAIL,
                    to: results[0].email,
                    subject: 'Password Reset',
                    text: 'Your email is' + results[0].email + 'Your password is ' + results[0].password
                };
                // send email to user with password information  
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error)
                    }
                    else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                return res.status(200).json({ message: "Password sent to email" });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})

module.exports = router;