ttsAPI  = "http://translate.google.cn/translate_tts?ie=UTF-8&q=_WORDS_&tl=zh-CN";
baseURL = 'http://interview.redhome.cc';
ioURL   = 'http://interview.redhome.cc/';
interviewee_queue = [];
interviewee_data_queue = [];
reconnect_times = 0;
// -set club
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
				//socket.io works;
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
    });
};
// -relogin
var relogin = function(){
	window.location.href = 'login.html';
};

var reconnect = function(){
	++reconnect_times;
	socket = io.connect(ioURL);
	socket.emit('init', {cid: club.cid});
};
var refit = function(){
	$(".list_wrap").jScrollPane();
}
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

// -CLASS storage
// -param  obj - String
function storage(obj,val){
	if (!val)
		val = 0;
	if(typeof(Storage) !== "undefined") {
		if (typeof localStorage[obj] !== 'undefined') {
			this.val = localStorage[obj];
		} else {
			localStorage[obj] = val;
			this.val = localStorage[obj];
		}
	} else {
	  this.val = val;
	}
	this.name = obj;
	//return this.obj;
};
storage.prototype = {
	add: function(){
		this.val = Number(this.val) + 1;
		this.setStorage();
		return this.val;
	},
	cut: function(){
		this.val = Number(this.val) - 1;
		this.setStorage();
		return this.val;
	},		
	val: function(){
		return this.val;
	},
	set: function(val){
		this.val = val;
		this.setStorage();
		return this.val;
	},
	setStorage: function(){
		if(typeof(Storage) !== "undefined"){
			localStorage.setItem(this.name, this.val)
		}
	},
	display:function(_selector){
		$(_selector).html(this.val);
	}
};

// Interviewee Queue
var check_queue = function(){
	var message = interviewee_queue.pop();
	if (!message)
		return ;
	var data = interviewee_data_queue.pop();
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
	_target.find("._default").remove();
	if ($(".stu-" + data.sid).length){
		console.log($(".stu-" + data.sid));
		$(".stu-" + data.sid).remove();
		waiting.cut();
		waiting.display('.waiting');
		refit();
	}
	var iframe = $("iframe").eq(0);
	var src = ttsAPI.replace(/_WORDS_/ig, encodeURIComponent(message));
	iframe.attr("src", src);
	interviewed.add();
	interviewed.display('.interviewed');
	waiting_html.set($(".list").html());
};

var set_interval = function(){
	interval = setInterval(check_queue, 10000);
};

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
		if (_count > club.maxDep){
			var _result = $(this).parents("li").find("input").iCheck('uncheck');
			err('至多选择' + club.maxDep + '个部门!');
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
			//console.log(data);
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
				waitline(data);
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
		url : baseURL + '/room/selectDep/',
		type : 'post',
		data : {sid: stuID,did: did},
		dataType: 'json',
		statusCode : {
			404 : function(){
				err("学号不存在，请重试!");
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
				waitline(data);
				$('#selectDep').fadeOut();
			}
		}
	});
};
var waitline = function(data){
	console.log(data);
	var template = "<tr class=\"stu-%SID%\"> \n <td>%NUMBER%</td> \n <td>%SID%</td> \n "
								+"<td>%NAME%</td> \n <td>%DEPARTMENT%</td> \n <td>%ROOM%";
	var output = template.replace(/%NUMBER%/ig, data.sid);
	var depart = data.volunteer;
	var depart = depart[0] + ((depart.length != 1) ? "等" + depart.length + "个部门" : "");
	var did = $("[name=department][value=" + depart[0] + "]");
	var room = did.attr("data-id");
	var department = did.parents("label").text();
	output = output.replace(/%SID%/ig, data.sid);
	output = output.replace(/%NAME%/ig, data.name);
	output = output.replace(/%DEPARTMENT%/ig, department);
	output = output.replace(/%ROOM%/ig, room);
	$(".list tbody").append(output);
	$(".list ._default").remove();
	waiting.add();
	waiting.display('.waiting');
	waiting_html.set($(".list").html());
	refit();
}

$(function(){
	//set_club();
	set_interval();
	interviewed = new storage("interviewed");
	waiting     = new storage("waiting");
	waiting_html= new storage("waiting_html");
	interviewed.display('.interviewed');
	waiting.display('.waiting');
	if ( waiting_html.val != '0')
		waiting_html.display('.list');
//bind events
	//signin button function
	$("#add").click(function(){
		signin();
	})
	//select department submit button
	$("#subDep").click(function(){
		selectDepart();
	});
	socket = io.connect(ioURL);
	socket.on('call', function(data){
		console.log(data);
		var did = $("[name=department][value=" + data.did + "]");
		var room = did.attr("data-id").split("").join(" ");
		var department = did.parents("label").text();
		var message = "请 " + data.name + " 同学到 " 
								+ room + " 教室参加 " + department + " 面试" ;
		interviewee_queue.push(message);
		interviewee_data_queue.push(data);
		if ( interviewee_queue.length === 0 ){
			check_queue();
			clearInterval(interval);
			set_interval();
		};
	});
	socket.on('disconnect', function(){
		if ( reconnect_times < 4 ){
			console.log(reconnect_times);
			setTimeout(reconnect, 2000);
		}
		else
			err('网络超时,请刷新页面再试！!');
	});
});
