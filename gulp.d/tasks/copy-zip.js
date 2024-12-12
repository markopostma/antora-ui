"use strict";

const { resolve, parse } = require("path");
const vfs = require("vinyl-fs");

module.exports = (src, dest) => done =>
  !dest
    ? done()
    : vfs
        .src(resolve(src))
        .pipe(vfs.dest(parse(resolve(dest)).dir, { overwrite: true }))
        .once("error", done)
        .once("finish", done);
