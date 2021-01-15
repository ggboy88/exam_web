$(document).ready(function(){
	tips("操作成功!");
	
	sendAjax("http://localhost:8181/exam/list/exam",null,"GET",function(res){
		if(res.code != 601){
			layui.use('layer',function(){
				var layer = layui.layer;
				layer.msg(res.message);
			})
		}else{
			var examList = res.data.list;
			var pageInfo = res.data;
			for (var i = 0; i < examList.length; i++) {
				$("#examList").append("<tr><td>"
				+examList[i].courseId
				+"</td><td>"
				+examList[i].startTime
				+"</td><td>"
				+examList[i].endTime
				+"</td><td>"
				+examList[i].paperId
				+"</td><td>"
				+examList[i].status
				+"</td><td><button type='button' class='layui-btn layui-btn-sm' id='"
				+examList[i].id
				+"' onclick='searchStuCount(this.id)'>查看</button><button type='button' class='layui-btn layui-btn-sm layui-btn-warm' id='"
				+examList[i].id
				+"alarm' onclick='alarmExam(this.id)'>通知考试</button><button type='button' class='layui-btn layui-btn-sm layui-btn-danger' id='"
				+examList[i].id
				+"delete' onclick='deleteExam(this.id)'>删除</button></td></tr>")
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
})

function jumpToCheck(pageNum){
	var courseName = $("#courseName").val();
	var paperId = $("#paperId").val();
	var examTime = $("#examTime").val();
	var status = $("#status").val();
	var startTime = null;
	var endTime = null;
	if(examTime != ""){
		var times = examTime.split("~");
		var startTime = times[0];
		startTime = startTime.replace(/^\s+|\s+$/g,"");
		var endTime = times[1];
		endTime = endTime.replace(/^\s+|\s+$/g,"");
		
		sendAjax("http://localhost:8181/exam/list/exam",{"pageNum":pageNum,"courseName":courseName,"startTime":startTime,"endTime":endTime,"paperId":paperId,"status":status},"GET",function(data){
			if(data.code != 601){
				layui.use('layer', function(){
				  var layer = layui.layer;
				  layer.msg(data.message);
				}); 
			}else{
				var examList = data.data.list;
				var pageInfo = data.data;
				$("#examList").html("");
				for (var i = 0; i < examList.length; i++) {
					$("#examList").append("<tr><td>"
					+examList[i].courseId
					+"</td><td>"
					+examList[i].startTime
					+"</td><td>"
					+examList[i].endTime
					+"</td><td>"
					+examList[i].paperId
					+"</td><td>"
					+examList[i].status
					+"</td><td><button type='button' class='layui-btn layui-btn-sm' id='"
					+examList[i].id
					+"' onclick='searchStuCount(this.id)'>查看</button><button type='button' class='layui-btn layui-btn-sm layui-btn-warm' id='"
					+examList[i].id
					+"alarm' onclick='alarmExam(this.id)'>通知考试</button><button type='button' class='layui-btn layui-btn-sm layui-btn-danger' id='"
					+examList[i].id
					+"delete' onclick='deleteExam(this.id)'>删除</button></td></tr>")
				}
			}
		});
	}else{
		sendAjax("http://localhost:8181/exam/list/exam",{"pageNum":pageNum,"courseName":courseName,"paperId":paperId,"status":status},"GET",function(data){
			if(data.code != 601){
				layui.use('layer', function(){
				  var layer = layui.layer;
				  layer.msg(data.message);
				}); 
			}else{
				var examList = data.data.list;
				var pageInfo = data.data;
				$("#examList").html("");
				for (var i = 0; i < examList.length; i++) {
					$("#examList").append("<tr><td>"
					+examList[i].courseId
					+"</td><td>"
					+examList[i].startTime
					+"</td><td>"
					+examList[i].endTime
					+"</td><td>"
					+examList[i].paperId
					+"</td><td>"
					+examList[i].status
					+"</td><td><button type='button' class='layui-btn layui-btn-sm' id='"
					+examList[i].id
					+"' onclick='searchStuCount(this.id)'>查看</button><button type='button' class='layui-btn layui-btn-sm layui-btn-warm' id='"
					+examList[i].id
					+"alarm' onclick='alarmExam(this.id)'>通知考试</button><button type='button' class='layui-btn layui-btn-sm layui-btn-danger' id='"
					+examList[i].id
					+"delete' onclick='deleteExam(this.id)'>删除</button></td></tr>")
				}
			}
		});
	}
}

function alarmExam(examId){
	sendAjax("http://localhost:8181/exam/alarmExam",{"examId":examId},"GET",function(res){
		if(res.code != 601){
			layui.use('layer', function(){
			  var layer = layui.layer;
			  layer.msg(res.message);
			}); 
		}else{
			sessionStorage.setItem("isReload","yes");
			window.location.reload();
		}
	})
}

function deleteExam(examId){
	
	layui.use('layer', function(){
	  var layer = layui.layer;
	  layer.open({
	          content:"确认删除当前考试？",
			  yes:function(index,layero){
				  sendAjax("http://localhost:8181/exam/deleteExam",{"examId":examId},"GET",function(data){
				  	if(data.code != 601){
				  		layui.use('layer', function(){
				  		  var layer = layui.layer;
				  		  layer.msg(data.message);
				  		}); 
				  	}else{
						sessionStorage.setItem("isReload","yes");
				  		window.location.reload();
				  	}
				  });
				  layer.close(index);
			  }
	        });
	})
}

function searchByExample(){
	jumpToCheck(1);
}

function resetExample(){
	$("#courseName").val("");
	$("#paperId").val("");
	$("#examTime").val("");
	$("#status").val("");
}