//#!/usr/bin/env node
(function () {

    'use strict';

    var fs = require('fs'),
        pt = require('path');

    // var alternate_move,
    //     moveFile;

    // alternate_move = function (origin, destination, next) {
    //     var read  = fs.createReadStream(origin),
    //         write = fs.createWriteStream(destination);

    //     read.pipe(write);

    //     write.on('close', function () {
    //         fs.unlink(origin, function (err) {
    //             next(err);
    //         });
    //     });
    // };

    // moveFile = function (origin, destination, next) {
    //     fs.rename(origin, destination, function (err) {
    //         if (err) {return alternate_move(origin, destination, next);}
    //         next(null);
    //     });
    // };

    var base = process.argv[2],
        folders = [],
        files = {};

    //add base folder to queue
    folders.push(base);

    //process folders
    function read (folder) {
        if (fs.existsSync(folder)) {

            var content = fs.readdirSync(folder);

            content.forEach(function (file) {
                var path = pt.join(folder, file),
                    stats = fs.statSync(path);
                if (stats.isDirectory()) {
                    //add to folder queue
                    folders.push(path);
                } else {
                    //add to files queue
                    files[path] = true;
                }
            });
        }
    }

    //traverse subfolders
    var i = 0;
    while (folders[i]) {
        var folder = folders[i];
        read(folder);
        i++;
    }

    console.log('');
    console.log('MOVED');
    //move files to base folder
    Object.keys(files).forEach(function (key) {
        var path = key,
            file = pt.basename(path),
            target = pt.join(base, file);
        //rename/move
        if (!fs.existsSync(target)) {
            console.log(file);
            fs.renameSync(path, target);
            delete files[key];
        }
    });
    console.log('');
    console.log('NOT MOVED');
    console.log(JSON.stringify(Object.keys(files), undefined, 2));
}());
