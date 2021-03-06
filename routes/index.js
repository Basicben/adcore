﻿var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    var test = [1, 2, 3, 4, 5, 6];
    res.render('index', { title: 'Express' });
});


/* GET Userlist page. */
router.get('/userlist', function (req, res) {  
     //res.render('index', { title: 'Express' });
    res.render('userlist', {
        //"userlist" : docs
        title: 'User List'
    });
});


/* GET New User page. */
router.get('/newuser', function (req, res) {
    res.render('newuser', { title: 'Add New User' });
});


/* POST to Add User Service */
router.post('/adduser', function (req, res) {
    
    // Set our internal DB variable
    var db = req.db;
    
    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userEmail = req.body.useremail;
    
    // Set our collection
    var collection = db.get('usercollection');
    
    // Submit to the DB
    collection.insert({
        "username" : userName,
        "email" : userEmail
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("userlist");
        }
    });
});

router.get('*', function (req, res) {
    res.render('index', { title: 'Express' });
});

module.exports = router;