/**
 * Created by s3 on 2017/7/8.
 */
function getObjectURL(file) {
    var url = null;
    if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file);
    } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}

function warning(str) {
    var warning = '<warning>' + str +
        '<div class="check">我知道了</div>' +
        '</warning>';
    $("body").append(warning);
    $("warning .check").on("click", function () {
        var $warn = $(this).parent();
        $warn.css("animation", "warning-out 0.3s");
        setTimeout(function () {
            $warn.remove();
        }, 300)
    })
}

function getSearchObject() {
    var array = location.search.substring(1).split(/[\&\=]/);
    var obj = {};
    for (var i = 0; i < array.length / 2; i++) {
        obj[array[i * 2]] = array[i * 2 + 1];
    }
    return obj;
}

$(function () {
    // var data =
    //   [
    //         {
    //             name: "公关部",
    //             column: ["老子写代码", "就用php", "想怎样", "打我啊", "大", "打我啊a", "来打我啊"]
    //         },
    //         {
    //             name: "技术部",
    //             column: ["再见老笨蛋", "哈哈啥"]
    //         },
    //         {
    //             name: "设计部",
    //             column: ["老子写代码", "就用php", "想怎样", "打我啊", "大", "打我啊a", "来打我啊"]
    //         },
    //         {
    //             name: "活动运营部",
    //             column: []
    //         },
    //         {
    //             name: "体育联合部",
    //             column: []
    //         },
    //         {
    //             name: "产品运营部",
    //             column: []
    //         }
    //     ]

    var clubID = getSearchObject().clubId;

    //pic preview
    var $pic = $("#student_pic"),
        $picfile = $("#picfile");
    $pic.on("click", function () {
        $picfile.click();
    });
    $picfile.on("change", function () {
        var objUrl = getObjectURL(this.files[0]);
        if (objUrl) $pic.css("background-image", "url('" + objUrl + "')");
    })

    //load list
    var depart = 0;
    var $list = $(".depart_list");
    var list1 = "<list1 did='__did__'>__depart__</list1>";
    var list2 = "<list2 cid='__cid__'>__column__</list2>";
    var popcontent = '<div class="popup invisible" did="__did__">' +
        '<img class="close" src="./img/close.png" alt="">' +
        '<div class="pop_title">__depart__</div>' +
        '<div class="pop_neck">栏目列表</div>' +
        '<div class="pop_list">__list__</div>' +
        '</div>'

    //set data localstored
    $.ajax({
        url: "/club/clubInfo?clubId=" + clubID,
        success: function (data) {
            var club = data.clubName;
            localStorage.setItem("CLUB", club);
            for (var i in data.department) {
                var list = data.department[i];
                var temp = list1.replace("__depart__", list.name).replace("__did__", i);
                $list.append(temp);
                if (list.column[0]) {
                    ///initpopups
                    var poplist = '';
                    for (var j in list.column) {
                        poplist = poplist + list2.replace("__column__", list.column[j]).replace("__cid__", j - (-1));
                    }
                    var insert = popcontent.replace("__depart__", list.name).replace("__did__", i).replace("__list__", poplist);
                    $('body').append(insert);
                }
            }

            //depart
            $list.on('click', 'list1', function () {
                var did = $(this).attr('did');
                var $popup = $(".popup[did=" + did + "]");
                var exist = $popup.html();
                //if has two levels
                if (exist) {
                    var invisible = $popup.hasClass("invisible");
                    if (invisible) {
                        $(".popup").addClass("invisible");
                        $popup.removeClass("invisible");
                    } else {
                        $popup.addClass("invisible");
                    }
                }
                //if has only one
                else {
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


            //popup
            var $popup = $(".popup"),
                $close = $(".popup .close"),
                $plist = $(".popup .pop_list"),
                $body = $("body");
            ///anime
            $body.on("click", ".close", function () {
                $popup.css("animation", "push 0.5s");
                setTimeout(function () {
                    $popup.addClass("invisible");
                    $popup.css("animation", "pop 0.5s");
                }, 500);
            });
            ///physical backward
            window.addEventListener("popstate", function (e) {
                $close.click();
            });
            ///click
            $plist.on("click", "list2", function () {
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
        },
        error: function () {
            warning("部门信息未导入");
        }
    });
    //alarm
    var $check = $("#alarm_agree");
    var $content = $(".alarm_content");
    $check.iCheck({
        checkboxClass: 'icheckbox_flat-green',
        radioClass: 'iradio_flat-green'
    });
    $(".alarm .note").on("click", function () {
        $check.next("ins").click();
    });
    $check.next("ins").on('click', function () {
        var checked = $(this).parent().hasClass("checked");
        if (checked) {
            $content.css("animation", "slide-out 0.7s");
            setTimeout(function () {
                $content.find("p").hide();
            }, 701)
        }
        else {
            $content.css("animation", "slide-in 0.7s");
            $content.find("p").show();
        }
    });
    //sex
    $("#male").on('click', function () {
        var $this = $(this);
        $this.parent().attr("sex", "男");
        $this.find("img").attr("src", "./img/apply/male_on.png");
        $this.prev().find("img").attr("src", "./img/apply/female_off.png");
    })
    $("#female").on('click', function () {
        var $this = $(this);
        $this.parent().attr("sex", "女");
        $this.find("img").attr("src", "./img/apply/female_on.png");
        $this.next().find("img").attr("src", "./img/apply/male_off.png");
    })
    //submitAll
    $(".submitAll").on("click", function () {
        var checked = $("ins").parent().hasClass("checked");
        var clubID = getSearchObject().clubId,
            club = localStorage.getItem("CLUB"),
            name = $("#sName input").val(),
            sid = $("#sId input").val(),
            sex = $(".sex_pick").attr("sex"),
            academy = $("#academy input").val(),
            major = $("#major input").val(),
            intro = $(".text_here textarea").val(),
            long = $("#long input").val(),
            short = $("#short input").val(),
            qq = $("#qq input").val(),
            department = [];
        for (var i = 0; i < 10; i++) {
            var obj = new Object();
            var $thisDepart = $(".depart_list list1[did=" + i + "].active");
            obj.departname = $thisDepart.text();
            if (!obj.departname) continue;
            obj.column = [];
            for (var j = 0; j < 10; j++) {
                var column = $(".popup[did=" + i + "] .pop_list list2[cid=" + j + "].active").text();
                if (column) obj.column.push(column);
            }
            department.push(obj);
        }
        if (!checked) {
            warning("必须先确认注意事项哦~");
            return;
        }
        var loading = "<div class='popup' style='height:200px;animation: pop2 0.7s'>" +
            "<img src='../../img/apply/loading.gif'>" +
            "<div>正在提交</div>" +
            "</div>"
        $("body").append(loading);
        $.ajax({
            url: "/common/uploadToken",
            method: "get",
            data: {
                type: "image"
            },
            success: function (data) {
                //console.log(data);
                var form = new FormData(document.getElementById("formfile"));
                $.ajax({
                    url: "http://up-z2.qiniu.com?token=" + data.token,
                    type: "post",
                    data: form,
                    processData: false,
                    contentType: false,
                    success: function (data) {
                        window.test = {
                            clubID: clubID,
                            club: club,
                            pic_url: data.url,
                            name: name,
                            studentID: sid,
                            gender: sex,
                            college: academy,
                            major: major,
                            intro: intro,
                            tel: long,
                            short_tel: short,
                            qq: qq,
                            department: department
                        };
                        $.ajax({
                            url: "/reg",
                            contentType: "application/json",
                            method: "post",
                            data: JSON.stringify({
                                clubID: clubID,
                                club: club,
                                pic_url: data.url,
                                name: name,
                                studentID: sid,
                                gender: sex,
                                college: academy,
                                major: major,
                                intro: intro,
                                tel: long,
                                short_tel: short,
                                qq: qq,
                                department: department
                            }),
                            success: function () {
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