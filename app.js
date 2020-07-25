require('dotenv').config();

const express = require('express'),
	nodemailer = require('nodemailer'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	flash = require('connect-flash'),
	bodyParser = require('body-parser'),
	app = express();

app.use(
	bodyParser.urlencoded({
		extended: true
	})
);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/dist'));
app.use(cookieParser());
app.use(
	session({
		secret: 'secret',
		cookie: { maxAge: 60000 },
		resave: false,
		saveUninitialized: false
	})
);
app.use(flash());

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/about', function(req, res) {
	res.render('about');
});

app.get('/projects', function(req, res) {
	res.render('projects');
});

app.get('/contact', function(req, res) {
	res.render('contact', { msg: req.flash('msg') });
});

//contact POST route
app.post('/contact', function(req, res, next) {
	const output = `
	<p> You have a new Contact request</p>
	<h3>Contact Details</h3>
		<ul>
			<li>Name: ${req.body.name}</li>
			<li>Email: ${req.body.email}</li>
			<li>Subject: ${req.body.subject}</li>
			<li>Phone: ${req.body.phone}</li>
		</ul>
	<h3>Message</h3>
	<p>${req.body.message}</p>
`;

	// create reusable transporter object using the default SMTP transport
	let transporter = nodemailer.createTransport({
		host: 'smtp.mailgun.org',
		port: 587,
		secure: false, // true for 465, false for other ports
		auth: {
			user: process.env.MAILGUN_USER, // generated ethereal user
			pass: process.env.MAILGUN_PW // generated ethereal password
		},
		tls: {
			rejectUnauthorized: false
		}
	});

	// setup email data with unicode symbols
	let mailOptions = {
		from: '"Portfolio Contact Form" postmaster@sandbox3531cb9415854cb7b8901cef83521739.mailgun.org', // sender address
		to: 'apbeban@gmail.com', // list of receivers
		subject: 'Portfolio Contact Request', // Subject line
		text: 'Hello world?', // plain text body
		html: output // html body
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return console.log(error);
		}
		console.log('Message sent: %s', info.messageId);
		console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

		req.flash('msg', 'Email has been sent.');
		res.redirect('contact');
	});
});

app.listen(process.env.PORT || 3000, process.env.IP, function() {
	console.log('Server started...');
});
