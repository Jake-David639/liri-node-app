// importing dependancies
const fs = require('fs');

// const inquire = require('inquirer');
const axios = require('axios');
const Spotify = require('node-spotify-api');
const dotenv = require('dotenv').config();
const moment = require('moment');

// importing keys from keys.js
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

// taking user cli arguments
var searchType = process.argv[2];
var searchTerm = '';

//functions declarations, one to handle each search type

//OMBD API call function, default search term of "Mr. Nobody" is set if no search term is entered.
movieThis = (searchTerm) => {
    if (!searchTerm) {
        searchTerm = 'Mr. Nobody';
    };

    axios.get("http://www.omdbapi.com/?t=" + searchTerm + "&plot=short&apikey=" + keys.omdb.key).then(
        function (response) {
            // print movie info to the terminal
            // console.log(response.data.Ratings);
            let movieData = `
Title: ${response.data.Title}
Year released: ${response.data.Released}
IMDB rating: ${response.data.imdbRating}
Rotten Tomatoes rating: ${response.data.Ratings[1].Value}
Filmed in: ${response.data.Country}
Languages: ${response.data.Language}
Plot Summary: ${response.data.Plot}
Lead Actors: ${response.data.Actors}`;

            fs.appendFile('log.txt', '\n\nCommand: movieThis for ' + searchTerm, (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            });

            fs.appendFile('log.txt', movieData, (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            });

            console.log(movieData);
        }
    ).catch(function (err) {
        console.log(err);
    });
};


checkConcerts = (searchTerm) => {
    axios.get("https://rest.bandsintown.com/artists/" + searchTerm + "/events?app_id=" + keys.bandsInTown.key).then(
        function (response) {
            if (response.data.length == 0) {
                return console.log('No shows found for the requested band.');
            }
            let concertData = ``;

            concertData += `\nUpcomming shows for: ${searchTerm}`;
            response.data.forEach(element => {
                var date = moment(element.datetime).format('MM/DD/YYYY');
                concertData += `\n--------------------------------`;
                concertData += `\n${element.venue.name}`;
                concertData += `\n   ${element.venue.city}, ${element.venue.region}`;
                concertData += `\n          ${element.venue.country}`;
                concertData += `\n                  On ${date}`;
            });

            console.log(concertData);

            fs.appendFile('log.txt', '\n\nCommand: checkConcerts for ' + searchTerm, (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            });
            fs.appendFile('log.txt', concertData, (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            });
            
        }
    ).catch(function (err) {
        console.log(err);
    });
};

spotifySearch = (searchTerm) => {
    if (!searchTerm) {
        searchTerm = 'The Sign';
    }
    spotify
        .search({ type: 'track', query: searchTerm })
        .then(function (response) {

            let trackData = `
${response.tracks.items[0].album.artists[0].name}
${response.tracks.items[0].name}
${response.tracks.items[0].preview_url}
${response.tracks.items[0].album.name}`;

            fs.appendFile('log.txt', '\n\nCommand: spotifySearch for ' + searchTerm, (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            });
            fs.appendFile('log.txt', trackData, (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            });

            console.log(trackData);
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
        fs.readFile('./random.txt', 'utf8', (err, data) => {
            if (err) throw err;
            console.log(data);
            fileInput = data.split(',');
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
