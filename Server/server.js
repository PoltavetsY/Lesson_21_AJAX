var express = require('express');
var fs = require('fs');
var app = express(); 
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type: 'application/json'}));

app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

const port = 3000;
 
app.listen(port, function () { 
    console.log(`Example app listening on port http://localhost:${port}/`);
});

function jsonReader (file, callback) {

	fs.readFile(file, (err, data) => {

		if(err) {
			return callback(err);
		} else {
			const object = JSON.parse(data);
		return callback(null, object);
		}

	})
};

app.post('/', function(req, res) {
    const {login, password} = JSON.parse(req.body);
    

    jsonReader('users.json', (err, users) => {
 
        let user = users.find( function (item) {
            if(item.login === login && item.password === password) {
                return item;
            }
        });
        
        if (user !== undefined) {

            res
                .status(200)
                .send( {id: user.id} );
        } else {
            res
                .status(401)
                .send('Not found'); 
        }
  
    });
        
});

app.post('/getGoodsById', function(req, res) {
    
    const {id} = JSON.parse(req.body);
    
    let urlToJson = 'goods/' + id + '.json';

    console.log(urlToJson, 'urlToJson');

    jsonReader(urlToJson, (err, goods) => {
        
        console.log(goods, 'good');

        res
            .status(200)
            .send(JSON.stringify(goods));
    });
    
});