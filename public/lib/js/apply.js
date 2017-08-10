/**
 * Created by Shinelon on 2017/8/8.
 */

$(function () {

    var warning = function (str) {
        var $warning = '<warning>' + str +
            '<div class="check">我知道了</div>' +
            '</warning>';
        $container.append($warning);
        $container.on('click', '.check', function () {
            var $warn = $(this).parent();
            $warn.fadeOut(function () {
                $warn.remove();
            })
        })
    }
    var getSearchObject = function () {
        var array = location.search.substring(1).split(/[\&\=]/);
        var obj = {};
        for (var i = 0; i < array.length / 2; i++) {
            obj[array[i * 2]] = array[i * 2 + 1];
        }
        return obj;
    }

    var getObjectURL = function (file) {
        var url = null;
        if (window.createObjectURL) { // basic
            url = window.createObjectURL(file);
        } else if (window.URL) { // mozilla(firefox)
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    }

    var clubID = getSearchObject().clubId;
    getDepartInfo(clubID);

    var $container = $(".container"),
        $submit = $("#submit"),
        $data = $("#upload_data"),
        $pic = $(".pic"),
        $picfile = $("#picfile"),
        $female = $(".genderbox.female"),
        $male = $(".genderbox.male"),
        $check = $("#check"),
        $content = $(".alarm-content"),
        $list = $(".depart_list");

    var list1 = "<list1 did='__did__'>__depart__</list1>",
        list2 = "<list2 cid='__cid__'>__column__</list2>",
        pop = $("#pop").html();

    function getDepartInfo(clubID) {
        $.ajax({
            url: "/club/clubInfo?clubId=" + clubID,
            success: function (data) {
                loadList(data);
                localStorage.setItem("club",data.clubName);
            },
            error: function () {
                $container.html("");
                warning("找不到服务器")
            }
        })
    }

    function loadList(data) {
        //动态注入部门标签
        for (var i in data.department) {
            var list = data.department[i];
            var temp = list1.replace("__depart__", list.name).replace("__did__", i);
            $list.append(temp);
            //如果存在二级标签则建立弹窗
            if (list.column[0]) {
                var poplist = '';
                for (var j in list.column) {
                    poplist = poplist + list2.replace("__column__", list.column[j]).replace("__cid__", j - (-1));
                }
                var insert = pop.replace("__depart__", list.name).replace("__did__", i).replace("__list__", poplist);
                $container.append(insert);
            }
        }
    }

    var depart = 0;
    //点击一级标签
    $list.on('click', 'list1', function () {
        var did = $(this).attr('did');
        var $popup = $(".popup[did=" + did + "]");
        var exist = $popup.html();
        //如果存在对应的二级标签
        if (exist) {
            if ($popup.hasClass("hide")) {
                $(".popup").addClass("hide");
                $popup.removeClass("hide");
            } else {
                $popup.addClass("hide");
            }
        }
        //不存在二级标签
        else {
            console.log(2);
            var active = $(this).hasClass("active");
            if (active) {
                $(this).removeClass("active");
                depart--;
            } else {
                if (depart < 3) {
                    $(this).addClass("active");
                    depart++;
                }
                else {
                    warning("最多选择三个部门呦~")
                }
            }
        }
    });

    $container.on("click", ".close", function () {
        var did = $(this).parent().attr('did');
        $("list1[did=" + did + "]").click();
    });

    ///click
    $container.on("click", "list2", function () {
        var active = $(this).hasClass("active");
        var did = $(this).parent().parent().attr("did");
        var $list1 = $("list1[did=" + did + "]");
        if (active) {
            $(this).removeClass("active");
            $list1.removeClass("active");
            depart--;
            //column sum should not leap 20!!
            for (var m = 0; m < 20; m++) {
                if ($(this).parent().find("list2[cid=" + m + "]").hasClass("active")) {
                    $list1.addClass("active");
                    depart++;
                    break;
                }
            }
        } else {
            if ($list1.hasClass("active")) {
                $(this).addClass("active");
            } else {
                if (depart < 3) {
                    $(this).addClass("active");
                    depart++;
                    $list1.addClass("active");
                }
                else {
                    warning("最多选择三个部门呦~");
                }
            }
        }
    });

    //pic preview
    $pic.on("click", function () {
        $picfile.click();
    });
    $picfile.on("change", function () {
        var objUrl = getObjectURL(this.files[0]);
        if (objUrl)
            $pic.css("background-image", "url('" + objUrl + "')");
    })

    //gender pick
    $female.on("click", function () {
        var $icon = $(this).find(".icon");
        $icon.css("background-image", "url('../../img/apply/female_on.png')");
        $male.find(".icon").css("background-image", "url('../img/apply/male_off.png')");
    })
    $male.on("click", function () {
        var $icon = $(this).find(".icon");
        $icon.css("background-image", "url('../img/apply/male_on.png')");
        $female.find(".icon").css("background-image", "url('../../img/apply/female_off.png')");
    })
    //alarm
    $check.iCheck({
        checkboxClass: 'icheckbox_flat-green',
        radioClass: 'iradio_flat-green'
    });
    $(".alarm .note").on("click", function () {
        $check.next("ins").click();
    });
    $check.next("ins").on('click', function () {
        var checked = $(this).parent().hasClass("checked");
        if (!checked) {
            $content.find("p").show();
            $content.fadeIn(function () {
                $content.removeClass("checked");
            })
        }
        else {
            $content.fadeOut(function () {
                $content.find("p").hide();
                $content.addClass("checked");
            })
        }
    });

    function getDepartResult(data) {
        var department = [];
        for (var i = 0; i < 10; i++) {
            var obj = new Object();
            var $thisDepart = $(".depart_list list1[did=" + i + "].active");
            obj.departname = $thisDepart.text();
            if (!obj.departname)continue;
            obj.column = [];
            for (var j = 0; j < 10; j++) {
                var column = $(".popup[did=" + i + "] .pop_list list2[cid=" + j + "].active").text();
                if (column) obj.column.push(column);
            }
            department.push(obj);
        }
        data.department = department;
    }

    $submit.on('click', function () {
        var finalData = $data.serializeObject();
        if (!finalData.check) {
            warning("必须先确认注意事项哦~");
            return;
        }
        finalData.clubID = clubID;
        finalData.club = localStorage.getItem("club");
        getDepartResult(finalData);
        var loading = "<div class='popup' style='height:200px;animation: pop2 0.7s'>" +
            "<img src='../../img/apply/loading.gif'>" +
            "<div>正在提交</div>" +
            "</div>"
        $container.append(loading);
        $.ajax({
            url: "/common/uploadToken",
            method: "get",
            data: {
                type: "image"
            },
            success: function (data) {
                var form = new FormData(document.getElementById("formfile"));
                $.ajax({
                    url: "http://up-z2.qiniu.com?token=" + data.token,
                    type: "post",
                    data: form,
                    processData: false,
                    contentType: false,
                    success: function (data) {
                        finalData.pic_url=data.url;
                        console.log(finalData);
                        $.ajax({
                            url: "/reg",
                            contentType: "application/json",
                            method: "post",
                            data: finalData,
                            success:function () {
                                $(".popup").remove();
                                warning("上传成功 感谢您的报名~");
                            },
                            error: function (reg) {
                                $(".popup").remove();
                                warning(reg.responseText);
                            }
                        })
                    },
                    error: function () {
                        $(".popup").remove();
                        warning("图片上传失败 请检查网络");
                    }
                });
            }
        });
    })
})