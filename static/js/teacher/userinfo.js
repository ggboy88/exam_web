/* $(document).ready(function(){
	tips("修改成功");
	
}) */

function showPassword(){

	if($("#passwordIcon").name === "hide"){
		alert()
	}else{
		$("#passwordIcon").src = "../../static/img/密码隐藏.png";
		$("#passwordIcon").name = "hide";
	}
	
}