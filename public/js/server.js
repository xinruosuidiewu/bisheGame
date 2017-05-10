;(function(){
	var w = window;
	var d = document;
	var wrapper = d.getElementById('wrapper');
	w.Rock = {
		//host : 'ws://'+'192.168.1.100',
		host : 'ws://'+'112.23.80.112',
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
			
			/**************************************************************************/
			
			var Common = new function () { 
				this.width = 40; /*水平方向方格数*/ 
				this.height = 40; /*垂直方向方格数*/ 
				this.speed = 250; /*速度 值越小越快*/ 
				this.workThread = null; 
			}; 
			function Control(){
				/*初始化函数，创建表格*/ 
				this.Init = function (pid) { 
					var html = []; 
					html.push("<table>"); 
					for (var y = 0; y < Common.height; y++) { 
						html.push("<tr>"); 
						for (var x = 0; x < Common.width; x++) { 
							html.push('<td id="box_' + x + "_" + y + '"> </td>'); 
						} 
						html.push("</tr>"); 
					} 
					html.push("</table>"); 
					this.pannel = document.getElementById(pid); 
					this.pannel.innerHTML = html.join(""); 
				}; 
			}
			/*创建棋盘*/
			var control = new Control();
			control.Init("pannel");


			/**************************************************************************/


			var _this = this;
			//向服务器注册一个房间
			_this.registerRoom(_this.roomID);
			//监听用户加入的消息
			_this.onUserEnter();
			//监听用户通信
			_this.onUserStart();
		},
		//用户进入房间的事件
		onUserEnter : function(){
			this.socket.on('userEnter',function(obj){
				//获取传递过来的用户id
				var uid = obj.uid;
				//创建一个bootstrap容器
				// var width = d.createElement('div');
				// width.setAttribute('class','pin');
				// var pan = d.createElement('div');
				// pan.setAttribute('class','panel panel-default');

				//根据客户端传递过来的昵称创建对应的面板
				// var nick = d.createElement('div');
				// nick.setAttribute('class','panel-heading');
				// nick.innerHTML = obj.nick;

				// var inner = d.createElement('div');
				// inner.setAttribute('class','panel-body');
				// inner.setAttribute('id','msgbox');

				// pan.appendChild(nick);
				// pan.appendChild(inner);
				// width.appendChild(pan);
				// wrapper.insertBefore(width,wrapper.firstChild);
			});
		},
		//用户发送消息
		onUserStart : function(){
			var _this = this;
			_this.socket.on('userStart',function(obj){
				// var uid = obj.uid;
				
				// if(!uid){
				// 	return;
				// }
				
				alert("开始了！");
			});
		}
	};
	//初始化
	w.Rock.init();
})();