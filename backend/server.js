const express = require('express');
const app = express();

const db = require('mysql');
const url = 'C:\ProgramData\MySQL\MySQL Server 8.0\Data\db';
// const conn = db.createConnection('url');
const conn = db.createConnection({
	host: "localhost",
	user: "root",
	password: "wasu123",
	database: "db"
});

conn.connect(function(err) {
	if(err) throw err;
	console.log("Connected!");
});

const path = require('path');
app.use(express.static('public'));

const cors = require('cors');
app.use(cors({credentials: true, orgin: false}));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.listen(8080, function(){
	console.log('- Server listening to 8080 -');
})

var Food = {
    getInformation: function (callback) {
        conn.query("SELECT * FROM food", (error, results, fields) => {
            if(error) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    }

};

app.post('/', (req, res) => {
	console.log('INTO BACKEND');
	const name = req.body.name;
	const date = req.body.date;
	var lunch = true, dinner = false;
	if(req.body.lord == "dinner")
	{
		lunch = false;
		dinner = true;
	}
	console.log('backenddddddd', name, date, lunch, dinner);
	conn.query('INSERT INTO food (name, date, lunch, dinner) VALUES (?)', [[name, date, lunch, dinner]], function(error, result){
		if(error){
			console.log(error);
		}
	})
});

app.get('/', function (req, res) {
	Food.getInformation(function (error, results) {
        if(error) { res.send(500, "Server Error"); return; }
        // Respond with results as JSON
        res.send(results);
    });
});