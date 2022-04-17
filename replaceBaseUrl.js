const fs = require('fs');

fs.readFile(
    './public/js/utils/authentication.js',
    'utf8',
    function (err, data) {
        const result = data
            .replace(/http:\/\/localhost:3000/g, 'https://srtr.herokuapp.com')
            .replace(/9fd26d2f35d5520e4f3a/, process.env.GITHUB_CLIENT_ID)
            .replace(
                /697090043703-5v8qd9p8efre0pdfo6s2c2ci5k9pld16.apps.googleusercontent.com/,
                process.env.GOOGLE_CLIENT_ID
            );

        fs.writeFile(
            './public/js/utils/authentication.js',
            result,
            'utf8',
            function (err) {
                if (err) return console.log(err);
            }
        );
    }
);