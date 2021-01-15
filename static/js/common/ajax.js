function sendAjax(sendUrl,sendData,sendType,Func){
	var token = sessionStorage.getItem("token");
	if(token === null){
		window.location.href = "/exam/html/login.html";
	}else{
		if(sendData === null){
			$.ajax({
				url:sendUrl,
				type:sendType,
				contentType:"application/json",
				xhrFields:{
					withCredentials: true,
				},
				beforeSend:function(XMLHttpRequest){
					XMLHttpRequest.setRequestHeader("token",token);
				},
				crossDomain: true,
				dataType:'json',
				success:Func
			});
		}else{
			$.ajax({
				url:sendUrl,
				type:sendType,
				xhrFields:{
					withCredentials: true,
				},
				contentType:"application/json",
				data:sendData,
				beforeSend:function(XMLHttpRequest){
					XMLHttpRequest.setRequestHeader("token",token);
				},
				crossDomain: true,
				dataType:'json',
				success:Func
			});
		}
		
	}
	
}
