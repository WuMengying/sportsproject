var config = require('./config/wxconfig')();
var express = require('express');
var app = express();
var http = require('http').Server(app);
//var io = require('socket.io')(http);
var fs=require('fs');
var port = 9101;
var signature = require('wx_jsapi_sign');
var request = require('request');
var cache = require('memory-cache');
var sha1 = require('sha1'); //签名算法
var path = require('path');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
app.use(serveStatic(__dirname, {'index': ['index.html']}))
app.use(bodyParser.urlencoded({ extended: false }));  

var JsonObj,clientCount = 0,successCount=0;
var datapath = path.join(__dirname, 'data/data.json');
if(fs.existsSync(datapath)){
	JsonObj=JSON.parse(fs.readFileSync(datapath));
	clientCount = JsonObj.clientCount,
	successCount=JsonObj.successCount;
}else
	console.log("fail open data.json");
function write(){
	fs.writeFileSync(datapath,JSON.stringify({clientCount:clientCount,successCount:successCount}));
}
app.post('/getsignature', function(req, res){
  var url = req.body.url;
  console.log(url);
  signature.getSignature(config)(url, function(error, result) {
    if (error) {
      res.json({
        'error': error
      });
    } else {
      res.json(result);
    }
  });
});

app.post('/connection', function(req, res){
  clientCount++;
      res.json({
        'clientCount': clientCount
      });
});

app.post('/success', function(req, res){
	successCount++;
	console.log('第'+successCount+'个用户完成了！');
	if(successCount%10==0)
		write();
	  res.json({
	    'successCount': successCount
	  });
});
http.listen(port, function(){
	console.log('listening on *:'+port);
});

