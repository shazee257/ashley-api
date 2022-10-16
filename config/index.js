const { readFileSync } = require('fs');
const { parse } = require('ini');

let config = parse(readFileSync(`${__dirname}/config.ini`, 'utf-8'));
export default config;