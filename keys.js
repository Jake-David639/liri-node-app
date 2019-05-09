console.log('keys loaded');

exports.spotify = {
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
};

exports.omdb = {
    key: process.env.OMDB_KEY
};

exports.bandsInTown = {
    key: process.env.BIT_KEY
};