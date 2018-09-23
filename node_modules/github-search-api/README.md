github-search-api
=================

##Overview

Node.js wrapper for the Github Search API. 

The Github Search API lets you use queries to find information regarding users, repos, issues and code. The wrapper lets you query data using a JSON object instead of a query string, and get data asynchronously as you would expect with a Node.js module.

##Installation

Run `npm install github-search-api` from your terminal in the directory of your Node.js app.

##Usage

Here's an example of searching for a user called 'tom' who has more than 42 repos and more than 1000 followers.


	var GithubSearcher = require('github-search-api');
	var github = new GithubSearcher({username: '<username>', password: '<password>'});
	
	var params = {
		'term': 'tom',
		'repos': '>42',
		'followers': '>1000'
	};
	
	github.searchUsers(params, function(data) {
		console.log(data);
	});
	
Instantiating the GithubSearcher requires your Github username and password because they are needed to send authenticated HTTP requests.

The params variable can be either a string (formatted as the Github Search API requires) or a JSON object with keys that are parameters listed on the Github Search API page (https://developer.github.com/v3/search/). The 'term' key is an additional feature, that should hold the term you are searching for. 

Use >, <, = for defining a range when using numbers.

The callback in every method of the GithubSearcher only returns one value, the JSON results returned from Github.

##Repository

http://www.github.com/nevilgeorge/github-search-api

##Questions?

Feel free to email me!