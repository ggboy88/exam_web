$(function(){
	$.ajax({
		url:"http://localhost:8181/course/selectSpecialty",
		type:"GET",
		xhrFields:{
			withCredentials: true,
		},
		crossDomain: true,
		dataType:'json',
		success:function(data){
			if(data.code != 601){
				$("#font").text(data.message);
			}else{
				var specialty = data.data;
				for(var i = 0;i < specialty.length;i++){
					$("#specialty").append("<option value='"+specialty[i].specialtyId+"'>"+specialty[i].specialtyName+"</option>")
				}
			}
		}
	})
})
function register(){
	var phone = $("#phone").val();
	var username = $("username").val();
	var specialtyId = $("#specialty").val();
	var password = $("#password").val();
	
	$.ajax({
		url:"http://localhost:8181/auth/stu/register",
		type:"POST",
		data:{
			"specialtyId":specialtyId,
			"stuInfo":{
				"username":username,
				"phone":phone,
				"password":password
			}
		},
		xhrFields:{
			withCredentials: true,
		},
		crossDomain: true,
		dataType:'json',
		success:function(data){
			if(data.code != 601){
				$("#font").text(data.message);
			}else{
				alert("注册成功");
				window.location.href="login.html";
			}
		}
	})
}