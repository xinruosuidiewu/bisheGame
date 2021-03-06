function Room(param){
	//房间相关的参数
	var defaults = {
		//房间最大人数
		count : 100
	};

	//将传递过来的参数进行合并
	for(var p in param){
		if(param.p){
			defaults.p = param.p;
		}
	}

	//房间的id
	this.RoomID = '';
	//房间的成员列表
	this.Users = [];
	//房间最大成员数
	this.Max = defaults.count;
}
Room.prototype = {
	addUser : function(user){
		var _this = this;
		if(_this.Users.length >= _this.Max){
			//房间已经满员，直接返回
			return 0;
		}else{
			//添加用户，返回当前用户数目
			_this.Users.push(user);
			return _this.Users.length;
		}
	}
};