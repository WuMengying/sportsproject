var express = require('express');
var app = express();
var getMsg = require('https');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs=require('fs');
var port = 9101;
//wechat signature
var config = require('./config/config');
var data = require('./data/data.json');
var util = require('./util/util');
var sign = require('./sign.js');

var serveStatic = require('serve-static');
app.use(serveStatic(__dirname, {'index': ['index.html']}))

//当前在线人数
var JsonObj,clientCount = 0,successCount=0;
if(fs.existsSync('data/data.json')){
	JsonObj=JSON.parse(fs.readFileSync('data/data.json'));
	clientCount = JsonObj.clientCount,
	successCount=JsonObj.successCount;
}else
	console.log("fail open data.json");
function write(){
	fs.writeFileSync('data/data.json',JSON.stringify({clientCount:clientCount,successCount:successCount}));
}

var appID = config.wechat.appID;
var appSecret = config.wechat.appSecret;
var token = undefined,ticket,fetchtime = undefined, ticketTime = undefined,keeptime=7180;
function getaccesstoken(){
	var options = {
		  host: 'api.weixin.qq.com',
		  grant_type:'client_credential',
		  appid:appID,
		  secret:appSecret,
		  path: '/cgi-bin/token',
		  method: 'GET'
		};
	var json = '';
		var req = getMsg.request(options, function(res) {
		  console.log(res);
		  res.on('data', function(d) {
		  	process.stdout.write(d);
        	json += d;
		  	var back=JSON.parse(d);
		  	token = back.access_token;
		  });

		    res.on('end',function(){
		        //获取到的数据
		        json = JSON.parse(json);
				console.log(json);
		    });
		});
	req.end();
	fetchtime = new Date().getTime();	
}
function getTicket(){
	var fetch = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token="+
	token+"&type=jsapi";
	var options = {
		  host: 'api.weixin.qq.com',
		  access_token:token,
		  type:'jsapi',
		  path: '/cgi-bin/ticket/getticket',
		  method: 'GET'
		};

		var req = getMsg.request(options, function(res) {
		  console.log(res.statusCode);
		  res.on('data', function(d) {
		  	process.stdout.write(d);
		  	var back=JSON.parse(d);
		  	ticket = back.ticket;
		  });
		});
		req.end();
	ticketTime = new Date().getTime();	
}
io.on('connection', function(socket){
	var now = new Date().getTime();	
	if(!token||now-fetchtime>=keeptime*1000){
		getaccesstoken();
	}
	if(!ticket||now- ticketTime>=keeptime*1000){
		getTicket();
	}
	var conf = sign(ticket, 'http://wesalon.cc:9101');
	console.log('a user connected'+conf);
	socket.emit('config',conf);
	clientCount++;
	socket.emit('visit', {clientCount:clientCount});
	//监听新用户加入
	socket.on('success', function(obj){
		successCount++;
		socket.emit('sucnum', {successCount:successCount});
		console.log('第'+successCount+'个用户完成了！');
		if(successCount%10==0)
			write();
	});
	
	console.log('visit count:'+clientCount);
});

http.listen(port, function(){
	console.log('listening on *:'+port);
});
