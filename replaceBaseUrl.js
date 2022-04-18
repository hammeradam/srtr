const fs = require('fs');

fs.readFile(
    './public/js/utils/authentication.js',
    'utf8',
    function (err, data) {
        const result = data
            .replace(/(BASE_URL = ')[^']+/, '$1' + 'https://srtr.herokuapp.com')
            .replace(
                /(GITHUB_CLIENT_ID = ')[^']+/,
                '$1' + process.env.GITHUB_CLIENT_ID
            )
            .replace(
                /(GOOGLE_CLIENT_ID = ')[^']+/,
                '$1' + process.env.GOOGLE_CLIENT_ID
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
