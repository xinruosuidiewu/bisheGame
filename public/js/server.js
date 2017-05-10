;(function(){
	var w = window;
	var d = document;
	var wrapper = d.getElementById('wrapper');
	var Direction = new function () { 
		this.UP = 'btnUp';
		this.DOWN = 'btnDown';
		this.LEFT = 'btnLeft';
		this.RIGHT = 'btnRight';
	}; 
	var Common = new function () { 
		this.width = 40; /*水平方向方格数*/ 
		this.height = 40; /*垂直方向方格数*/ 
		this.speed = 250; /*速度 值越小越快*/ 
		this.workThread = null; 
	}; 
	/*控制器*/
	function Control(){
		this.snake = new Snake(); 
		this.food = new Food();
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
		this.Start = function () { 
			var me = this; 
			// this.MoveSnake = function (ev) { 
			// 	var evt = ev; 
			// 	alert(evt);
			// 	me.snake.SetDir(evt); 
			// }; 
			// try { 
			// 	document.attachEvent("onkeydown", this.MoveSnake); 
			// } catch (e) { 
			// 	document.addEventListener("keydown", this.MoveSnake, false); 
			// } 
			this.food.Create(); 
			Common.workThread = setInterval(function () { 
				me.snake.Eat(me.food); 
				me.snake.Move(); 
			}, Common.speed); 
		};
	}
	/*蛇*/
	function Snake(){
		this.isDone = false;
		this.dir = Direction.RIGHT;
		this.pos = new Array(new Position());
		/*移动 - 擦除尾部，向前移动，判断游戏结束(咬到自己或者移出边界)*/ 
		this.Move = function (){
			document.getElementById("box_" + this.pos[0].X + "_" + this.pos[0].Y).className = "";
			//所有向前移动一步
			for (var i = 0; i < this.pos.length - 1; i++) { 
				this.pos[i].X = this.pos[i + 1].X; 
				this.pos[i].Y = this.pos[i + 1].Y; 
			}
			//重新设置头的位置 
			var head = this.pos[this.pos.length - 1];	
			switch (this.dir) { 
				case Direction.UP: 
					head.Y--; 
					break; 
				case Direction.RIGHT: 
					head.X++; 
					break; 
				case Direction.DOWN: 
					head.Y++; 
					break; 
				case Direction.LEFT: 
					head.X--; 
					break; 
			} 
			this.pos[this.pos.length - 1] = head;
			for(var i = 0;i<this.pos.length;i++){
				var isExits = false;
				for(var j = i+1;j<this.pos.length;j++)
					if (this.pos[j].X == this.pos[i].X&&this.pos[j].Y==this.pos[i].Y) {isExits = true;break;}
					if(isExits){this.Over();break}
				var obj = document.getElementById("box_"+this.pos[i].X+"_"+this.pos[i].Y);
				if (obj) 
					obj.className = "snake"; 
				else { 
					this.Over();/*移出边界*/ 
					break; 
				} 

			}
			this.isDone = true
		};/*Move*/
		/*游戏结束*/
		this.Over = function(){
			clearInterval(Common.workThread);
			alert('Game Over');
		};
		this.Eat = function(food){
			var head = this.pos[this.pos.length-1];
			var isEat = false;
			switch(this.dir){
				case Direction.UP:
					if (head.X == food.pos.X && head.Y == food.pos.Y + 1) isEat = true; 
					break; 
				case Direction.RIGHT: 
					if (head.Y == food.pos.Y && head.X == food.pos.X - 1) isEat = true; 
					break; 
				case Direction.DOWN: 
					if (head.X == food.pos.X && head.Y == food.pos.Y - 1) isEat = true; 
					break; 
				case Direction.LEFT: 
					if (head.Y == food.pos.Y && head.X == food.pos.X + 1) isEat = true; 
					break; 
			}
			if (isEat) { 
				this.pos[this.pos.length] = new Position(food.pos.X, food.pos.Y); 
				food.Create(this.pos); 
			}
		};
		/*控制移动方向*/
		this.SetDir = function (dir) { 
			switch (dir) { 
				case Direction.UP: 
					if (this.isDone && this.dir != Direction.DOWN) { 
						this.dir = dir; this.isDone = false; 
					} 
					break; 

				case Direction.RIGHT: 
					if (this.isDone && this.dir != Direction.LEFT) { 
						this.dir = dir; this.isDone = false; 
					} 
					break; 

				case Direction.DOWN: 
					if (this.isDone && this.dir != Direction.UP) { 
						this.dir = dir; this.isDone = false; 
					} 
					break; 

				case Direction.LEFT: 
					if (this.isDone && this.dir != Direction.RIGHT) { 
						this.dir = dir; this.isDone = false; 
					} 
					break; 
			} 
		};
	}/*Snake*/

	/*食物*/
	function Food(){
		this.pos = new Position();
		/*创建位置随机的食物*/
		this.Create = function(pos){
			document.getElementById("box_" + this.pos.X + "_" + this.pos.Y).className = ""; 
			var x=0,y=0,isCover = false;
			/*排除蛇的位置*/
			do { 
				x = parseInt(Math.random() * (Common.width - 1)); 
				y = parseInt(Math.random() * (Common.height - 1)); 
				isCover = false; 
				if (pos instanceof Array) { 
					for (var i = 0; i < pos.length; i++) { 
						if (x == pos[i].X && y == pos[i].Y) { 
							isCover = true; 
							break; 
						} 
					} 
				} 
			} while (isCover);
			this.pos = new Position(x,y);
			document.getElementById("box_" + x + "_" + y).className = "food";
		};
	}/*Food*/

	/*位置*/
	function Position(x,y){
		this.X = 0; 
		this.Y = 0; 
		if (arguments.length >= 1) this.X = x; 
		if (arguments.length >= 2) this.Y = y; 
	}/*Position*/
	
	w.Rock = {
		host : 'ws://'+'192.168.1.103',
		//host : 'ws://'+'112.23.225.213',
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
			//监听用户通信
			_this.onUserStart();
		},
		//用户进入房间的事件
		onUserEnter : function(){
			this.socket.on('userEnter',function(obj){
				//获取传递过来的用户id
				var uid = obj.uid;
			});
		},
		//用户发送消息
		onUserStart : function(){
			var _this = this;
			var control = new Control(); 
			_this.socket.on('userStart',function(obj){
				/*创建棋盘*/

				control.Init("pannel");
				control.Start(); 
			});

			_this.socket.on('userdealEvent',function(obj){
				control.snake.SetDir(obj.udir); 
				//control.Start.MoveSnake(obj.udir);
				//alert(obj.udir);
			});
		}/*onUserStart*/
	};/*w.Rock*/

	//初始化
	w.Rock.init();
})();