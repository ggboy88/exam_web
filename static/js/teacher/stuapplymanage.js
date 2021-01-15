$(document).ready(function(){
	
	tips("操作成功");
	
	sendAjax("http://localhost:8181/tea/selectStuApply",null,"GET",function(res){
		if(res.code != 601){
			layui.use('layer',function(){
				var layer = layui.layer;
				layer.msg(res.message);
			})
		}else{
			var applyList = res.data.list;
			var pageInfo = res.data;
			
			for (var i = 0; i < applyList.length; i++) {
				$("#stuApply").append("<tr><td>"
				+applyList[i].courseName
				+"</td><td>"
				+applyList[i].stuName
				+"</td><td>"
				+applyList[i].stuPhone
				+"</td><td><button type='button' class='layui-btn layui-btn-sm' id='"
				+applyList[i].accessId
				+"' onclick='agree(this.id)'>同意</button><button type='button' class='layui-btn layui-btn-danger layui-btn-sm' id='"
				+applyList[i].accessId
				+"' onclick='disagree(this.id)'>拒绝</button></td></tr>")
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
	
	sendAjax("http://localhost:8181/tea/selectStuApply",{"pageNum":pageNum},"GET",function(res){
		if(res.code != 601){
			layui.use('layer',function(){
				var layer = layui.layer;
				layer.msg(res.message);
			})
		}else{
			var applyList = res.data.list;
			var pageInfo = res.data;
			$("#stuApply").html("");
			for(var i = 0;i < applyList.length;i++){
				$("#stuApply").append("<tr><td>"
				+applyList[i].courseName
				+"</td><td>"
				+applyList[i].stuName
				+"</td><td>"
				+applyList[i].stuPhone
				+"</td><td><input type='checkbox' lay-skin='primary' value='"
				+applyList[i].accessId
				+"'/></td></tr>");
			}
		}
	})
	
}

function agree(accessId){
	sendAjax("http://localhost:8181/tea/accessStuApply",{"access":true,"accessId":accessId},"GET",function(res){
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

function disagree(accessId){
	sendAjax("http://localhost:8181/tea/accessStuApply",{"access":false,"accessId":accessId},"GET",function(res){
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