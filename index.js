'use strict';
var async = require('async');
var curler = require('./lib/curler');
var program = require('commander');

program
  .version('0.1.0')
  .option('-c, --concurrency <n>', 'Set Concurrency')
  .option('-i, --iterations <n>', 'Set Iterations')
  .option('-r, --random', 'Set Random ID')
  .parse(process.argv);

curler.init();

var url = "http://dev.test/curlable.php?client=chronus";
// var url = "http://20170727111527someunknownurl.com";

var iterations = program.iterations ? program.iterations : 200;
var concurrency = program.concurrency ? program.concurrency : 50;

var success = 0;
var fail = 0;

var queue = async.queue((task, callback) => {
  curler.call(task.url, undefined, callback, { id: task.id });
}, concurrency);

queue.drain = () => {
  console.info(`process completed! success: ${success} | failed: ${fail}`);
  console.info(`concurrency: ${concurrency} | iterations: ${iterations}`);
};

function callback(status, id) {  
  if(status === "fail") fail ++;
  if(status === "success") success ++;

  console.info(`sent request ${id}, status: ${status}`);
}

for(let i = 0; i < iterations ; i++){

  var data = {};

  data.url = url;

  if(!program.random)
    data.id = i;

  queue.push(data, callback);
}