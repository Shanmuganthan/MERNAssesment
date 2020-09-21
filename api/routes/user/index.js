var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../../model/user');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var ObjectId = require('mongodb').ObjectID;
var app = express();
var config = require('../../config');


router.post('/addUser', function (req, res) {
    var user = new User(req.body);
    try {
        User.find({ email: user.email }, function (err, docs) {
            if (err) {
                res.json({ success: false, message: "Error while saving user" });
            }
            if (docs.length) {
                res.json({ success: false, message: "Email already exists" });
                return;
            } else {
                user.save(function (err, user) {
                    if (err) {
                        res.json({ success: false, message: "Error while saving" });
                        return;
                    }
                    res.json({ success: true, message: "User has been created successfully!" });
                    return;
                });
            }
        });
    } catch (e) {
        console.log(e);
    }
});

router.get('/getAllUser', function (req, res) {
    var { search, sort_field, sort_order, pageno, pagelimit } = req.query;
    var sort = {};
    page = pageno;
    pageLimit = parseInt(pagelimit);
    sort[sort_field] = sort_order == 'asc' && 1 || -1;
    var query = [];
    //If search text entered, search all fields 
    if (search && search != '') {
        var searchRegex = new RegExp('^' + escape(search).replace(/%20/g, " "), 'i');
        //search all fields for search Text
        query['$or'] = [
            {
                firstName: { $regex: searchRegex }
            }, {
                lastName: { $regex: searchRegex }
            }, {
                email: { $regex: searchRegex }
            },
            {
                mobile: { $regex: searchRegex }
            },
            {
                emirate: { $regex: searchRegex }
            }
        ];
    }

    var aggQuery = [];
    var countAggQuery;
    aggQuery.push({
        $match: {
            ...query
        }
    });

    countAggQuery = aggQuery.slice(); //copy array

    //To perform sort on specific field
    aggQuery.push({ $sort: sort });

    //skip pages
    aggQuery.push({ $skip: ((page - 1) * pageLimit) });



    //limit records
    aggQuery.push({ $limit: pageLimit });

    //project only required fields
    aggQuery.push({
        $project: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            email: 1,
            mobile: 1,
            emirate: 1,
            Flag: 1,
        }
    });


    User.aggregate(aggQuery, function (err, users) {
        console.log(err)
        if (err) {
            res.json({ success: false, message: "Error while retriving user list" }); return;
        } else {
            res.json({ success: true, data: users, message: "Record returned successfully" }); return;
        }

    });
});



router.get('/getAllUserCount', function (req, res) {
    var { search } = req.query;
    var query = [];
    //If search text entered, search all fields 
    if (search && search != '') {
        var searchRegex = new RegExp('^' + escape(search).replace(/%20/g, " "), 'i');
        //search all fields for search Text
        query['$or'] = [
            {
                firstName: { $regex: searchRegex }
            }, {
                lastName: { $regex: searchRegex }
            }, {
                email: { $regex: searchRegex }
            },
            {
                mobile: { $regex: searchRegex }
            },
            {
                emirate: { $regex: searchRegex }
            }
        ];
    }

    var aggQuery = [];
    aggQuery.push({
        $match: {
            ...query
        }
    });


    aggQuery.push({ $group: { _id: null, count: { $sum: 1 } } });
    var count = 0;
    User.aggregate(aggQuery, function (err, result) {
        if (err) { console.log(err) }
        if (result && result.length > 0) {
            count = result[0].count;
        }
        res.json({ success: true, data: count, message: "Count returned successfully" }); return;
        return;
    })

});



router.post('/updateById', function (req, res) {
    var userId = req.body._id;
    User.findOne({ _id: ObjectId(userId) }, function (err, user) {
        if (err) {
            res.json({ success: false, message: "Error while updating user" }); return;
            return;
        } else {
            if (user) {
                var userBody = req.body;
                user.save(userBody, function (err, user) {
                    res.json({ success: true,  message: "User has been updated successfully!" });
                    return;
                });
            } else {
                res.json({ success: true, message: "User not found!" });
                return;
            }
        }
    });
});

router.post('/deleteUserById', function (req, res) {
    var id = req.query.id;
    User.findOne({ _id: ObjectId(id) }, function (err, user) {
        if (err) {
            res.json({ success: false, message: "Error while updating user" }); return;
            return;
        } else {
            if (user) {
                var userBody = {Flag : 'R'};
                user.save(userBody, function (err, user) {
                    res.json({ success: true,  message: "User has been deleted successfully!" });
                    return;
                });
            } else {
                res.json({ success: true, message: "User not found!" });
                return;
            }
        }
    });
});

router.get('/findByUserId', function (req, res) {
    var id = req.query.id;
    User.findOne({ _id: ObjectId(id) }, function (err, data) {
        if (err) {
            res.json({ success: false, message: "Error while find user" }); return;
            return;
        } else {
            console.log("Success");
            res.json({ success: true, data: data , message : 'User data returned sucessfully!' });
            return;
        }
    });
});

router.post('/authenticate', function (req, res) {
    User.findOne({ email: req.body.username }, function (err, user) {
        if (err) {
            res.json({ success: false, message: "Error!" }); return;
            return;
        }
        if (!user) {
            res.json({ success: false, message: "Authentication Failed User Not Found" });
            return;
        } else {
            if (user.password != req.body.password) {
                res.json({ success: false, message: "Username or Password is Incorrect" });
                return;
            } else {
                var token = jwt.sign({ name: user.firstName, email: user.email }, config.tokenSecret, {
                    expiresIn: config.tokenExpires
                });
                res.json({
                    success: true,
                    message: 'Enjoy Your Token',
                    token: token
                });
                return;
            }
        }
    });
});

module.exports = router;