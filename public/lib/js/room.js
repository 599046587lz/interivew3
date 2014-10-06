ttsAPI = "http://translate.google.cn/translate_tts?ie=UTF-8&q=_WORDS_&tl=zh-CN";
baseURL = 'http://interview.redhome.cc';
interviewee_queue = [];

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
				relogin();	
			},
			200 : function(data){
				club = data;
				set_department();
				socket.emit('init',{cid: club.cid});
			},
			500 : function(){
				err('服务器错误,请刷新页面再试!');
			}
		}
	});
};
// -err
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
var relogin = function(){
	window.location.href = 'login.html';
};
// ajax helper
var ajaxHandler = function(func){
	return function(data, status, xhr){
		console.log(xhr.status);
		console.log(xhr);
		switch (xhr.status){
			case 404:err('File not found!');break;
			case 500:err('服务器错误');break;
			case 403:relogin();break;
			case 200:
				if(data.status && data.status == 'failed'){
					err('网络出错,请稍候重试');
				}else{
					func(data);
				}
				break;
		};
	};
};

function storage(obj){
	if(typeof(Storage) !== "undefined") {
		if (!localStorage[obj]) {
			localStorage[obj] = 0;
			this.obj = localStorage[obj];
		}
	} else {
	  this.obj = 0;
	}
	return this.obj;
}
storage.prototype = {
	init: function(){

	},
	add: function(){
		this.obj = Number(this.obj) + 1
		return this.obj;
	},
	cut: function(){
		this.obj = Number(this.obj) - 1
		return this.obj;
	},		
	val: function(){
		return this.obj;
	},
	set: function(val){
		this.obj = val;
		return this.obj;
	}
}

// Interviewee Queue
var check_queue = function(){
	var message = interviewee_queue.pop();
	if (!message)
		return ;
	_message = message.replace(/\s/ig,'');
	var html = "<li style=\"style:none;\"><span class=\"ring\"></span>" + _message + "</li>"
	var _target = $(".oncalling");
	var message = message.replace(/(室|试)/g, "是");
	var len = _target.find("li").length;
	if (len < 3){
		_target.prepend(html);	
	} else {
		_target.find("li:last").remove();
		_target.prepend(html).fadeIn(100);
	}
	var iframe = $("iframe").eq(0);
	var src = ttsAPI.replace(/_WORDS_/ig, encodeURIComponent(message));
	iframe.attr("src", src);	
}

var set_interval = function(){
	setInterval(check_queue, 10000);
}

//init Departments
var set_department = function(){
	var output      = ""; 
	var template    = "<li>\n<label><input type=\"checkbox\" name=\"department\" data-id=\"ROOM\" value=\"DID\">NAME</label></li>";
	var dep = club.departments;
	for( var i in dep){
		if (dep[i]){
			var out = template;
			out = out.replace(/DID/g, dep[i].did);
			out = out.replace(/NAME/g, dep[i].name);
			out = out.replace(/ROOM/g, dep[i].location)
			output += out;
		}
	}
	$("#departments").html(output);
  var selectDep = $('#selectDep');
  selectDep.find('input').iCheck({checkboxClass: 'icheckbox_square-blue',
      radioClass: 'iradio_square-blue'});
	selectDep.find('label,ins').on('click', function(){
		var _count = $("[name=department]:checked").length;
		if (_count > 3){
			var _result = $(this).parents("li").find("input").iCheck('uncheck');
		}
	});
}
// -signin
var signin = function(){
	var stuID = $("#sign").val();
	if(stuID == ""){
		err("请输入学号");
		$("#sign").focus();
		return false;
	}
	$.ajax({
		url : baseURL + '/room/sign/',
		type : 'get',
		data : {sid: stuID},
		dataType : 'json',
		beforeSend : function() {

		},
		success : function(data){
			console.log(data);
		},
		statusCode : {
			404 : function(){
				err("Page not found!");
			},
			403 : function(){
				err("未登录或登录超时!");
				relogin();	
			},
			205 : function(){
				selectDepDiv();
			},
			500 : function(){
				err('服务器错误,请重试!');
			},
			200 : function(data){
				success("签到成功!");
				console.log(data);
				//waitline(data.person);
			}
		}

	});
};
// -select departments div fadein
var selectDepDiv = function(){
	var selectDep = $('#selectDep');
	selectDep.find('input').iCheck('uncheck');
	selectDep.fadeIn();
};
var selectDepart = function(){
	var did = [];
	var stuID = $("#sign").val();
	var department = $("[name=department]:checked");
	if (!department.length){
		err("请至少勾选一个部门！");
		return false;
	};
	department.each(function(){
		did.push($(this).val());
	});
	$.ajax({
		url : baseURL + '/room/selectDep',
		type : 'post',
		data : {sid: stuID,did: did},
		statusCode : {
			404 : function(){
				err("Page not found!");
			},
			403 : function(){
				err("未登录或登录超时!");
				relogin();	
			},
			500 : function(){
				err('服务器错误,请重试!');
			},
			200 : function(data){
				success("签到成功!");
				//waitline(data.person);
			}
		}
	});
};
var waitline = function(person){
	var template = "<tr data-id=\"%SID%\"> \n <td>%NUMBER%</td> \n <td>%SID%</td> \n "
								+"<td>%NAME%</td> \n <td>%DEPARTMENT%</td> \n <td>%ROOM%";
	var output = template.replace(/%NUMBER%/ig, person.rate.sid);
	var depart = person.volunteer;
	var depart = depart[0] + ((depart.length != 1) ? "等" + depart.length + "个部门" : "");
	output = output.replace(/%SID%/ig, person.rate.sid);
	output = output.replace(/%NAME%/ig, person.rate.sid);
	output = output.replace(/%DEPARTMENT%/ig, '');
	output = output.replace(/%ROOM%/ig, person.room);
	$(".list tbody").append(output);
}

$(function(){
	set_club();
	set_interval();
	check_queue();
//bind events
	//signin button function
	$("#add").click(function(){
		signin();
	})
	//select department submit button
	$("#subDep").click(function(){
		selectDepart();
	});
	socket = io.connect('http://192.168.120.67:3000/');

	socket.on('call', function(data){
		console.log(data);
		var did = $("[name=department][value=" + data.did + "]");
		var room = did.attr("data-id").split("").join(" ");
		var department = did.parents("label").text();
		var message = "请 " + data.name + " 同学到 " 
								+ room + " 教室参加 " + department + " 面试" ;
		interviewee_queue.push(message);
	});

});
