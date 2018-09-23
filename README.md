# nodejs-poc

## Repository
http://www.github.com/sventsang/nodejs-poc


# Overview
Using Node.js, this is a POC to provide a web based interface to search GitHub. Currently only the GitHub users details are searched on. 

Acknowledgement: The project makes use of the github-search-api project (http://www.github.com/nevilgeorge/github-search-api) which provides the Github API calls. 

The project creates a web server instance to present the Login, Search & Results pages. 
The file index.js is the controlling script to process the page requests. 
In order to use the search function, the user's github credentials must be entered. These are held within the web sesson parameters. These are destroyed on logout node.js termination.
The web pages are rendered EJS views and rely on String and JSON parameters being passed from the control script.
The web pages within the broswer also use JavaScript for selection and navigation.



# Installation

Node.js version is v8.12.0

The following packages need to be installed in the root directory of the project.

## express & express-session
npm install express
npm install express-session

## ejs
npm install ejs

## github-search-api
npm install github-search-api








# Usage

## start the web server
node ./index.js


With a broswer access http://localhost:4242/ You will be routed to a Login page for your your GitHub username and password. You will then be routed to the Search page. Enter one or more search parameters. Default values are available via the "Default" button.

The Search options are:
	'term': A string value or name to search on.
	'repos': The number of repositories that the owner has. Use "<", "=", or ">" before the number.
	'followers': The number of followers that the owner has. Use "<", "=", or ">" before the number.

Clicking search will display the results or any GitHub search errors. 



