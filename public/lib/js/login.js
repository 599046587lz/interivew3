//baseURL = 'http://interview.redhome.cc/';
baseURL = 'http://www.dou.com/club/';

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
$(function(){
$(".button").click(function(){
	var account  = $("[name=account]").val();
	var password = $("[name=password]").val();
	
	$.ajax({
		url  : baseURL + "login",
		type : 'post',
		data : {user: account, password: password},
		dataType : 'json',
		beforeSend : function(){
			$(".button").val("登录中...");
		},
		success : function(data){
/*			if (data.status == 'failed'){
				err('登陆失败');
				$("[name=account]").focus().val('');
				$("[name=password]").val('');
				setTimeout($(".button").val("登录"),2000)
			}
			} else {
				window.location.href = '/Select';
			};*/
		},
		statusCode : {
			404 : function(){
				err("Page not found!");
				setTimeout(function(){
					$(".button").val("登录")
				}, 2000);	
			},
			403 : function(){
				err("帐号或密码错误！");
				$("[name=account]").focus();
				setTimeout(function(){
					$(".button").val("登录")
				}, 2000);		
			},
			204 : function(){
				success('登陆成功!');
				window.location.href = "select.html";
			},
			500 : function(){
				err('服务器错误,请重试!');
			}
		}
	});

});
});
