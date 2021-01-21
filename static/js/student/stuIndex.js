$(document).ready(function(){
	tips("修改成功");
	var token = sessionStorage.getItem("token");
	sendAjax("http://localhost:8181/stu/queryUser",null,"GET",function(data){
			if(data.code != 601){
				window.location.href="/exam/html/login.html";
			}else{
				var imgUrl = data.data.imgUrl;
				if(imgUrl !== null){
					var split = imgUrl.split("head");
					var path = "../../static/img/head" + split[1];
					$("#viewHead").attr("src",path);
					$("#disHead").attr("src",path);
					$("#username").text(data.data.username);
					$("#changeUsername").val(data.data.username);
					$("#changeName").val(data.data.phone);
				}else{
					$("#username").text(data.data.username);
					$("#changeUsername").val(data.data.phone);
					$("#changeName").val(data.data.username);
				}
			}
		});
		
	sendAjax("http://localhost:8181/course/selectStuSpecialtyName",null,"GET",function(data){
		$("#specialtyName").text(data.data);
	});
	
	sendAjax("http://localhost:8181/stu/selectCourseInfo",null,"GET",function(res){
		if(res.code != 601){
			layui.use('layer',function(){
				var layer = layui.layer;
				layer.msg(res.message);
			})
		}else{
			$("#specialty").html("");
			var subjects = res.data;
			for (var i = 0; i < subjects.length; i++) {
				$("#specialty").append("<tr><td>"
				+subjects[i].subject.courseId
				+"</td><td>"
				+subjects[i].subject.courseName
				+"</td><td>"
				+subjects[i].teaName
				+"</td></tr>")
			}
		}
	})
	
	sendAjax("http://localhost:8181/stu/searchCourseAndTeacher",null,"GET",function(res){
		if(res.code != 601){
			layui.use('layer',function(){
				var layer = layui.layer;
				layer.msg(res.message);
			})
		}else{
			$("#specialty1").html("");
			var subjectList = res.data.list;
			var pageInfo = res.data;
			for (var i = 0; i < subjectList.length; i++) {
				$("#specialty1").append("<tr><td>"
				+subjectList[i].subject.courseId
				+"</td><td>"
				+subjectList[i].subject.courseName
				+"</td><td><select id='"
				+subjectList[i].subject.courseId
				+"'></select></td><td><button type='button' class='layui-btn layui-btn-sm' onclick='applySub(this.id)' id='"
				+subjectList[i].subject.courseId
				+"sub'>申请课程</button></td></tr>")
				for (var j = 0; j < subjectList[i].users.length; j++) {
					$("#"+subjectList[i].subject.courseId).append("<option value='"
					+subjectList[i].users[j].id
					+"'>"
					+subjectList[i].users[j].teacherName
					+"</option>")
				}
			}
			
			layui.use(['laypage','layer'],function(){
				var laypage = layui.laypage
				  ,layer = layui.layer;
				laypage.render({
				    elem: 'search'
				    ,count: pageInfo.total
					,limit: 5
					,limits:[5]
				    ,layout: ['count', 'prev', 'page','limit','next', 'refresh', 'skip']
				    ,jump: function(obj,first){
						if(!first){
							jumpToCheck(obj.curr);
						}
				    }
				  });
			})
		}
	})
	
	sendAjax("http://localhost:8181/stu/getAlarm",null,"GET",function(res){
		if(res.data !== null){
			$("#alarm").text(res.data);
		}
	})
	
})

function logout(){
	sessionStorage.removeItem("token");
	window.location.href="/exam/html/login.html";
}

function jumpToCheck(pageNum){
	sendAjax("http://localhost:8181/stu/searchCourseAndTeacher",{"pageNum":pageNum},"GET",function(res){
		if(res.code != 601){
			layui.use('layer',function(){
				var layer = layui.layer;
				layer.msg(res.message);
			})
		}else{
			$("#specialty1").html("");
			var subjectList = res.data.list;
			var pageInfo = res.data;
			for (var i = 0; i < subjectList.length; i++) {
				$("#specialty1").append("<tr><td>"
				+subjectList[i].subject.courseId
				+"</td><td>"
				+subjectList[i].subject.courseName
				+"</td><td><select id='"
				+subjectList[i].subject.courseId
				+"'></select></td><td><button type='button' class='layui-btn layui-btn-sm' onclick='applySub(this.id)' id='"
				+subjectList[i].subject.courseId
				+"sub'>申请课程</button></td></tr>")
				for (var j = 0; j < subjectList[i].users.length; j++) {
					$("#"+subjectList[i].subject.courseId).append("<option value='"
					+subjectList[i].users[j].id
					+"'>"
					+subjectList[i].users[j].teacherName
					+"</option>")
				}
			}
		}
	})
}

function applySub(id){
	var courseId = id.split("sub")[0];
	var teacherId = $("#"+courseId).val();
	
	sendAjax("http://localhost:8181/stu/sendApply",{"courseId":courseId,"teaId":teacherId},"GET",function(res){
		layui.use('layer',function(){
			var layer = layui.layer;
			layer.msg(res.data);
		})
	})
}

function changeMsg(){
	layui.use("layer",function(){
		layer.open({
		       type: 1,
		       title:"修改信息",
		       shift: 2,
		       area: ['450px', '400px'],
		       shadeClose: true,
		       // btn: ['新增', '取消'],
		       // btnAlign: 'c',
		       content: $("#add-main")
		     });
	})	 
}

function apply(){
	layui.use("layer",function(){
		layer.open({
		       type: 1,
		       title:"课程申请",
		       shift: 2,
		       area: ['600px', '500px'],
		       shadeClose: true,
		       // btn: ['新增', '取消'],
		       // btnAlign: 'c',
		       content: $("#chooseSubject")
		     });
	})	
}

function showSubjects(){
	layui.use("layer",function(){
		layer.open({
			type: 1,
			title: "课程信息",
			shift: 2,
			area: ['450px','400px'],
			shadeClose: true,
			content: $("#subjectList")
		});
	})
}

function showHead(obj){
	var file = obj.files[0];
	var url = URL.createObjectURL(file);
	$("#disHead").attr("src",url);
	var formData = new FormData();
	formData.append("file",file);
	var token = sessionStorage.getItem("token");
	$.ajax({
	    url: "http://localhost:8181/stu/uploadHead",
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
	    }
	});
}

function checkPassword(obj){
	var password = hex_md5(obj);
	sendAjax("http://localhost:8181/stu/checkPassword",{"password":password},"GET",function(res){
		if(res.code != 601){
			$("#warn").text("旧密码错误！");
			$("#submit").attr("class","layui-btn layui-btn-disabled");
		}else{
			$("#warn").text("");
			$("#submit").attr("class","layui-btn");
		}
	})
}

function updateUser(){
	var username = $("#changeUsername").val();
	var password = $("#changePassword").val();
	var name = $("#changeName").val();
	password = hex_md5(password);
	var data = {"username":username,"password":password,"name":name};
	sendAjax("http://localhost:8181/stu/updateUser",JSON.stringify(data),"POST",function(res){
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

