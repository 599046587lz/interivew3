baseURL = 'http://szq.jouta.xyz/';
clubId = 1;

$(function () {
    $(".back").click(function () {
        window.history.back();
    });

    //获取clubinfo
    $.ajax({
        url:  baseURL+"club/clubInfo",
        type: "get",
        data: {
            clubId: clubId
        },
        success: function (data, status, xhr) {
            $(".clubName").html(data.message.name);
            var $container = $(".container");
            var $department = $(".department");
            var $classroom = $(".classroom");
            $container.css('height', $container.height() + 35 * data.message.departments.length + 'px');
            for (var i in data.message.departments) {
                $department.append("<input value='" + data.message.departments[i]["name"] + "' readonly/>");
                $classroom.append("<input class='room' depart='" + data.message.departments[i]["did"] + "' value='" + data.message.departments[i]["location"] + "' />");
            }
        }
    });


    $("#submit").click(function () {
        var self = $(this);
        self.addClass('loading');
        //提交修改表单
        var dep = [];
        $("input.room").each(function () {
            var depart = $(this).attr("depart");
            var dId = Number(depart);
            var room = $(this).val();
            if (depart && room) dep.push({departmentId: dId, roomLocation: room});
        });
        $.ajax({
            url: baseURL + "club/upload/location",
            type: "post",
            data: {
                cid: clubId,
                info: dep
            },
            processData: false,
            traditional: true,
            dataType: "json",
            //contentType: 'application/json; charset=utf-8',
            statusCode: {
                200: function () {
                    alert("修改成功!");
                },
                204: function () {
                    alert("修改成功!");
                },
                205: function () {
                    alert("修改成功!");
                },
            }, complete: function () {
                self.removeClass('loading');
            }
        });

        //上传文件(有文件时上传文件)
        var excelName = $('#file').val();
        var fileTArr = excelName.split(".");
            //切割出后缀文件名
        var filetype = fileTArr[fileTArr.length - 1];
        if (filetype != null && filetype != "") {
            $(function (){
                let files= $('#file').prop('files');
                var data = new FormData();
                data.append('archive', files[0]);
                data.append('cid',clubId);

                if (filetype == "xls" || filetype == "xlsx") {
                    $.ajax({
                        url: baseURL + "club/upload/archive",
                        type: 'post',
                        data: data,
                        //async: false,
                        cache: false,
                        processData: false,
                        contentType: false,
                        success: function (data) {

                            alert("上传文件成功！已成功上传 " + data.count + " 人的信息。");
                        },
                        error: function () {
                            alert("与服务器通讯失败，请稍后再试！");
                        }
                    });
                } else {
                    alert("请上传正确的Excel文件，只能上传后缀为'xls'的Excel文件！");
                }
            });
        }
    });



    $("#file").on("click", function (event) {
        var select = $('#select');
        select.addClass('loading');
        if (confirm("上传文件会导致之前资料被清空，是否继续？")) {
            setTimeout(function(){
                select.removeClass('loading');
            },1500);
        } else {
            //取消上传文件关闭inputfile窗口
            event.preventDefault();
            setTimeout(function(){
                select.removeClass('loading');
            },100);
        }
        //confirm是同步的 confirm时不能渲染页面
    });
});
