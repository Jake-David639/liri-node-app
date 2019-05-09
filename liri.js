// importing dependancies
const fs = require('fs');
// const inquire = require('inquirer');
const axios = require('axios');
const Spotify = require('node-spotify-api');
const dotenv = require("dotenv").config();

// importing keys from keys.js
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

// taking user cli arguments
var searchType = process.argv[2];
var searchTerm = '';

//functions declarations, one to handle each search type

//OMBD API call function, default search term of "Mr. Nobody" is set if no search term is entered.
movieThis = (searchTerm) => {
    if(!searchTerm){
        searchTerm = 'Mr. Nobody';
    };
    axios.get("http://www.omdbapi.com/?t=" + searchTerm + "&plot=short&apikey=" + keys.omdb.key).then(
        function (response) {
            // print movie info to the terminal
            // console.log(response.data.Ratings);
            console.log(`
    Title: ${response.data.Title}
    Year released: ${response.data.Released}
    IMDB rating: ${response.data.imdbRating}
    Rotten Tomatoes rating: ${response.data.Ratings[1].Value}
    Filmed in: ${response.data.Country}
    Languages: ${response.data.Language}
    Plot Summary: ${response.data.Plot}
    Lead Actors: ${response.data.Actors}`);
        }
    ).catch(function (err) {
        console.log(err);
    });
};


checkConcerts = (searchTerm) => {
    axios.get("https://rest.bandsintown.com/artists/" + searchTerm + "/events?app_id=" + keys.bandsInTown.key).then(
        function (response) {
            // Then we print out the imdbRating
            console.log(`${response.data[0].lineup}
            ${response.data[0].offers}`);
            // console.log(response);
        }
    ).catch(function (err) {
        console.log(err);
    });
};

spotifySearch = (searchTerm) => {
    spotify
        .search({ type: 'track', query: searchTerm })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (err) {
            console.log(err);
        });

};



// switch for handling each of the search types
switch (searchType) {
    case 'concert-this':
        searchTerm = process.argv.slice(3).join('+');
        checkConcerts(searchTerm);
        break;

    case 'spotify-this-song':
        searchTerm = process.argv.slice(3).join('+');
        spotifySearch(searchTerm);
        break;

    case 'movie-this':
        searchTerm = process.argv.slice(3).join('+');
        movieThis(searchTerm);
        break;

    case 'do-what-it-says':
        var fileInput = fs.readFile('./random.txt', 'utf8',function(){
            fileInput.split(',');
            switch (fileInput[0]) {
                case 'concert-this':
                    checkConcerts(fileInput[1]);
                    break;
                case 'spotify-this-song':
                    spotifySearch(fileInput[1]);
                    break;
                case 'movie-this':
                    movieThis(fileInput[1]);
                    break;
                default:
                    console.log('The search operation read from random.txt is in the wrong format. Check the file and try again please.');
                    break;
            }
        });
        break;

    default:
        console.log('The entered search operation is invalid');
        break;
}
