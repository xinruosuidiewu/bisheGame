;(function(){
	var w = window;
	//创建一个摇动实例
	var shake = new Shake({
		//摇动阈值
		threshold : 1,
		//事件发生频率
		timeout : 0
	});
	w.Rock = {
		host : 'ws://'+'192.168.1.102',
		port : 8000,
		//连接被控制的页面
		login : function(){
			var _this = this;
			//告诉服务器，客户端要进入的房间号
			this.socket.emit('login',{
				room_id : _this.roomID,
				nick : document.getElementById('user_name').value
			});
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
				//监听服务器返回的消息
				_this.onLogin();
				//监听完成比赛事件
				//_this.onUserMessage();
				//隐藏蒙版
				$('.mask').hide();
			});
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

				//在建立连接后监听shake事件
				shake.start();
				w.addEventListener('shake',function(e){
					// e.preventDefault();
					// e.stopPropagation();
					//告诉服务器，用户摇手机了
					_this.socket.emit('shake',{
						room_id : _this.roomID,
						uid : data.uid
					});
					
				},false);
			});
		},
		//处理完成事件
		onUserComplete : function(){
			var _this = this;
			_this.socket.on('userComplete',function(data){
				//取消shake事件的监听
				w.removeEventListener('shake',function(e){},false);
				shake.stop();

				if(data.uid == _this.UID){
					alert('您的能量已加满！点击确定进行接下来的行程');
					$('.main').hide();
					_this.socket.emit('commnipage',{
						room_id : _this.roomID,
						uid : data.uid
					});
				}
			});
		}
	};
	//初始化
	w.Rock.init();
})();