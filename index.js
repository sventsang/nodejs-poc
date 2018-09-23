const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const GithubSearcher = require('github-search-api');

const server = express();
server.use(session({secret:'COOKIESEC', resave: true, saveUninitialized: true }));

server.use(bodyParser.json());
server.use(bodyParser.urlencoded( { extended: true } ));


server.set('view engine', 'ejs'); // Need this to enable EJB



/*
Default process (GET), 
If the user git details are already in session state then route to search page
otherwise route to the login page
*/
server.get('/', (req, res) => {
  if ( req.session.username  )  {
	console.log('We have username (', req.session.username, '), assume password too in session object. Render search page.');
    res.render('search', { username: req.session.username, result: [], errorObj: ''  } ); 

  } else {  
	console.log('We DO NOT have a username. Render login page.');
	res.render('login', { username: req.session.username } ); // will open the views/index.ejs
  }
  
});

/*
About process (GET)
route to About page.
*/
server.get('/about', (req, res) => {
  console.log('/about', req.session);
  res.render('about');// will open the views/about.ejs
});

/*
Logout process (POST). remove the user details from session state.
Take the user back to the Login page.
*/
server.get('/logout', (req, res) => {
  req.session.username=null;
  req.session.password=null;
  req.session.destory;
  console.log('/logout', req.session);
  res.render('login');// will open the views/about.ejs
});

/*
Logout process (GET). remove the user details from session state.
Take the user back to the Login page.
*/
server.post('/logout', (req, res) => {
  req.session.username=null;
  req.session.password=null;
  req.session.destory;
  console.log('/logout', req.session);
  res.render('login');// will open the views/about.ejs
});


/*
Login process (GET). 
Requires the username and password to be submitted. This must be done via POST method.
Take the user back to the Login page.
*/
server.get('/login', (req, res) => {
  	res.render('login', { error: "Login details not correct, check and re-submit" } ); // will open the views/login.ejs
});


/*
Login process (POST). 
Get the username and password and save to session state. 
Take the user to the Search page.
*/
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


/*
Search process (GET). 
The search parameters will not be available with the query string so route the user to the Search page if the user details are available.
Otherwise route the user to the Login page.
*/
server.get('/search', (req, res) => {
  if (req.session.username && req.session.password) {
	console.log("got username and password", req.session.username)
	
 	res.render('search', { username: req.session.username, errorObj: '' } ); // will open the views/index.ejs
 } else {
	console.log("DONT have both  username and password", req.session.username)
  	res.render('login', { error: "Login details not correct, check and re-submit" } ); // will open the views/login.ejs
  }
});



/*
SearchUsers process (POST). 
Get the search parameters and call the GitHubSearcher API. 
Pass the response data to the Results page for rendering.
If an error occurs route back to the Search page and pass the error message 
*/
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

/*
Initiate a Web Server instance
*/
server.listen(4242, () => {
  console.log('Express Server is running...');
});
