$(document).ready(function(){
	tips("操作成功！");
	sendAjax("http://localhost:8181/stu/selectAllCourseInfo",null,"GET",function(res){
		if(res.code != 601){
			layui.use('layer',function(){
				var layer = layui.layer;
				layer.msg(res.message);
			})
		}else{
			var courseList = res.data.list;
			for (var i = 0; i < courseList.length; i++) {
				if(courseList[i].hasExam){
					var examInfos = courseList[i].examInfos;
					for (var j = 0; j < examInfos.length; j++) {
						$("#examList").append("<tr><td>"
						+courseList[i].subject.courseName
						+"</td><td>"
						+examInfos[j].startTime
						+"</td><td>"
						+examInfos[j].endTime
						+"</td><td>"
						+examInfos[j].paperId
						+"</td><td>"
						+examInfos[j].status
						+"</td><td><button type='button' class='layui-btn layui-btn-sm' id='"
						+examInfos[j].id
						+"' onclick='startExam(this.id)'>开始考试</button></td></tr>")
						if(examInfos[j].status === "已结束" || examInfos[j].status === "待执行"){
							$("#"+examInfos[j].id).attr("class","layui-btn layui-btn-sm layui-btn-disabled");
							$("#"+examInfos[j].id).attr("disabled",true);
						}
					}
				}
			}
		}
	})
	
	sendAjax("http://localhost:8181/exam/hasExam",null,"GET",function(res){
		if(res.code != 601){
			layui.use('layer',function(){
				var layer = layui.layer;
				layer.msg(res.message);
			})
		}else{
			if(res.data !== false){
				sendAjax("http://localhost:8181/exam/isSubmit",null,"GET",function(res1){
					if(res.code != 601){
						layui.use('layer',function(){
							var layer = layui.layer;
							layer.msg(res1.message);
						})
					}else{
						if(res1.data == true){
							$("#"+res.data).attr("class","layui-btn layui-btn-sm layui-btn-disabled");
							$("#"+res.data).text("已交卷");
							$("#"+res.data).attr("disabled",true);
						}else{
							layui.use("layer",function(){
								var layer = layui.layer;
								layer.open({
								        content:"检测到有正在进行的考试，是否进入？",
											  yes:function(index,layero){
												window.location.href = "/exam/html/student/examPage.html";
												layer.close(index);
											  }
								      });
							});
						}
					}
				})
			}
		}
	})
	
})

function searchByExample(){
	var courseName = $("#courseName").val();
	var paperId = $("#paperId").val();
	var examTime = $("#examTime").val();
	var status = $("#status").val();
	var startTime = null;
	var endTime = null;
	
	$("#examList").html("");
	if(examTime != ""){
		var times = examTime.split("~");
		var startTime = times[0];
		startTime = startTime.replace(/^\s+|\s+$/g,"");
		var endTime = times[1];
		endTime = endTime.replace(/^\s+|\s+$/g,"");
		
		sendAjax("http://localhost:8181/stu/selectAllCourseInfo",{"courseName":courseName,"startTime":startTime,"endTime":endTime,"paperId":paperId,"status":status},"GET",function(res){
			if(res.code != 601){
				layui.use('layer',function(){
					var layer = layui.layer;
					layer.msg(res.message);
				})
			}else{
				var courseList = res.data.list;
				for (var i = 0; i < courseList.length; i++) {
					if(courseList[i].hasExam){
						var examInfos = courseList[i].examInfos;
						for (var j = 0; j < examInfos.length; j++) {
							$("#examList").append("<tr><td>"
							+courseList[i].subject.courseName
							+"</td><td>"
							+examInfos[j].startTime
							+"</td><td>"
							+examInfos[j].endTime
							+"</td><td>"
							+examInfos[j].paperId
							+"</td><td>"
							+examInfos[j].status
							+"</td><td><button type='button' class='layui-btn layui-btn-sm' id='"
							+examInfos[j].id
							+"' onclick='startExam(this.id)'>开始考试</button></td></tr>")
							if(examInfos[j].status === "已结束" || examInfos[j].status === "待执行"){
								$("#"+examInfos[j].id).attr("class","layui-btn layui-btn-sm layui-btn-disabled");
								$("#"+examInfos[j].id).attr("disabled",true);
							}
						}
					}
				}
			}
		});
	}else{
		sendAjax("http://localhost:8181/stu/selectAllCourseInfo",{"courseName":courseName,"paperId":paperId,"status":status},"GET",function(res){
			if(res.code != 601){
				layui.use('layer',function(){
					var layer = layui.layer;
					layer.msg(res.message);
				})
			}else{
				var courseList = res.data.list;
				for (var i = 0; i < courseList.length; i++) {
					if(courseList[i].hasExam){
						var examInfos = courseList[i].examInfos;
						for (var j = 0; j < examInfos.length; j++) {
							$("#examList").append("<tr><td>"
							+courseList[i].subject.courseName
							+"</td><td>"
							+examInfos[j].startTime
							+"</td><td>"
							+examInfos[j].endTime
							+"</td><td>"
							+examInfos[j].paperId
							+"</td><td>"
							+examInfos[j].status
							+"</td><td><button type='button' class='layui-btn layui-btn-sm' id='"
							+examInfos[j].id
							+"' onclick='startExam(this.id)'>开始考试</button></td></tr>")
							if(examInfos[j].status === "已结束" || examInfos[j].status === "待执行"){
								$("#"+examInfos[j].id).attr("class","layui-btn layui-btn-sm layui-btn-disabled");
								$("#"+examInfos[j].id).attr("disabled",true);
							}
						}
					}
				}
			}
		});
	}
}

function resetExample(){
	$("#courseName").val("");
	$("#paperId").val("");
	$("#examTime").val("");
	$("#status").val("");
}

function startExam(examId){
	layui.use("layer",function(){
		var layer = layui.layer;
		layer.open({
		        content:"确认开始当前考试？（同一时间段只能进行一场考试）",
					  yes:function(index,layero){
						  sendAjax("http://localhost:8181/stu/startExam",{"examId":examId},"GET",function(data){
						  	if(data.code != 601){
						  		layui.use('layer', function(){
						  		  var layer = layui.layer;
						  		  layer.msg(data.message);
						  		}); 
						  	}else{
								window.location.href = "/exam/html/student/examPage.html";
						  	}
						  });
						  layer.close(index);
					  }
		      });
	})
}