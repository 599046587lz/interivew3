baseURL = '/';

$(function(){
	var setClub = function(){
		$.ajax({
			url : baseURL + 'club/clubInfo',
			type : 'get',
			statusCode : {
				200 : function(data){
					console.log(data);
				},
				403 : function(){
					relogin();
				},
				404 : function(){
					snackbar.err("Page not found!");
				},
				500 : function(){
					snackbar.err('服务器错误,请刷新页面再试!');
				}
			}
		});
	};

	setClub();
});
