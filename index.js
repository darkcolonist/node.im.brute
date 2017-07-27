'use strict';
var async = require('async');
var curler = require('./lib/curler');
curler.init();

var url = "http://dev.test/curlable.php?client=chronus";
// var url = "http://20170727111527someunknownurl.com";

var iterations = 200;
var concurrency = 50;

var success = 0;
var fail = 0;

var queue = async.queue((task, callback) => {
  curler.call(task.url, undefined, callback);
}, concurrency);

queue.drain = () => {
  console.info(`process completed! success: ${success} | failed: ${fail}`);
};

for(let i = 0; i < iterations ; i++){
  queue.push({url: url}, (status) => {
    if(status === "fail") fail ++;
    if(status === "success") success ++;

    console.info(`sent request ${i}, status: ${status}`);
  });
}