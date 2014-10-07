jQuery(document).ready(function(){
	$(".each").fadeIn(1000);
	$("#add").click(function (){
		$("#depbody").append("<div class=\"each\"><input class=\"dep\" /><input class=\"room\" /><span class=\"del\">x</span></div>");
		$(".each:last").slideDown();
	});
	$("#depbody").on('click' , ".del", function(){
		$(this).parent().slideUp(300,function (){$(this).remove();});
	});
	$.ajax({url:"/club/profile",type:"get",success: function (data, status, xhr){
		$("#logo").attr("src",data.logo);
		$("[name=name]").val(data.name);
        var dep = $("#depbody");
        for (var i in data.departments) {
            dep.append("<div class=\"each\"><input class=\"dep\" value=\"" +data.departments[i]["name"] + "\" /><input class=\"room\" value=\"" +data.departments[i]["location"] + "\" /><span class=\"del\">x</span></div>").show();

        }
	}});
	$("[name=logo]").on("change",function () {
		$("#logo").attr("src",$(this).val());
	});

		$("#submit").click(function () {
			//提交修改表单
			var data = {};
			var tmp;
			var logo = $("[name=logo]").val();
			tmp = $("[name=name]").val();
			if('' != tmp) {
				data.name = tmp;
			}
			var dep = [];
			$(".each").each(function () {
				var name,location;
				if(""!=(name=$(this).find(".dep").val()) && ""!=(location=$(this).find(".room").val()))
					dep.push({name: name,location: location});
			});
			data.departments = dep;
			$.ajax({url:"/club/profile",type:"post",data: data,dataType: "json",statusCode:{204: function (data, status, xhr){
				alert("修改成功");
			}}});
		});
			//提交excel
	$("#select").on("click",function () {
		if(confirm("上传文件会导致之前资料被清空，是否继续？")) {
			$.upload({
				url: "/club/upload/archive",
				fileName: "archive",
				params: {},
				dataType: "json",
				onSend: function () {
					$("#loading").show();
					return true;
				},
				onComplate: function (data) {
					$("#loading").hide();
					if("success" == data.status) {
						alert("上传成功");
					} else if(404 == data.code) {
						alert("文件内容不正确");
					} else {
						alert("上传失败");
					}
				}
			});
		}
	});
});
