var express = require('express');
var hbs = require('hbs');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//标识符生成模块
var uuid = require('node-uuid');

//二维码生成模块
var qrCode = require('qrcode-npm');

//房间模块
var room = require('./lib/room.js');
//用户模块
var user = require('./lib/user.js');

//房间列表
var rooms = [];

//设置express的静态资源目录
app.use(express.static('public'));

//设置模板引擎的后缀名
app.set('view engine','html');

//运行hbs木块
app.engine('html',hbs.__express);

//路由处理
app.get('/', function(req, res){
	
	var rid = createKey();
	//定义协议
	var http = 'http://'
	//获取请求的url
	var host = req.headers.host;
	//生成对应的二维码
	var qr = qrCode.qrcode(8,'M');
	qr.addData(http + host + '/client/' + rid);
	qr.make();

	res.render('server',{
		data : qr.createImgTag(3),
		room_id : rid
	});
});

app.get('/server', function(req, res){
	res.render('server');
});

app.get('/client*', function(req, res){
	res.render('client');
});


//---------------------websocket设置-------------------
//在线房间列表
var onlineRooms = {};
//当前在线人数
var onlineCount = 0;

io.on('connection', function(socket){
	//监听房间注册
	socket.on('registerRoom',function(obj){
		//房间的socket名称设置为房间的id
		socket.name = obj.room_id;
		//检查是否已经有该房间
		if(!onlineRooms.hasOwnProperty(obj.room_id)){
			//如果该房间不存在则创建该房间
			var r = room.createRoom({
				RoomID : obj.room_id
			});
			//将房间添加到房间列表中
			onlineRooms[obj.room_id] = r;
		}else{
			console.log(obj.room_id + ' existed!');
		}
	});
	//监听用户接入
	socket.on('login',function(obj){
		var rid = obj.room_id;
		//找到对应的房间
		var r = onlineRooms[rid];
		var _s = socket;
		var isfull=false;
		if(r.Users.length >= r.Max){
			console.log('有人想进入满员房间'+rid+',系统已阻止！');
			/***************************************/
			isfull = true;
			_s.emit('login',{
				msg : isfull,
			});
			return;
		}else{
			//找到该房间并修改相应的数据
			var index = r.Users.length + 1;
			//并创建这样一个用户
			var u = user.create({
				Name : rid + index,
				Nick : obj.nick == '' ? '匿名'  + index : obj.nick
			});
			//用户的socket的名称设置为房间id+序号
			socket.name = rid + index;
			//用户进入房间
			r.Users.push(u);
		}
		//返回连接的用户它的uid，用于后面的通信
		//用当前socket来回发一条消息，而不能用广播，否则会影响所有的socket
		
		_s.emit('login',{
			uid : u.Name,
		});
		//告诉对应的server.html页面，新的用户加入
		var s = io.sockets.sockets;
		for(var i = 0;i < s.length;i++){
			if(s[i].name == rid){
				//找到该用户所在的房间对应的socket
				s[i].emit('userEnter',{
					uid : rid + index,
					nick : u.Nick
				});
			}
		}
	});

	//监听用户退出
	socket.on('disconnect',function(){
		//获取房间号和用户昵称
		var _s = socket;
		//console.log('有人退出连接');
		delete _s;
	});

	socket.on('start',function(obj){
		//获取房间号和用户id
		var rid = obj.room_id;
		// var uid = obj.uid;
		
		//告诉对应的用户
		var s = io.sockets.sockets;
		for(var i = 0;i<s.length;i++){
			if(s[i].name == rid){
				s[i].emit('userStart',{
					unick : obj.nick,
					// uid : uid,
				});
			}
		}
		console.log("开始！");
	});
	socket.on('dealEvent',function(obj){
		//获取房间号和用户id
		var rid = obj.room_id;
		// var uid = obj.uid;
		console.log("anjian！");
		console.log(obj.dir);
		//告诉对应的用户
		var s = io.sockets.sockets;
		for(var i = 0;i<s.length;i++){
			if(s[i].name == rid){
				s[i].emit('userdealEvent',{
					unick : obj.nick,
					// uid : uid,
					udir : obj.dir
				});
			}
		}
	});
});

//生成唯一的room的id
function createKey(){
	//取字符串的前6位
	return uuid.v4().substr(0,6);
}
//启动服务器
http.listen(8000, function(){
	console.log('listening on *:8000');
});