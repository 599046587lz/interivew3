/**
 * Created by Shinelon on 2017/8/8.
 */
let port = 3001;
let assetsPath = 'http://localhost:' + port;

$(function () {

    var warning = function (str) {
        var $warning = '<warning>' + str +
            '<div class="check">我知道了</div>' +
            '</warning>';
        $container.append($warning);
        $submit.addClass("noclick");
        $container.on('click', '.check', function () {
            var $warn = $(this).parent();
            $warn.remove();
            $submit.removeClass("noclick");
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
    getDepartInfo(clubID).then(function() {
        renderAttenction();
    });

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
    $(".email input").emailpop();

    var derpatmentNameMap = {};
    var attention = '';

    function getDepartInfo(clubID) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: assetsPath + "/club/clubInfo?clubId=" + clubID,
                success: function (data) {
                    localStorage.setItem("club", data.message.clubName);
                    localStorage.setItem("maxDep", data.message.maxDep);
                    attention = data.message.attention;
                    loadList(departFormat(data.message.departments));
                    return resolve();
                },
                error: function () {
                    $container.html("");
                    warning("找不到服务器");
                    return reject();
                }
            })
        })

    }

    function departFormat(data) {
        var prelist = [];
        var prev = '';
        var department = new Object();
        department.column = new Object();
        for (var i in data) {
            derpatmentNameMap[data[i].name] = data[i].did;
            var predepart = data[i].name.split("-")[0];
            var precolumn = data[i].name.split("-")[1];

            if (predepart == prev) {
                department.column.push(precolumn);
            }
            else {
                prelist.push(department);
                department = [];
                prev = predepart;
                department.name = predepart;
                department.column = [];
                department.column.push(precolumn);
            }
        }
        prelist.push(department);
        delete prelist[0];
        return prelist;
    }

    var max = 0, depart = 0;

    function loadList(data) {
        max = localStorage.getItem("maxDep");
        if(!(max-0))max=99;
        //动态注入部门标签
        for (var i in data) {
            var list = data[i];
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
            var active = $(this).hasClass("active");
            if (active) {
                $(this).removeClass("active");
                depart--;
            } else {
                if (depart < max) {
                    $(this).addClass("active");
                    depart++;
                }
                else
                    warning("最多只能选择"+max+"项哦");
            }
        }
    });

    //弹窗的关闭按钮
    $container.on("click", ".close", function () {
        var did = $(this).parent().attr('did');
        $("list1[did=" + did + "]").click();
    });

    //二级标签点击
    $container.on("click", "list2", function () {
        var active = $(this).hasClass("active");
        var did = $(this).parent().parent().attr("did");
        var $list1 = $("list1[did=" + did + "]");
        if (active) {
            $(this).removeClass("active");
            $list1.removeClass("active");
            var flag=0;
            //二级标签不不能超过15
            for (var m = 0; m < 15; m++) {
                if ($(this).parent().find("list2[cid=" + m + "]").hasClass("active")) {
                    $list1.addClass("active");
                    flag=1;
                    break;
                }
            }
            if(!flag)depart--;
        } else {
            if ($list1.hasClass("active")) {
                $(this).addClass("active");
            } else {
                if (depart < max) {
                    $(this).addClass("active");
                    $list1.addClass("active");
                    depart++;
                }
                else
                    warning("最多只能选择"+max+"项哦");
            }
        }
    });

    //图片预览
    var hasPic = false;
    $pic.on("click", function () {
        $picfile.click();
    });
    $picfile.on("change", function () {
        hasPic = true;
        $(".pic+div").html('');
        var objUrl = getObjectURL(this.files[0]);
        if (objUrl)
            $pic.css("background-image", "url('" + objUrl + "')");
    })

    //性别选择
    $female.on("click", function () {
        var $on = $(this).find(".icon.on");
        var $off = $(this).find(".icon.off");
        $on.removeClass("hide");
        $off.addClass("hide");
        $male.find(".icon.on").addClass("hide");
        $male.find(".icon.off").removeClass("hide");
    })
    $male.on("click", function () {
        var $on = $(this).find(".icon.on");
        var $off = $(this).find(".icon.off");
        $on.removeClass("hide");
        $off.addClass("hide");
        $female.find(".icon.on").addClass("hide");
        $female.find(".icon.off").removeClass("hide");
    })
    //注意事项

    function renderAttenction() {
        if (!!attention) {
            $('title').html('家园线上报名表');
            console.log(attention)
            $('.alarm-content').append(attention)
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
                    $content.removeClass("checked");

                }
                else {
                    $content.find("p").hide();
                    $content.addClass("checked");
                }
            });
        }
        else {
            $(".alarm").remove();
            $(".alarm-content").remove();
        }
    }

    function getDepartResult(data) {
        var department = [];
        for (var i = 0; i < 30; i++) {
            var obj = '';
            var flag = 1;
            var $thisDepart = $(".depart_list list1[did=" + i + "].active");
            obj = $thisDepart.text();
            if (!obj)continue;
            for (var j = 0; j < 15; j++) {
                var insert = '';
                var column = $(".popup[did=" + i + "] .pop_list list2[cid=" + j + "].active").text();
                if (column) {
                    flag = 0;
                    insert = obj + "-" + column;
                    department.push(derpatmentNameMap[insert]);
                }
            }
            if (flag) department.push(derpatmentNameMap[obj]);
        }
        data.volunteer = department;
    }

    function sendFinalData(data) {
        delete data.check;
        if (!data.short_tel) data.short_tel = undefined;
        //console.log(data);
        $.ajax({
            url: assetsPath + "/reg",
            contentType: "application/json",
            method: "post",
            data: JSON.stringify(data),
            success: function () {
                $(".popup").addClass('hide');
                $container.html("");
                $container.addClass("background");
                $(".container.background").lazyload();
                var done = $('#done').html();
                $container.append(done);
            },
            error: function (reg) {
                $(".popup").addClass('hide')
                if (reg.responseText == "参数类型不合法") {
                    warning("上传有误 请将数据填写完整");
                    return;
                }
                if (reg.responseText.split(':')[2]) {
                    warning(reg.responseText.split(':')[2]);
                    return;
                }
                warning(reg.responseText);

            }
        })
    }

    function sendPicData(data, form, finalData) {
        if (!hasPic) {
            var url_origin = location.href.split("/apply")[0];
            finalData.pic_url = url_origin + "/img/apply/default_logo.png";
            sendFinalData(finalData);
            return;
        }
        $.ajax({
            url: "http://up-z2.qiniu.com?token=" + data.token,
            type: "post",
            data: form,
            processData: false,
            contentType: false,
            success: function (data) {
                finalData.pic_url = data.url;
                sendFinalData(finalData);
            },
            error: function () {
                $(".popup").remove();
                warning("图片上传失败 请检查网络");
            }
        });
    }

    //上传所有数据
    $submit.on('click', function () {
        $(this).addClass("noclick");
        var finalData = $data.serializeObject();
        if (!finalData.notion) {
            warning("还没有填写自我介绍哦");
            return;
        }
        if (clubID == 1 && !finalData.check) {
            warning("必须先确认注意事项哦~");
            return;
        }
        finalData.cid = clubID;
        finalData.clubName = localStorage.getItem("club");
        getDepartResult(finalData);
        var loading = "<div class='popup' style='height:200px'>" +
            "<img src='../../img/apply/loading.gif'>" +
            "<div>正在提交</div>" +
            "</div>"
        $container.append(loading);
        $.ajax({
            url: assetsPath + "/common/uploadToken",
            method: "get",
            data: {
                type: "image"
            },
            success: function (data) {
                var form = new FormData(document.getElementById("formfile"));
                sendPicData(data, form, finalData);
            }
        });
    })
})
