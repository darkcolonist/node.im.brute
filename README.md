# node.im.brute
brute tester for inbound requests

## change these parameters in index.js
### url target
```
var url = "http://20170727111527someunknownurl.com";
```
### mockData
```
return {
    "username":"tester",
    "password":"tester",
    "service_code":"testersvc",
    "to":toHelper.random(),
    "from":fromHelper.random(),
    "message":messages.random(),
    "additional_info":{}
  };
```
### toHelper
the to helper assists in randomizing recipients
customize the array to your liking

### fromHelper
similar to toHelper but assists in randomizing authors
customize the array to your liking

## running
```
λ node index.js -i <iterations> -c <concurrency>
λ node index.js -i 5000 -c 10
λ node index.js -i 50000 -c 500
```

## output
```
λ node index.js -i 1 -c 100
sent request 0, status: fail
process completed! success: 0 | failed: 1
concurrency: 100 | iterations: 1
```

## logs
could be found in `/traces/calls.log`
note that the auto logrotate is also implemented so the logs will be found in `calls1.log` or `calls2.log` incrementally