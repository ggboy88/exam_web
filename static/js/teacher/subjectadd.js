$(document).ready(function(){
	
	tips("添加成功");
	
	sendAjax("http://localhost:8181/course/selectCourse",null,"GET",function(res){
		if(res.code != 601){
			layui.use('layer',function(){
				var layer = layui.layer;
				layer.msg(res.message);
			})
		}else{
			var specialtyInfo = res.data.list;
			var pageInfo = res.data;
			for(var i = 0;i < specialtyInfo.length;i++){
				$("#specialty").append("<tr><td>"
				+specialtyInfo[i].courseId
				+"</td>"
				+"<td>"
				+specialtyInfo[i].courseName
				+"</td>"
				+"<td>"
				+"<input type='checkbox' lay-skin='primary' name='courseId' value='"
				+specialtyInfo[i].courseId
				+"'/></td></tr>");
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
	
	sendAjax("http://localhost:8181/course/selectCourse",{"pageNum":pageNum},"GET",function(res){
		if(res.code != 601){
			layui.use('layer',function(){
				var layer = layui.layer;
				layer.msg(res.message);
			})
		}else{
			var specialtyInfo = res.data.list;
			var pageInfo = res.data;
			$("#specialty").html("");
			for(var i = 0;i < specialtyInfo.length;i++){
				$("#specialty").append("<tr><td>"
				+specialtyInfo[i].courseId
				+"</td>"
				+"<td>"
				+specialtyInfo[i].courseName
				+"</td>"
				+"<td>"
				+"<input type='checkbox' lay-skin='primary' name='courseId' value='"
				+specialtyInfo[i].courseId
				+"'/></td></tr>");
			}
		}
	})
	
}

function addSpecialty(){
	
	var courseId = $('input:checkbox:checked');
	var courseIds = [];
	for(var i = 0;i < courseId.length;i++){
		courseIds.push(courseId[i].value);
	}
	
	layui.use('layer', function(){
	  var layer = layui.layer;
	  layer.open({
	          content:"确认添加当前选中课程？",
			  yes:function(index,layero){
				  sendAjax("http://localhost:8181/tea/addCourse",JSON.stringify(courseIds),"POST",function(data){
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