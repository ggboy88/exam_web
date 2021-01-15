function tips(msg){
	
	var isReload = sessionStorage.getItem("isReload");
	if(isReload === "yes"){
		layui.use('layer',function(){
			var layer = layui.layer;
			layer.msg(msg);
		});
		sessionStorage.setItem("isReload","no");
	}
	
}