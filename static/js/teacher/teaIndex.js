$(document).ready(function(){
	tips("修改成功");
	var token = sessionStorage.getItem("token");
	sendAjax("http://localhost:8181/tea/selectUser",null,"GET",function(data){
			if(data.code != 601){
				window.location.href="/exam/html/login.html";
			}else{
				var imgUrl = data.data.imageUrl;
				var split = imgUrl.split("head");
				var path = "../../static/img/head" + split[1];
				$("#viewHead").attr("src",path);
				$("#disHead").attr("src",path);
				$("#username").text(data.data.teacherName);
				$("#changeUsername").val(data.data.username);
				$("#changeName").val(data.data.teacherName);
				sessionStorage.setItem("password",data.data.password);
			}
		});
	sendAjax("http://localhost:8181/tea/selectStuApplyAccount",null,"GET",function(data){
			if(data.code != 601){
				window.location.href="/exam/html/login.html";
			}else{
				$("#applyAccount").text(data.data);
			}
		});
	sendAjax("http://localhost:8181/course/selectTeaSpecialtyName",null,"GET",function(data){
		$("#specialtyName").text(data.data);
	})
})
function logout(){
	sessionStorage.removeItem("token");
	window.location.href="/exam/html/login.html";
}

function changeMsg(){
	layui.use("layer",function(){
		layer.open({
		       type: 1,
		       title:"新建配置",
		       shift: 2,
		       area: ['450px', '400px'],
		       shadeClose: true,
		       // btn: ['新增', '取消'],
		       // btnAlign: 'c',
		       content: $("#add-main")
		     });
	})
	 
}

function showHead(obj){
	var file = obj.files[0];
	var url = URL.createObjectURL(file);
	console.log(url);
	$("#disHead").attr("src",url);
	var formData = new FormData();
	formData.append("file",file);
	var token = sessionStorage.getItem("token");
	$.ajax({
	    url: "http://localhost:8181/tea/uploadHead",
	    type: "post",
	    data: formData,
		xhrFields:{
			withCredentials: true,
		},
		beforeSend:function(XMLHttpRequest){
			XMLHttpRequest.setRequestHeader("token",token);
		},
	    processData: false, // 告诉jQuery不要去处理发送的数据
	    contentType: false, // 告诉jQuery不要去设置Content-Type请求头
	    dataType: 'text',
	    success: function(data) {
	    var params = JSON.parse(data);
		console.log(params);
	    }
	});
}

function checkPassword(obj){
	var password = sessionStorage.getItem("password");
	if(obj !== password){
		$("#warn").text("旧密码错误！");
		$("#submit").attr("class","layui-btn layui-btn-disabled");
	}else{
		$("#warn").text("");
		$("#submit").attr("class","layui-btn");
	}
}

function updateUser(){
	var username = $("#changeUsername").val();
	var password = $("#changePassword").val();
	var name = $("#changeName").val();
	var data = {"username":username,"password":password,"name":name};
	sendAjax("http://localhost:8181/tea/updateUser",JSON.stringify(data),"POST",function(res){
		if(res.code != 601){
			layui.use('layer',function(){
				var layer = layui.layer;
				layer.msg(res.message);
			})
		}else{
			sessionStorage.setItem("isReload","yes");
			window.location.reload();
		}
	})
	
}

function resetParam(){
	$("#changeUsername").val("");
	$("#changeName").val("");
}