const app = require('express')();
const routes = require('./routes');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser')
var config = require('./config'); //
var mongoose = require('mongoose');

app.set('superSecret', config.tokenSecret);
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())



mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect('mongodb://localhost:27017/mydb', (err, client) => {
  if (err)
    throw new Error('database failed to connect');

});



routerMiddle.use(function(req,res,next){
    var token = req.headers["authorization"];
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.token, function(err, decoded) {
            if (err) {
                res.statusCode = 403;
                console.log(err);
                res.json({status:"Error",message: err.message});
                return;
            }
            // save to request for use in other routes
            next();
        });
    }else{
        res.statusCode = 403;
        res.json({status:"Error",message: "No Access token, permission denied."});
    }
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Authorization");
  res.header("Cache-Control", "private,max-age=0,no-cache");

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  }
  else {
    next();
  }
});
app.use('/', routes);

var port = process.env.PORT || 8081;
app.listen(port);

console.log("Server running at http://localhost:%d", port);