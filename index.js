const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const GithubSearcher = require('github-search-api');

const server = express();
server.use(session({secret:'COOKIESEC', resave: true, saveUninitialized: true }));

server.use(bodyParser.json());
server.use(bodyParser.urlencoded( { extended: true } ));


server.set('view engine', 'ejs'); // Need this to enable EJB

server.get('/', (req, res) => {
  if ( req.session.username  )  {
	console.log('We have username (', req.session.username, '), assume password too in session object. Render search page.');
    res.render('search', { username: req.session.username, result: [] } ); 

  } else {  
	console.log('We DO NOT have a username. Render login page.');
	res.render('login', { username: req.session.username } ); // will open the views/index.ejs
  }
  
});


server.get('/about', (req, res) => {
  console.log('/about', req.session);
  res.render('about');// will open the views/about.ejs
});

server.get('/logout', (req, res) => {
  req.session.username=null;
  req.session.password=null;
  req.session.destory;
  console.log('/logout', req.session);
  res.render('login');// will open the views/about.ejs
});

server.post('/logout', (req, res) => {
  req.session.destory;
  console.log('/logout', req.session);
  res.render('login');// will open the views/about.ejs
});


server.get('/login', (req, res) => {
  	res.render('login', { error: "Login details not correct, check and re-submit" } ); // will open the views/login.ejs
});


server.post('/login', (req, res) => {
  console.log('/login body', req.body);

  let userName = req.body.username;
  let password = req.body.password;

  if (userName && password) {
	console.log("got username and password", userName);
	req.session.username = userName;
	req.session.password = password;
	
 	res.render('search', { username: req.session.username, errorObj: '' } ); // will open the views/index.ejs
 } else {
	console.log('DONT have both username and password', userName);
  	res.render('login', { error: "Login details not correct, check and re-submit" } ); // will open the views/login.ejs
  }

});


server.get('/search', (req, res) => {
  if (req.session.username && req.session.password) {
	console.log("got username and password", req.session.username)
	
 	res.render('search', { username: req.session.username, errorObj: '' } ); // will open the views/index.ejs
 } else {
	console.log("DONT have both  username and password", req.session.username)
  	res.render('login', { error: "Login details not correct, check and re-submit" } ); // will open the views/login.ejs
  }
});



server.post('/searchUsers', (req, res) => {
  console.log('searching...');  
  try {
	  const github = new GithubSearcher({username: req.session.username, password: req.session.password });

	// const params = { 'term': 'tom', 'repos': '>42', 'followers': '>1000' };
	  const params = {};
	  
	  if (req.body.term) { params.term = req.body.term ; }
	  if (req.body.repos) { params.repos = req.body.repos ; }
	  if (req.body.followers) { params.followers = req.body.followers ; }
	  console.log('searchUsers params', params);

	  const results = github.searchUsers(params, function(data) {
		//console.log(data);
		//console.log(data.login);
		//console.log(data['items']);
		console.log('Data.length', data['items'].length);
		res.render('results', { username: req.session.username, result: data['items'] } );
	  });
	  
  } catch (err) {
	console.log('Caught Error', err.message);
	console.log('Routing to Search page ', err.message);
	res.render('search', { username: req.session.username, errorObj: err.message } );
  }
  
});


server.listen(4242, () => {
  console.log('Express Server is running...');
});
