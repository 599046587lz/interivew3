$(function () {
    $(".back").click(function () {
        window.history.back();
    });

    //get club info
    $.ajax({
        url: "/club/profile", type: "get", success: function (data, status, xhr) {
            $(".clubName").html(data.name);
            var $container = $(".container");
            var $department = $(".department");
            var $classroom = $(".classroom");
            $container.css('height', $container.height() + 35 * data.departments.length + 'px');
            for (var i in data.departments) {
                $department.append("<input value='" + data.departments[i]["name"] + "' readonly/>");
                $classroom.append("<input class='room' depart='" + data.departments[i]["name"] + "' value='" + data.departments[i]["location"] + "' />");
            }
        }
    });

    $("#submit").click(function () {
        var self = $(this);
        self.addClass('loading');
        //提交修改表单
        var data = {};
        var dep = [];
        $("input.room").each(function () {
            var depart = $(this).attr("depart");
            var room = $(this).val();
            if (depart && room) dep.push({name: depart, location: room});
        });
        data.departments = dep;
        $.ajax({
            url: "/club/profile", type: "post", data: data, dataType: "json", statusCode: {
                200: function () {
                    alert("修改成功");
                },
                204: function () {
                    alert("修改成功");
                },
                205: function () {
                    alert("修改成功")
                }
            }, complete: function () {
                self.removeClass("loading")
            }
        });
    });
    //提交excel
    $("#select").on("click", function () {
        var self = $(this);
        if (confirm("上传文件会导致之前资料被清空，是否继续？")) {
            $.upload({
                url: "/club/upload/archive",
                fileName: "archive",
                params: {},
                dataType: "json",
                onSendStart: function () {
                    self.addClass("loading");
                },
                onComplate: function (data) {
                    self.removeClass("loading");
                    if ("success" == data.status) {
                        alert("上传成功");
                    } else if (404 == data.code) {
                        alert("文件内容不正确");
                    } else {
                        alert("上传失败");
                    }
                }
            });
        }
    });
});
