// importing dependancies
const fs = require('fs');
// const inquire = require('inquirer');
const axios = require('axios');
const dotenv = require("dotenv").config();
const Spotify = require('node-spotify-api');

// importing keys from keys.js
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

// taking user cli arguments
var searchType = process.argv[2];
var searchTerm = process.argv.slice(3).join(' ');

// switch for handling each of the search types
switch (searchType) {
    case 'concert-this':
        
        break;

    case 'spotify-this-song':

        break;

    case 'movie-this':

        break;
    
    case 'do-what-it-says':

        break;

    default:
        console.log('The entered search operation is invalid');
        break;
}

