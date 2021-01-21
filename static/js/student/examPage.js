layui.use('element', function(){
  var element = layui.element;
});
$(document).ready(function(){
	sendAjax("http://localhost:8181/stu/examDetails",null,"GET",function(res){
		if(res.code != 601){
			layui.use('layer',function(){
				var layer = layui.layer;
				layer.msg(res.message);
			})
		}else{
			var choices = res.data.paperChoiceInfo;
			var tofs = res.data.paperTOFInfo;
			var designs = res.data.paperDesignInfo;
			var bigs = res.data.paperBigInfo;
			console.log(res);
			res = JSON.stringify(res);
			sessionStorage.setItem("res",res);
			for (var i = 0; i < choices.length; i++) {
				$("#choiceQsts").append("<div class='layui-form-item'>"
				+(i+1)+"."+choices[i].choiceQstInfo
				+"<hr class='layui-bg-cyan'>"
				+"A."+choices[i].choiceQstOp1+"<br />"
				+"B."+choices[i].choiceQstOp2+"<br />"
				+"C."+choices[i].choiceQstOp3+"<br />"
				+"D."+choices[i].choiceQstOp4+"<br />"
				+"<div class='layui-input-block' id='"
				+choices[i].choiceQstQuestion
				+"'><input type='radio' name='"
				+choices[i].choiceQstQuestion
				+"' title='A' value='A'/><input type='radio' name='"
				+choices[i].choiceQstQuestion
				+"' title='B' value='B'/><input type='radio' name='"
				+choices[i].choiceQstQuestion
				+"' title='C' value='C'/><input type='radio' name='"
				+choices[i].choiceQstQuestion
				+"' title='D' value='D'/></div></div><hr class='layui-bg-cyan' />")
			}
			for (var i = 0; i < tofs.length; i++) {
				$("#tofQsts").append("<div class='layui-form-item'>"
				+(i+1)+"."+tofs[i].tofinfo
				+"<hr class='layui-bg-cyan'><div class='layui-input-block' id='"
				+tofs[i].tofquestion
				+"'><input type='radio' title='正确' value='T' name='"
				+tofs[i].tofquestion
				+"'/><input type='radio' title='错误' value='F' name='"
				+tofs[i].tofquestion
				+"'/></div></div><hr class='layui-bg-cyan' />")
			}
			for (var i = 0; i < designs.length; i++) {
				$("#designQsts").append("<div class='layui-form-item'>"
				+(i+1)+"."+designs[i].designInfo
				+"<hr class='layui-bg-cyan'><div class='layui-input-block'><textarea class='layui-textarea' id='"
				+designs[i].designQuestion
				+"'></textarea></div></div><hr class='layui-bg-cyan' />")
			}
			for (var i = 0; i < bigs.length; i++) {
				$("#bigQsts").append("<div class='layui-form-item'>"
				+(i+1)+"."+bigs[i].bigInfo
				+"<hr class='layui-bg-cyan'><div class='layui-input-block'><textarea class='layui-textarea' id='"
				+bigs[i].bigQuestion
				+"'></textarea></div></div><hr class='layui-bg-cyan' />")
			}
			layui.form.render();
		}
	})
	sendAjax("http://localhost:8181/exam/examTime",null,"GET",function(res){
		if(res.code != 601){
			layui.use('layer',function(){
				var layer = layui.layer;
				layer.msg(res.message);
			})
		}else{
			sessionStorage.setItem("endTime",res.data);
		}
	})
})

function tow(n) {
 
    return n >= 0 && n < 10 ? '0' + n : '' + n;
 
  }

function getDate() {
	
	var endTime = sessionStorage.getItem("endTime");
	
	var oSpan = $("#overTime");
 
    var oDate = new Date();//获取日期对象
 
    var oldTime = oDate.getTime();//现在距离1970年的毫秒数
 
    var newDate = new Date(endTime);
 
    var newTime = newDate.getTime();//2019年距离1970年的毫秒数
 
    var second = Math.floor((newTime - oldTime) / 1000);//未来时间距离现在的秒数
 
    var day = Math.floor(second / 86400);//整数部分代表的是天；一天有24*60*60=86400秒 ；
 
    second = second % 86400;//余数代表剩下的秒数；
 
    var hour = Math.floor(second / 3600);//整数部分代表小时；
 
    second %= 3600; //余数代表 剩下的秒数；
 
    var minute = Math.floor(second / 60);
 
    second %= 60;
 
    var str = tow(hour) + '<span class="time">小时</span>'
 
        + tow(minute) + '<span class="time">分钟</span>'
 
        + tow(second) + '<span class="time">秒</span>';
 
    oSpan.html(str);
  }
  
  getDate();
  
  setInterval(getDate,1000);
  
  function submit(){
	  var res = JSON.parse(sessionStorage.getItem("res"));
	  console.log(res);
	  var choices = res.data.paperChoiceInfo;
	  var tofs = res.data.paperTOFInfo;
	  var designs = res.data.paperDesignInfo;
	  var bigs = res.data.paperBigInfo;
	  
	  var map = new Map();
	  
	  var err = "";
	  for (var i = 0; i < choices.length; i++) {
		  var val = $("#choiceQsts input[name="+choices[i].choiceQstQuestion+"]:checked").val();
		  if(val == null){
			  err += (i+1)+",";
		  }else{
			  map.set(choices[i].choiceQstQuestion,val);
		  }
	  }
	  
	  for (var i = 0; i < tofs.length; i++) {
		  var val = $("#tofQsts input[name="+tofs[i].tofquestion+"]:checked").val();
		  if(val == null){
			err += (i+1)+",";
		  }else{
			  map.set(tofs[i].tofquestion,val);
		  }
	  }
	  
	  for (var i = 0; i < designs.length; i++) {
		  var val = $("#"+designs[i].designQuestion).val();
		  if(val.trim() == null){
			  err += (i+1)+",";
		  }else{
			  map.set(designs[i].designQuestion,val);
		  }
	  }
	  
	  for (var i = 0; i < bigs.length; i++) {
		  var val = $("#"+bigs[i].bigQuestion).val();
		  if(val.trim() == null){
		  	err += (i+1)+",";
		  }else{
		  	map.set(bigs[i].bigQuestion,val);
		  }
	  }
	  if(err !== ""){
		  layui.use('layer',function(){
		  	var layer = layui.layer;
		  	layer.msg("第"+err+"题未做");
		  })
	  }else{
		  
		  layui.use('layer', function(){
		    var layer = layui.layer;
		    layer.open({
		            content:"确认提交？",
		  		  yes:function(index,layero){
		  			  let obj = Object.create(null);
		  			  for(let[k,v] of map){
		  			  			  obj[k] = v;
		  			  }
		  			  sendAjax("http://localhost:8181/exam/submit",JSON.stringify(obj),"POST",function(res){
		  			  	if(res.code != 601){
							layui.use('layer',function(){
		  			  		var layer = layui.layer;
		  			  		layer.msg(res.message);
							})
		  			  	}else{
		  			  		window.location.href = "/exam/html/student/examList.html";		  
		  			  	}
		  			  })
		  		  }
		        });
		  })
		  
		  
	  }
  }