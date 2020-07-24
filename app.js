const express = require('express'),
	app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/dist'));

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/about', function(req, res) {
	res.render('about');
	s;
});

app.get('/work', function(req, res) {
	res.render('work');
});

app.get('/contact', function(req, res) {
	res.render('contact');
});

app.listen(process.env.PORT || 3000, process.env.IP, function() {
	console.log('Server started...');
});
