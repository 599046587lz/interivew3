baseURL = 'http://www.dou.com';

var set_club = function(){
	club = {};
	$.ajax({
		url : baseURL + '/club/profile',
		type : 'get',
		statusCode : {
			404 : function(){
				err("Page not found!");
			},
			403 : function(){
				err("未登录或登录超时!");
				//relogin();	
			},
			200 : function(data){
				club = data;
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
	var interviewer = $("[name=interviewer]").val();
	if ( interviewer == ""){
		err("请输入姓名");
		return false;
	}
	$.ajax({
		url  : baseURL + "/club/setIdentify",
		type : 'post',
		data : {did: did, interviewerName: interviewer},
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
					window.location.href = "interview.html#" + name;
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
	$(".interview a").click(function(){
		$(".selection").animate({opacity:1,height:'44px'}, 500);
	});
	$("._interview").click(function(){
		setInterviewer();
	});
});