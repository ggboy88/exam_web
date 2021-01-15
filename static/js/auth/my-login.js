$(function() {
	$("input[type='password'][data-eye]").each(function(i) {
		let $this = $(this);

		$this.wrap($("<div/>", {
			style: 'position:relative'
		}));
		$this.css({
			paddingRight: 60
		});
		$this.after($("<div/>", {
			html: 'Show',
			class: 'btn btn-primary btn-sm',
			id: 'passeye-toggle-'+i,
			style: 'position:absolute;right:10px;top:50%;transform:translate(0,-50%);padding: 2px 7px;font-size:12px;cursor:pointer;'
		}));
		$this.after($("<input/>", {
			type: 'hidden',
			id: 'passeye-' + i
		}));
		$this.on("keyup paste", function() {
			$("#passeye-"+i).val($(this).val());
		});
		$("#passeye-toggle-"+i).on("click", function() {
			if($this.hasClass("show")) {
				$this.attr('type', 'password');
				$this.removeClass("show");
				$(this).removeClass("btn-outline-primary");
			}else{
				$this.attr('type', 'text');
				$this.val($("#passeye-"+i).val());				
				$this.addClass("show");
				$(this).addClass("btn-outline-primary");
			}
		});
	});
});


function doLogin1(){
	var value = $("#submit").attr("value");
	var username = $("#username").val();
	var pwd = $("#password").val();
	var code = $("#code").val();
	if(value == "teacher"){
		$.post("http://localhost:8181/auth/tea/login",
			{"username":username,"password":pwd,"code":code},
			function(data){
				console.log(data);
				if(data.code != 601){
					$("#errmsg").text(data.message);
				}else{
					sessionStorage.setItem("token",data.data.token);
					location.href = "/exam/html/teacher/teaIndex.html";
				}
			})
	}else{
		pwd=hex_md5(pwd);
		$("#password").val(pwd);
		$.post("http://localhost:8181/auth/stu/login",
			{"phone":username,"password":pwd,"code":code},
			function(data){
				console.log(data);
				if(data.code != 601){
					$("#errmsg").text(data.message);
				}else{
					sessionStorage.setItem("token",data.data.token);
					window.location.href = "/exam/html/student/stuIndex.html";
				}
		})
	}
}

function changeOne(){
	$("#submit").val($("#change1").attr("value"));
}

function changeTwo(){
	$("#submit").val($("#change2").attr("value"));
}
