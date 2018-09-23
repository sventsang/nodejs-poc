// index.js
'use strict';

// Include module dependencies
var request = require('request'),
	_ = require('underscore');

// HELPER FUNCTIONS -- used in class methods

// converts the sign to it's hex code
function convertSign(sign) {
	var output;

	switch (sign) {
		case '<':
			output = '%3C';
			break;

		case '=':
			output = '%3D';
			break;

		case '>':
			output = '%3E';
			break;

		default:
			output = sign;
			break;
	}

	return output;
};

// adds parameters that describe how the results are displayed to the end of the url
function appendResultParams(params, url) {
// add the page number to the end of the query, if a page is specified
	if (typeof params['page'] !== 'undefined') {
		url += '&page=' + params['page'];
	}

	// add sort if exists
	if (typeof params['sort'] !== 'undefined') {
		url += '&sort=' + params['sort'];
	}

	// add order if exists
	if (typeof params['order'] !== 'undefined') {
		url += '&order=' + params['order'];
	}

	return url;
};

// function to add the first + sign in a query
// checks to see if this is the first element in the query or not
function addFirstPlus(url) {
	// checks to see where the last character in the string is a =
	if (url[url.length - 1] === '=') {
		return '';
	} else {
		return '+';
	}
};

// CLASS DEFINITION AND METHODS

// Create GithubSearcher class
function GithubSearcher(options) {
	if (!(this instanceof GithubSearcher)) {
		return new GithubSearcher(options);
	}

	if (_.isEmpty(options)) {
		throw new Error('Please pass in your username and password!');
	}

	// create static member of this class that holds the authentication information
	this.auth = {
		username: options['username'],
		password: options['password']
	};

	// create a static variable that holds the options that need to be passed into the GET request
	this.options = {
		url: '',
		headers: {
			'User-Agent': this.auth.username,
			// add authorization to header so that you can send authenticated headers
			'Authorization': 'Basic ' + new Buffer(this.auth.username + ':' + this.auth.password).toString('base64')
		}
	};

	this.endpoints = {
		base: 'https://api.github.com',
		usersUrl: '/search/users',
		reposUrl: '/search/repositories',
		issuesUrl: '/search/issues',
		codeUrl: '/search/code'
	};
}

// method to search for users
GithubSearcher.prototype.searchUsers = function(params, callback) {

	// throw error if the callback is not a function
	if (typeof callback !== 'function') {
		throw new Error('Callback is not a function!');
	}

	// ensure that some parameters are passed into the method
	if (_.isEmpty(params) || params === null) {
		throw new Error('Parameters are invalid!');
	}

	// create the base of the url
	var url = this.endpoints.base + this.endpoints.usersUrl + '?q=';

	// check type of argument entered
	// if a query string, just concatenate the string directly to the url
	if (typeof params === 'string') {
		url += params;

	// if an object, then create the url string by iterating through the object
	} else if (typeof params === 'object') {

		// add the term part first, since it is added differently
		if (typeof params['term'] !== 'undefined') {
			url += params['term'];
		}

		// go through members of the JSON object passed into the method
		for (var k in params) {
			if (k === 'repos' || k === 'followers') {
				// repos and followers allows user to pass in comparison operators >, <, =
				url += addFirstPlus(url) + k + ':' + convertSign(params[k][0]) + params[k].substring(1, params[k].length);
			} else if (k !== 'term' && k !== 'page' && k !== 'sort' && k !== 'order') {
				// term and page are handled separately/ differently 
				url += addFirstPlus(url) + k + ':' + params[k];
			}
		}

		// add last parts to the url if any of them are defined
		url = appendResultParams(params, url);
	}

	// Print the url we are pinging
	console.log('Querying at endpoint: ' + url);

	// update this.options to hold the new url
	this.options.url = url;

	// Use the request module to ping the url
	request.get(this.options, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			// pass our result to the callback
			callback(JSON.parse(body));
		}
	});

	// return this instance of GithubSearcher
	return this;
};

// method to query repositories
GithubSearcher.prototype.searchRepos = function(params, callback) {
	// throw error if the callback is not a function
	if (typeof callback !== 'function') {
		throw new Error('Callback is not a function!');
	}

	// ensure that some parameters are passed into the method
	if (_.isEmpty(params) || params === null) {
		throw new Error('Parameters are invalid!');
	}

	var url = this.endpoints.base + this.endpoints.reposUrl + '?q=';

	if (typeof params === 'string') {
		url += params;
	} else if (typeof params === 'object') {

		// add the term part first, since it is added differently
		if (typeof params['term'] !== 'undefined') {
			url += params['term'];
		}

		// go through members of the JSON object passed into the method
		for (var k in params) {
			if (k === 'forks' || k === 'stars' || k === 'size') {
				// forks, stars and size allows user to pass in comparison operators >, <, =
				// convert first element in string, and then concatenate the remainder of the string
				url += addFirstPlus(url) + k + ':' + convertSign(params[k][0]) + params[k].substring(1, params[k].length);
			} else if (k !== 'term' && k !== 'page' && k !== 'sort' && k !== 'order') {
				// term, page, sort and order are handled separately/ differently 
				url += 	addFirstPlus(url) + k + ':' + params[k];
			}
		}

		// add last parts to the url if any of them are defined
		url = appendResultParams(params, url);
	}

	// Print the url we are pinging
	console.log('Querying at endpoint: ' + url);

	// updated this.options to hold the new url
	this.options.url = url;

	// use request module to ping url
	request.get(this.options, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			// pass our result to the callback
			callback(JSON.parse(body));
		}
	});

	// return current instance of GithubSearcher
	return this;
};

GithubSearcher.prototype.searchCode = function(params, callback) {

	// throw error if the callback is not a function
	if (typeof callback !== 'function') {
		throw new Error('Callback is not a function!');
	}

	// ensure that some parameters are passed into the method
	if (_.isEmpty(params) || params === null) {
		throw new Error('Parameters are invalid!');
	}

	var url = this.endpoints.base + this.endpoints.codeUrl + '?q=';

	if (typeof params === 'string') {
		url += params;
	} else if (typeof params === 'object') {

		// add the term part first, since it is added differently
		if (typeof params['term'] !== 'undefined') {
			url += params['term'];
		}

		// go through members of the JSON object passed into the method
		for (var k in params) {
			if (k === 'size') {
				// size allows user to pass in comparison operators >, <, =
				// convert first element in string, and then concatenate the remainder of the string
				url += addFirstPlus(url) + k + ':' + convertSign(params[k][0]) + params[k].substring(1, params[k].length);
			} else if (k !== 'term' && k !== 'page' && k !== 'sort' && k !== 'order') {
				// term, page, sort and order are handled separately/ differently 
				url += 	addFirstPlus(url) + k + ':' + params[k];
			}
		}

		// add last parts to the url if any of them are defined
		url = appendResultParams(params, url);

	}

	// Print the url we are pinging
	console.log('Querying at endpoint: ' + url);

	// updated this.options to hold the new url
	this.options.url = url;

	// use request module to ping url
	request.get(this.options, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			// pass our result to the callback
			callback(JSON.parse(body));
		}
	});

	// return current instance of GithubSearcher
	return this;

};

GithubSearcher.prototype.searchIssues = function(params, callback) {

	// throw error if the callback is not a function
	if (typeof callback !== 'function') {
		throw new Error('Callback is not a function!');
	}

	// ensure that some parameters are passed into the method
	if (_.isEmpty(params) || params === null) {
		throw new Error('Parameters are invalid!');
	}

	var url = this.endpoints.base + this.endpoints.issuesUrl + '?q=';

	if (typeof params === 'string') {
		url += params;
	} else if (typeof params === 'object') {

		// add the term part first, since it is added differently
		if (typeof params['term'] !== 'undefined') {
			url += params['term'];
		}

		// go through members of the JSON object passed into the method
		for (var k in params) {
			// just add everything to the query
			// there are no cases where <, >, = are used
			if (k !== 'term' && k !== 'page' && k !== 'sort' && k !== 'order') {
				url += addFirstPlus(url) + k + ':' + params[k];
			}
		}

		// add last parts to the url if any of them are defined
		url = appendResultParams(params, url);

	}

	// Print the url we are pinging
	console.log('Querying at endpoint: ' + url);

	// updated this.options to hold the new url
	this.options.url = url;

	// use request module to ping url
	request.get(this.options, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			// pass our result to the callback
			callback(JSON.parse(body));
		}
	});

	// return current instance of GithubSearcher
	return this;
};

module.exports = GithubSearcher;