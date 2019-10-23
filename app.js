require('dotenv').config();
var cloudant = require('cloudant');
var express = require('express');
var bodyParser = require('body-parser');
var stringSimilarity = require('string-similarity');
let secureEnv = require('secure-env');
global.env = secureEnv({secret:'mySecretPassword'});

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
app.get('/',function(req,res){
  res.sendFile("views/index.html", {"root": __dirname});
});
var cloudant = cloudant({account:global.env.cloudantusername, password:global.env.cloudantpassword});

var responsequiz1;
var responsequiz2;

var time;
var url;
var counter=0;

quizdb = cloudant.db.use(global.env.dbname);


app.post('/quizsubmission', function(req,res){

    var doc={
        _id:req.headers.host + req.url,
        time: new Date().toISOString(),
        email: req.body.cloudemail,
        interested: req.body.interested
        };

quizdb.insert(doc,function(err,body,header){
    if(err){
        res.sendFile(__dirname + "/views/error.html");
        console.log('Error:'+err.message);
        return;
    }
    else{
        res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<center><h2>Thank you for taking the quiz!</h2><center>');
    //res.write('<center><h3>You have scored '+quizscore+'!</h3><center>');
    res.end();
    }
});

    //return res.sendFile(__dirname+"/views/success.html");
});

const port = 3001;
app.listen(port, function () {
    console.log("Server running on port: %d", port);
});
module.exports = app;
