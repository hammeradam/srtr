const fs = require('fs');

fs.readFile(
    './public/js/utils/authentication.js',
    'utf8',
    function (error, data) {
        if (error) {
            console.log(error);
        }

        let result = data;

        if (process.env.BASE_URL) {
            result = result.replace(
                /(BASE_URL = ')[^']+/,
                '$1' + process.env.BASE_URL
            );
        }

        if (process.env.GOOGLE_CLIENT_ID) {
            result = result.replace(
                /(GOOGLE_CLIENT_ID = ')[^']+/,
                '$1' + process.env.GOOGLE_CLIENT_ID
            );
        }

        if (process.env.GITHUB_CLIENT_ID) {
            result = result.replace(
                /(GITHUB_CLIENT_ID = ')[^']+/,
                '$1' + process.env.GITHUB_CLIENT_ID
            );
        }

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
