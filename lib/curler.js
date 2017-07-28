var util = require('./util');

var curler = {
  Curl: {},
  tunnel: {},
  init: function(){
    curler.Curl = require( 'node-libcurl' ).Curl;
  },
  call: function(url, body, callback, additional){
    additional = additional === undefined ? {} : additional;
    var id = additional.id === undefined ? util.randstring(8) : additional.id;

    if(body === undefined){
      body = { code: 0, message: id+" some random message" };
    }else{
      body.im_brute_id = id;
    }


    curler.tunnel = new curler.Curl();
    curler.tunnel.setOpt( curler.Curl.option.URL, url );
    curler.tunnel.setOpt( 'FOLLOWLOCATION', true );
    curler.tunnel.setOpt( curler.Curl.option.HTTPPOST, [
      { name: 'data', contents: JSON.stringify(body) }
    ]);

    curler.tunnel.on( 'end', function( statusCode, body, headers ) {

      // console.info( statusCode );
      // console.info( '---' );
      // console.info( body.length );
      // console.info( '---' );
      // console.info( headers );
      // console.info( '---' );
      // console.info( this.getInfo( curler.Curl.info.TOTAL_TIME ) );

      // var logMessage = this.getInfo( curler.Curl.info.TOTAL_TIME )
      //   + " | " + statusCode + " | " + body + " | ";

      if(typeof callback === 'function') callback('success', id);

      var logMessage = util.array2logMessage([
          this.getInfo( curler.Curl.info.TOTAL_TIME ).toFixed(3),
          statusCode,
          body,
          url
        ]);

      util.logf('calls', logMessage, 'info');

      this.close();
    });

    curler.tunnel.on( 'error', function( err, curlErrorCode ) {

      if(typeof callback === 'function') callback('fail',id);

      // console.error( err.message );
      // console.error( '---' );
      // console.error( curlErrorCode );

      var logMessage = util.array2logMessage([
          this.getInfo( curler.Curl.info.TOTAL_TIME ).toFixed(3),
          curlErrorCode,
          err.message
        ]);

      util.logf('calls', logMessage, 'error');

      this.close();

    });

    curler.tunnel.perform();
  }
};

module.exports = curler;