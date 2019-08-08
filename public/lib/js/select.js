baseURL = '';

var set_club = function(){
	club = {};
	$.ajax({
		url : baseURL + '/club/clubInfo',
		type : 'get',
		statusCode : {
			404 : function(){
				err("Page not found!");
			},
			403 : function(){
				err("未登录或登录超时!");
				relogin();	
			},
			200 : function(data){
				console.log(data);
				club = data.message;
				set_department();
			},
			500 : function(){
				err('服务器错误,请刷新页面再试!');
			}
		}
	});
};

var err = function(text){
    notif({
        msg:text,
        position:'center',
        type:'error'
    });
};
// -success
var success = function(text){
    notif({
        msg:text,
        position:'center',
        type:'success'
    })
};

var set_department = function (){
	var output      = ""; 
	var template    = "<option value='DID'>NAME</option>\n";
	var dep = club.departments;
	for( var i in dep){
		if (dep[i]){
			var out = template;
			out = out.replace(/DID/g, dep[i].did);
			out = out.replace(/NAME/g, dep[i].name);
			output += out;
		}
	}
	$("#_select").html(output);
};

var relogin = function (){
	setTimeout(function(){
		window.location.href = "login.html";
	}, 500);
}

var setInterviewer = function(){
	var did = $("#_select").val();
	var interviewer = $("input[name=interviewer]").val();
	if ( !interviewer ){
		err("请输入姓名");
		return false;
	}
	$.ajax({
		url  : baseURL + "/club/setIdentify",
		type : 'post',
		contentType: 'application/json',
		data : JSON.stringify({did: did, interviewerName: interviewer}),
		dataType : 'json',
		statusCode : {
			404 : function(){
				err("Page not found!");
			},
			403 : function(){
				err("未登录或登录超时!");
				relogin();	
			},
			204 : function(){
				success('设置成功,即将跳转!');
				setTimeout(function(){
					var _did = $("#_select").val();
					var name = $("#_select [value=" + _did + "]").text();
					window.location.href = "interview.html#" + encodeURIComponent(name) + '-' + encodeURIComponent(interviewer);
				}, 500);				
			},
			500 : function(){
				err('服务器错误,请重试!');
			}
		}
	});
};

$(function(){
	set_club();
	$(".interview").click(function(){
		$('.dimmer').fadeIn();
	});
	$(".dimmer").click(function () {
		$(this).fadeOut();
	});
	$(".dimmer .card").click(function (e) {
		e.stopPropagation();
	});
	$(".close").click(function () {
		$(".dimmer").fadeOut();
	});
	$("#interviewer").bind("keydown",function (event) {
		if(event.keyCode == "13"){
			$("._interview").click()
		}
	})
	$("._interview").click(function(){
		setInterviewer();
	});
});
