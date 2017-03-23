/**
 * Created by colinhan on 23/03/2017.
 */

import co from 'co';
import express from 'express';

let app = express();

// if (__DEV__) {
//   const webpack = require('webpack');
//   const webpackDevMiddleware = require('webpack-dev-middleware');
//   const webpackConfig = require('../webpack.config');
//
//   var compiler = webpack(webpackConfig);
//
//   app.use(webpackDevMiddleware(compiler, {
//     publicPath: "/"
//   }));
// }

app.listen(3000);
console.log('Service is starting at http://localhost:3000');

