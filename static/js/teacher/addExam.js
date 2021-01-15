$(document).ready(function(){
	tips("添加成功！");
	sendAjax("http://localhost:8181/tea/getCourse",{"pageNum":1,"pageSize":1000},"GET",function(res){
		if(res.code != 601){
			layui.use('layer',function(){
				var layer = layui.layer;
				layer.msg(res.message);
			})
		}else{
			var courseList = res.data.list;
			for (var i = 0; i < courseList.length; i++) {
				$("#courses").append("<option value='"
				+courseList[i].courseId
				+"'>"
				+courseList[i].courseName
				+"</option>");
			}
			layui.use("form",function(){
				var form = layui.form;
				form.render();
			})
		}
	})
})

layui.use("form",function(){
	var form = layui.form;
	form.on("select(courses)",function(data){
		var courseId = data.value;
		sendAjax("http://localhost:8181/exam/list/paper",{"courseId":courseId},"GET",function(res){
			if(res.code != 601){
				layui.use('layer',function(){
					var layer = layui.layer;
					layer.msg(res.message);
				})
			}else{
				var pageInfo = res.data;
				var paperList = res.data.list;
				$("#paperInfo").html("");
				for (var i = 0; i < paperList.length; i++) {
					$("#paperInfo").append("<tr><td>"
					+paperList[i].paperId
					+"</td><td>"
					+paperList[i].paperCourse
					+"</td><td>"
					+paperList[i].paperTeacher
					+"</td><td>"
					+paperList[i].paperMadeDate
					+"</td><td>"
					+paperList[i].paperLevel
					+"</td><td><button type='button' class='layui-btn layui-btn-normal layui-btn-xs' id='"
					+paperList[i].paperId
					+"' onclick='paperDetails(this.id)'>详情</button><button type='button' class='layui-btn layui-btn-xs' id='"
					+paperList[i].paperId
					+"' onclick='choicePaper(this.id)'>选择</button></td></tr>")
				}
				layui.use(["table","laypage"],function(){
					var table = layui.table;
					var laypage = layui.laypage;
					table.render();
					laypage.render({
					    elem: 'search'
					    ,count: pageInfo.total
						,limit: 5
						,limits:[5]
					    ,layout: ['count', 'prev', 'page','limit','next', 'refresh', 'skip']
					    ,jump: function(obj,first){
							if(!first){
								jumpToCheck(obj.curr,courseId);
							}
					    }
					  });
				})
			}
		})
	})
})

function choicePaper(paperId){
	$("#paperId").val(paperId);
	$("#showPaperId").text("选择的试卷编号为:"+paperId);
}

function jumpToCheck(pageNum,courseId){
	
	sendAjax("http://localhost:8181/exam/list/paper",{"courseId":courseId,"pageNum":pageNum},"GET",function(res){
		if(res.code != 601){
			layui.use('layer',function(){
				var layer = layui.layer;
				layer.msg(res.message);
			})
		}else{
			var paperList = res.data.list;
			var pageInfo = res.data;
			$("#paperInfo").html("");
			for (var i = 0; i < paperList.length; i++) {
				$("#paperInfo").append("<tr><td>"
				+paperList[i].paperId
				+"</td><td>"
				+paperList[i].paperCourse
				+"</td><td>"
				+paperList[i].paperTeacher
				+"</td><td>"
				+paperList[i].paperMadeDate
				+"</td><td>"
				+paperList[i].paperLevel
				+"</td><td><button type='button' class='layui-btn layui-btn-normal layui-btn-xs' id='"
				+paperList[i].paperId
				+"' onclick='paperDetails(this.id)'>详情</button><button type='button' class='layui-btn layui-btn-xs' id='"
				+paperList[i].paperId
				+"' onclick='choicePaper(this.id)'>选择</button></td></tr>")
			}
		}
	})
	
}

function paperDetails(paperId){
	
	sendAjax("http://localhost:8181/exam/paper/details",{"paperId":paperId},"GET",function(res){
		if(res.code != 601){
			layui.use('layer',function(){
				var layer = layui.layer;
				layer.msg(res.message);
			})
		}else{
			var choiceList = res.data.paperChoiceInfo;
			var tofList = res.data.paperTOFInfo;
			var designList = res.data.paperDesignInfo;
			var bigList = res.data.paperBigInfo;
			
			console.log(tofList);
			console.log(bigList);
			
			$("#choiceQsts").html("");
			$("#tofQsts").html("");
			$("#designQsts").html("");
			$("#bigQsts").html("");
			for (var i = 0; i < choiceList.length; i++) {
				$("#choiceQsts").append("<tr><td>"
				+choiceList[i].choiceQstInfo
				+"</td><td>"
				+choiceList[i].choiceQstOp1
				+"</td><td>"
				+choiceList[i].choiceQstOp2
				+"</td><td>"
				+choiceList[i].choiceQstOp3
				+"</td><td>"
				+choiceList[i].choiceQstOp4
				+"</td><td>"
				+choiceList[i].choiceQstAnsw
				+"</td></tr>")
			}
			for (var i = 0; i < tofList.length; i++) {
				$("#tofQsts").append("<tr><td>"
				+tofList[i].tofinfo
				+"</td><td>"
				+tofList[i].tofansw
				+"</td></tr>")
			}
			for (var i = 0; i < designList.length; i++) {
				$("#designQsts").append("<tr><td>"
				+designList[i].designInfo
				+"</td><td>"
				+designList[i].designAnsw
				+"</td></tr>")
			}
			for (var i = 0; i < bigList.length; i++) {
				$("#bigQsts").append("<tr><td>"
				+bigList[i].bigInfo
				+"</td><td>"
				+bigList[i].bigAnsw
				+"</td></tr>")
			}
			
			layui.use("layer",function(){
				layer.open({
				       type: 1,
				       title:"试卷详情",
				       shift: 2,
				       area: ['800px', '400px'],
				       shadeClose: true,
				       // btn: ['新增', '取消'],
				       // btnAlign: 'c',
				       content: $("#paperDetails")
				     });
			})
			
		}
	})
	
}

function submitExam(){
	var courseId = $("#courses").val();
	var paperId = $("#paperId").val();
	var time = $("#examTime").val();
	var times = time.split("~");
	var startTime = times[0];
	startTime = startTime.replace(/^\s+|\s+$/g,"");
	var endTime = times[1];
	endTime = endTime.replace(/^\s+|\s+$/g,"");
	var str = {"courseId":courseId,"paperId":paperId,"startTime":startTime,"endTime":endTime};
	
	sendAjax("http://localhost:8181/exam/addExam",JSON.stringify(str),"POST",function(res){
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