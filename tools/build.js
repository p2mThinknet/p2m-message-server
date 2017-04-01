/**
 * Created by colinhan on 23/03/2017.
 */

import {transformFileSync, util} from 'babel-core';
import chokidar from 'chokidar';
import path from 'path';
import slash from "slash";
import fs from 'fs';
import outputFileSync from 'output-file-sync';
import readDir from "fs-readdir-recursive";
import moment from 'moment';

const DEBUG = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

const sourceDir = 'src';
const outputDir = 'build';
const configDir = 'config';

function chmod(src, dest) {
  fs.chmodSync(dest, fs.statSync(src).mode);
}

function addSourceMappingUrl(code, loc) {
  return code + "\n//# sourceMappingURL=" + path.basename(loc);
}

function babelingFile(src, dest) {
  let data = transformFileSync(src, {
    sourceFileName: slash(path.relative(dest + "/..", src)),
    sourceMapTarget: path.basename(dest),
    extends: slash(path.relative(dest + "/..", '.babelrc')),
    plugins: [["transform-define", {
      "__DEV__": DEBUG ? "DEV" : "",
    }]]
  });

  let mapLoc = dest + ".map";
  outputFileSync(mapLoc, JSON.stringify(data.map));

  data.code = addSourceMappingUrl(data.code, mapLoc);
  outputFileSync(dest, data.code);

  chmod(src, dest);

  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] [babel] ${src} -> ${dest}`);
}

function copyFile(src, filename) {
  let dest = path.join(outputDir, filename);
  outputFileSync(dest, fs.readFileSync(src));
  chmod(src, dest);

  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] [copy] ${src} -> ${dest}`);
}
function compileFile(src, filename) {
  if (util.canCompile(filename)) {
    babelingFile(src, path.join(outputDir, filename));
  } else {
    copyFile(src, filename);
  }
}

function handle(filename) {
  if (!fs.existsSync(filename)) return;

  let stat = fs.statSync(filename);

  if (stat.isDirectory(filename)) {
    let dirname = filename;

    readDir(dirname).forEach(function (filename) {
      let src = path.join(dirname, filename);
      compileFile(src, filename);
    });
  } else {
    compileFile(filename, filename);
  }
}
handle(sourceDir);

if (DEBUG) {
  let watcher = chokidar.watch([sourceDir, configDir], {
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 50,
      pollInterval: 10
    }
  });

  ["add", "change"].forEach(function (type) {
    watcher.on(type, function (filename) {
      let relative = path.relative(sourceDir, filename) || filename;
      try {
        compileFile(filename, relative);
      } catch (err) {
        console.error(err.stack);
      }
    });
  });
}