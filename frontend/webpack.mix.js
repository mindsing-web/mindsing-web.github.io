// webpack.mix.js

const path = require('path');
const mix = require('laravel-mix');

const cssPath = 'static/css';

// Set the public folder path.
mix.setPublicPath(path.normalize('../web/'));

mix.sass('resources/sass/app.scss', `${cssPath}`);
mix.sass('resources/sass/calculator.scss', `${cssPath}`);
