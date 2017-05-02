;(function(){
	var w = window;
	var d = document;
	var wrapper = d.getElementById('wrapper');
	w.Rock = {
		host : 'ws://'+'192.168.1.101',
		port : 8000,
		//连接被控制的页面
		registerRoom : function(rid){
			//告诉服务器，客户端要进入的房间号
			this.socket.emit('registerRoom',{
				room_id : rid
			});
		},
		//断开连接
		unregisterRoom : function(rid){
			var _this = this;
			this.socket.emit('unregisterRoom',{
				room_id : rid
			});
		},
		//初始
		//
		init : function(){
			//获取扫描的房间的roomid
			this.roomID = document.getElementById('room_id').value;
			//实例化一个socket
			this.socket = io.connect(this.host + ':' + this.port);
			
			var _this = this;
			//向服务器注册一个房间
			_this.registerRoom(_this.roomID);
			//监听用户加入的消息
			_this.onUserEnter();
			//监听用户摇动手机
			//_this.onUserShake();
			//监听用户通信
			_this.onUserMessage();
		},
		//用户进入房间的事件
		onUserEnter : function(){
			this.socket.on('userEnter',function(obj){
				//获取传递过来的用户id
				var uid = obj.uid;

				//创建一个bootstrap容器
				var width = d.createElement('div');
				width.setAttribute('class','pin');
				var pan = d.createElement('div');
				pan.setAttribute('class','panel panel-default');

				//根据客户端传递过来的昵称创建对应的面板
				var nick = d.createElement('div');
				nick.setAttribute('class','panel-heading');
				nick.innerHTML = obj.nick;

				var inner = d.createElement('div');
				inner.setAttribute('class','panel-body');
				inner.setAttribute('id','msgbox');
				// inner.innerHTML = obj.message;

				pan.appendChild(nick);
				pan.appendChild(inner);
				width.appendChild(pan);
				wrapper.insertBefore(width,wrapper.firstChild);
			});
		},
		//用户发送消息
		onUserMessage : function(){
			var _this = this;
			_this.socket.on('userMessage',function(obj){
				// var uid = obj.uid;
				
				// if(!uid){
				// 	return;
				// }
				
				var msg = obj.umessage;
				var msgBox = document.getElementById('msgbox');
				msgBox.innerHTML=msg;
			});
		}
	};
	//初始化
	w.Rock.init();
})();