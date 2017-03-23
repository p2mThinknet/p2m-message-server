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

const sourceDir = 'src';
const outputDir = 'build';

function chmod(src, dest) {
  fs.chmodSync(dest, fs.statSync(src).mode);
}

function addSourceMappingUrl(code, loc) {
  return code + "\n//# sourceMappingURL=" + path.basename(loc);
}

function compileFile(src, dest) {
  let data = transformFileSync(src, {
    sourceFileName: slash(path.relative(dest + "/..", src)),
    sourceMapTarget: path.basename(dest)
  });

  let mapLoc = dest + ".map";
  outputFileSync(mapLoc, JSON.stringify(data.map));

  data.code = addSourceMappingUrl(data.code, mapLoc);
  outputFileSync(dest, data.code);

  chmod(src, dest);

  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${src} -> ${dest}`);
}

function handleFile(src, filename) {
  if (util.canCompile(filename)) {
    compileFile(src, path.join(outputDir, filename));
  } else {
    let dest = path.join(outputDir, filename);
    outputFileSync(dest, fs.readFileSync(src));
    chmod(src, dest);
  }
}

function handle(filename) {
  if (!fs.existsSync(filename)) return;

  let stat = fs.statSync(filename);

  if (stat.isDirectory(filename)) {
    let dirname = filename;

    readDir(dirname).forEach(function (filename) {
      let src = path.join(dirname, filename);
      handleFile(src, filename);
    });
  } else {
    write(filename, filename);
  }
}
handle(sourceDir);

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  let watcher = chokidar.watch(sourceDir, {
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
        handleFile(filename, relative);
      } catch (err) {
        console.error(err.stack);
      }
    });
  });
}