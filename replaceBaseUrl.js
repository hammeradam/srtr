const fs = require('fs');

fs.readFile(
    './public/js/utils/authentication.js',
    'utf8',
    function (err, data) {
        if (err) {
            return console.log(err);
        }
        var result = data.replace(
            /http:\/\/localhost:3000/g,
            'https://srtr.herokuapp.com'
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
