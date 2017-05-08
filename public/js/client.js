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
		host : 'ws://'+'192.168.1.100',
		port : 8000,
		//连接被控制的页面
		login : function(){
			var _this = this;
			if(!(document.getElementById('user_name').value)){
				alert("请输入你的姓名！");
				return;
			}
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
			 // function isWeiXin(){
    //             var ua = window.navigator.userAgent.toLowerCase();
    //             if(ua.match(/MicroMessenger/i) == 'micromessenger'){
    //                 return true;
    //             }else{
    //                 return false;
    //             }
    //         }
    //         if(isWeiXin()){
    //         //alert("是微信浏览器");
    //         }else{
    //        	 	alert("请使用微信扫一扫！");
	   //          $(document.body).hide();
				// window.document.title="";
				// window.close();
    //         }

			//获取扫描的房间的roomid
			this.roomID = window.location.pathname.replace('/client/','');
			//实例化一个socket
			this.socket = io.connect(this.host + ':' + this.port);
			
			var _this = this;
			

			$('#enter').click(function(e){
				//点击进入房间的按钮
				_this.login();
			});
			$('#say').click(function(e){
				//发送消息
				_this.onMessage();
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
		//处理完成事件
		onMessage : function(){
			 var _this = this;
			 if (confirm("是否确认提交")) {
			 	this.socket.emit('message',{
					room_id : _this.roomID,
					// uid : data.uid,
					nick : document.getElementById('user_name').value,
				 	message : $('.msg').val()
				 });
			 	alert("提交成功，谢谢使用！");
			 	WeixinJSBridge.call('closeWindow');
			 }else{ }
			 
		}
	};
	//初始化
	w.Rock.init();
})();