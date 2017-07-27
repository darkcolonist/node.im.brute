var moment  = require('moment-timezone');
var winston = require('winston');
var randstring = require('randomstring');
winston.remove(winston.transports.Console);

var util = {
  _loggers: {},
  /**
   * like the above but instead, this logs to file
   *
   * sample usage:
   * 
   * util.logf('debug-leakance','example-'+util.randstring(4, util.rand(5,16)));
   * util.logf('debug-duodecimo','example-'+util.randstring(4, util.rand(5,16)));
   * util.logf('debug-undefied','example-'+util.randstring(4, util.rand(5,16)));
   * util.logf('debug-burring','example-'+util.randstring(4, util.rand(5,16)));
   * util.logf('debug-lux','example-'+util.randstring(4, util.rand(5,16)));
   */
  logf: function(type, message, level){
    var level = level === undefined ? "info" : level;

    var theLogger = null;
    if(util._loggers[type] == undefined){
      theLogger = new (winston.Logger)({
        transports: [
          new (winston.transports.File)({
            filename: `./traces/${type}.log`,
            json: false,
            maxsize: 1000000, // 1MB
            timestamp: () => {
              return util.moment(null, { 
                // format: "YYYY-MM-DD HH:mm:ss.SS",
                format: "YYYY-MMM-DD h:mm:ss.SSA",
                timezone: "Asia/Manila"
              });
            },
            maxFiles: 1
          })
        ]
      });

      util._loggers[type] = theLogger;
    }else{
      theLogger = util._loggers[type];
    }

    theLogger.log(level, message);
  },
  /**
   * get a moment instance pre-configured
   * @param  string datetime     nullable
   * @param  Object customParams 
   *         { 
   *           // null if you prefer application timezone
   *           timezone: "America/Los_Angeles", 
   *           
   *           // null if you prefer the default format of momentJS
   *           format: "MMMM Do YYYY, h:mm:ss a", 
   *         }
   * @return {[type]}              [description]
   */
  moment: function(datetime, customParams){
    if(datetime === null)
      datetime = undefined;

    var myMoment = moment(datetime);

    if(customParams === undefined)
      customParams = {};

    if(customParams.timezone !== undefined){
      myMoment.tz(customParams.timezone);
    }else{
      myMoment.tz(config.app.timezone);
    }

    if(customParams.format !== undefined){
      return myMoment.format(customParams.format);
    }else{
      return myMoment;
    }
  },

  array2logMessage: function(array){
    var message = "";

    for(var index in array){
      let thing = array[index];

      // replace newlines with [n]
      thing = thing.toString().replace(/(?:\r\n|\r|\n)/g, "[n]");

      message += thing;

      if(index != array.length - 1){
        message += " | ";
      }
    }

    return message;
  },
  randstring: function(length){
    return randstring.generate(length);
  }
}

module.exports = util;