;(function(){
	var w = window;
	//创建一个摇动实例
	var shake = new Shake({
		//摇动阈值
		threshold : 1,
		//事件发生频率
		timeout : 0
	});
	var Direction = new function () { 
		this.UP = 'btnUp';
		this.DOWN = 'btnDown';
		this.LEFT = 'btnLeft';
		this.RIGHT = 'btnRight';
	}; 
	w.Rock = {
		host : 'ws://'+'192.168.1.103',
		//host : 'ws://'+'112.23.225.213',
		port : 8000,
		//连接被控制的页面
		login : function(){
			var _this = this;
			//告诉服务器，客户端要进入的房间号
			this.socket.emit('login',{
				room_id : _this.roomID,
				nick : document.getElementById('user_name').value
			});

			//监听服务器返回的消息
			_this.onLogin();
			//隐藏蒙版
			$('.mask').hide();
		},
		//断开连接
		logout : function(){

		},
		//初始化
		init : function(){
			//获取扫描的房间的roomid
			this.roomID = window.location.pathname.replace('/client/','');
			//实例化一个socket
			this.socket = io.connect(this.host + ':' + this.port);
			
			var _this = this;
			

			$('#enter').click(function(e){
				//点击进入房间的按钮
				_this.login();
			});
			$('#btnStart').click(function(e){
				//发送消息
				_this.onStart();
				this.disabled = true; 
				document.getElementById("selSpeed").disabled = true; 
				document.getElementById("selSize").disabled = true; 
			})
		},
		//处理服务器发送的login事件
		onLogin : function(){
			var _this = this;
			this.socket.on('login',function(data){
				//保存用户自身的uid
				if (data.msg) {
					alert('此房间已有人链接，请更换另一间！');
					$('.mask').show();
					return;
				}
				_this.UID = data.uid;
			});
		},
		//处理事件
		onStart : function(){
			var _this = this;
		 	_this.socket.emit('start',{
				room_id : _this.roomID,
				//uid : data.uid,
				nick : document.getElementById('user_name').value,
			 });

		 	/*处理移动方向*/
		 	$('#btnUp').click(function(e){
				//发送消息
				_this.socket.emit('dealEvent',{
					room_id : _this.roomID,
					dir : Direction.UP
				 });
			});

			$('#btnDown').click(function(e){
				//发送消息
				_this.socket.emit('dealEvent',{
					room_id : _this.roomID,
					dir : Direction.DOWN
				 });
			});
			$('#btnLeft').click(function(e){
				//发送消息
				_this.socket.emit('dealEvent',{
					room_id : _this.roomID,
					dir : Direction.LEFT
				 });
			});
			$('#btnRight').click(function(e){
				//发送消息
				_this.socket.emit('dealEvent',{
					room_id : _this.roomID,
					dir : Direction.RIGHT
				 });
			});
		}
	};
	//初始化
	w.Rock.init();
})();