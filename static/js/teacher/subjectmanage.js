$(document).ready(function(){
	
	tips("删除成功");
	var pageInfo;
	var token = sessionStorage.getItem("token");
	sendAjax("http://localhost:8181/tea/getCourse",null,"GET",function(data){
		if(data.code != 601){
			layui.use('layer', function(){
			  var layer = layui.layer;
			  layer.msg(data.message);
			}); 
		}else{
			var specialtyInfo = data.data.list;
			pageInfo = data.data;
			for(var i = 0;i < specialtyInfo.length;i++){
				$("#specialty").append("<tr><td>"
				+specialtyInfo[i].courseId
				+"</td>"
				+"<td>"
				+specialtyInfo[i].courseName
				+"</td>"
				+"<td>"
				+"<button type='button' class='layui-btn layui-btn-sm' id='"
				+specialtyInfo[i].courseId
				+"' onclick=stuDetail(this.id)>查看</button><button type='button' class='layui-btn layui-btn-sm layui-btn-warm' id='"
				+specialtyInfo[i].courseId
				+"' onclick='clearAll(this.id)'>清空</button><button type='button' data-method='confirmTrans' class='layui-btn layui-btn-sm layui-btn-danger' id='"
				+specialtyInfo[i].courseId
				+"' onclick = alertMsg(this.id)>删除</button></td></tr>");
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
	});
	
	
	
})


function jumpToCheck(pageNum){
	var token = sessionStorage.getItem("token");
	sendAjax("http://localhost:8181/tea/getCourse",{"pageNum":pageNum},"GET",function(data){
		if(data.code != 601){
			layui.use('layer', function(){
			  var layer = layui.layer;
			  layer.msg(data.message);
			}); 
		}else{
			var specialtyInfo = data.data.list;
			var pageInfo = data.data;
			$("#specialty").html("");
			for(var i = 0;i < specialtyInfo.length;i++){
				$("#specialty").append("<tr><td>"
				+specialtyInfo[i].courseId
				+"</td>"
				+"<td>"
				+specialtyInfo[i].courseName
				+"</td>"
				+"<td>"
				+"<button type='button' class='layui-btn layui-btn-sm' id='"
				+specialtyInfo[i].courseId
				+"' onclick=stuDetail(this.id)>查看</button><button type='button' data-method='confirmTrans' class='layui-btn layui-btn-sm layui-btn-danger' id='"
				+specialtyInfo[i].courseId
				+"' onclick = alertMsg(this.id)>删除</button></td></tr>");
			}
		}
	});
}

function clearAll(courseId){
	layui.use('layer', function(){
	  var layer = layui.layer;
	  layer.open({
	          content:"确认清空当前课程学生？",
			  yes:function(index,layero){
				  sendAjax("http://localhost:8181/tea/clearAll",{"courseId":courseId},"GET",function(data){
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

function alertMsg(courseId){
	layui.use('layer', function(){
	  var layer = layui.layer;
	  layer.open({
	          content:"确认删除当前课程？",
			  yes:function(index,layero){
				  sendAjax("http://localhost:8181/tea/delete/course",{"courseId":courseId},"GET",function(data){
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

function stuDetail(courseId){
	sendAjax("http://localhost:8181/tea/searchStu",{"courseId":courseId},"GET",function(res){
		if(res.code != 601){
			layui.use('layer', function(){
			  var layer = layui.layer;
			  $("#stu").html("");
			  layer.msg(res.message);
			}); 
		}else{
			var stuInfos = res.data;
			$("#stu").html("");
			for (var i = 0; i < stuInfos.length; i++) {
				$("#stu").append("<tr><td>"
				+stuInfos[i].username
				+"</td><td>"
				+stuInfos[i].phone
				+"</td><td><button type='button' class='layui-btn layui-btn-sm layui-btn-danger' id = '"
				+stuInfos[i].id
				+"' onclick='alertMsg1(this.id,"
				+courseId
				+")'>删除</button></td></tr>"
				)
			}
		}
	});
	layui.use('layer', function(){
	  var layer = layui.layer;
	  layer.open({
		  type: 1,
		  title: "学生详情",
		  fixed: true,
		  resize: false,
		  shadeClose: true,
		  area:["400px","200px"],
		  content: $("#stuList"),
		  cancel: function(){
			  layer.closeAll();
		  }
	  })
	});  
}

function alertMsg1(id,courseId){
	layui.use('layer', function(){
	  var layer = layui.layer;
	  layer.open({
	          content:"确认删除当前学生？",
			  yes:function(index,layero){
				  sendAjax("http://localhost:8181/tea/deleteStu",{"stuId":id,"courseId":courseId},"GET",function(data){
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
