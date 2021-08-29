#!/usr/bin/env node
import { request } from 'https';
import { spawn } from 'child_process';

const getArgument = (longName, shortName) => {
    const args = process.argv.slice(2);
    const value = args.find(arg => arg.includes(`--${shortName || longName[0] }=`) || arg.includes(`--${longName}=`));

    return value ? value.split('=')[1] : null;
}

const data = JSON.stringify({
    url: process.argv[2],
    name: getArgument('name'),
    password: getArgument('password'),
    limit: getArgument('limit')
});

const PROTOCOL = 'https://'
const HOSTNAME = 'srtr.herokuapp.com';

const options = {
    hostname: HOSTNAME,
    port: 443,
    path: '/api/url',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
    },
};

const req = request(options, (response) => {
    const status = response.statusCode;
    let result = '';
    response.on('data', (data) => {
        result += data;
    });

    response.on('end', () => {
        if (status === 200) {
            const data = JSON.parse(result);
            const url = `${PROTOCOL}${HOSTNAME}/${data.name}`;
            pbcopy(url);
            console.log(`URL copied to clipboard: ${PROTOCOL}${HOSTNAME}/${data.name}`);

            return;
        }
        console.log(`Statuscode: ${status}`);
        console.log(result);
    });
});

function pbcopy(data) {
    var proc = spawn('pbcopy');
    proc.stdin.write(data);
    proc.stdin.end();
}

req.on('error', (error) => {
    console.error(error);
});

req.write(data);
req.end();
