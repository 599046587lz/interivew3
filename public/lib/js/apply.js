/**
 * Created by Shinelon on 2017/8/8.
 */

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

    // function getDepartInfo(clubID) {
    //     return new Promise(function(resolve, reject) {
    //         $.ajax({
    //             url: "/common/clubInfo?clubId=" + clubID,
    //             success: function (data) {
    //                 localStorage.setItem("club", data.message.clubName);
    //                 localStorage.setItem("maxDep", data.message.maxDep);
    //                 attention = data.message.attention;
    //                 loadList(departFormat(data.message.departments));
    //                 return resolve();
    //             },
    //             error: function () {
    //                 $container.html("");
    //                 warning("找不到服务器");
    //                 return reject();
    //             }
    //         })
    //     })
    //
    // }

    function getDepartInfo(clubID) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: "/common/clubInfo?clubId=" + clubID,
                success: function (data) {
                    localStorage.setItem("club", data.clubName);
                    localStorage.setItem("maxDep", data.maxDep);
                    attention = data.attention;
                    loadList(departFormat(data.departments));
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
        //上传图片验证
        var picName = $("#picfile").val();
        var fileTArr = picName.split(".");
        //切割出后缀文件名
        var fileType = fileTArr[fileTArr.length - 1];
        if(fileType != null && fileType !==""){
            if(fileType === "gif" || fileType === "jpg" || fileType === "jpeg" || fileType === "png"){
                hasPic = true;
                $(".pic+div").html('');
                var objUrl = getObjectURL(this.files[0]);
                if (objUrl)
                    $pic.css("background-image", "url('" + objUrl + "')");
            }else{
                warning("请上传正确的图片文件（jpg、jpeg、png或gif）！");
                return;
            }
        }

    });

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
            $('title').html(`${localStorage.getItem("club")}线上报名表`);
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
            url: "/reg",
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
                if (JSON.parse(reg.responseText).message) {
                    warning(JSON.parse(reg.responseText).message);
                    return;
                }
                warning(reg.responseText);

            }
        })
    }


    //上传图片
    function sendPicData(form, finalData) {
        if (!hasPic) {
            var url_origin = location.href.split("/apply")[0];
            finalData.pic_url = url_origin + "/img/apply/default_logo.png";
            sendFinalData(finalData);
            return;
        }
        $.ajax({
            url: "/common/uploadFile",
            type: "post",
            data: form,
            processData: false,
            contentType: false,
            success: function (data) {
                finalData.pic_url = data.url;
                sendFinalData(finalData);
            },
            error: function (err) {
                $(".popup").remove();
                $(".errorHandle").text(JSON.stringify(err));
                warning("图片上传失败 请检查网络");
            }
        });
    }

    //上传所有数据
    $submit.on('click', function () {
        $(this).addClass("noclick");
        var finalData = $data.serializeObject();
        finalData.cid = clubID;
        finalData.clubName = localStorage.getItem("club");
        getDepartResult(finalData);
        if (!finalData.name) {
            warning("还没有填写姓名哦~");
            return;
        }

        var regSid = /^1[0-9]{7}$/;
        if(!finalData.sid){
            warning("还没有填写学号哦~");
            return;
        }else if(finalData.sid.search(regSid) == -1){
            warning("请输入正确格式的学号哦~");
            return;
        }

        if(!finalData.sex){
            warning("还没有填写性别哦~");
            return;
        }
        if(!finalData.college){
            warning("还没有填写学院哦~");
            return;
        }
        if(!finalData.major){
            warning("还没有填写专业哦~");
            return;
        }
        if(finalData.volunteer.length == 0){
            warning("还没有选择理想部门||你的特长||你感兴趣的方向哦~");
            return;
        }
        if (!finalData.notion) {
            warning("还没有填写个人简介哦~");
            return;
        }

        var regPhone = /^(1)[0-9]{10}$/;
        if(!finalData.phone){
            warning("还没有填写长号哦~");
            return;
        }else if(finalData.phone.search(regPhone) == -1){
            warning("请输入正确格式的长号（11位号码）哦~");
            return;
        }

        var regShort_tel = /[0-9]{6}$/;
        if(finalData.short_tel){
            if(finalData.short_tel.search(regShort_tel) == -1){
                warning("请输入正确格式的短号（6位号码）哦~");
                return;
            }
        }

        var regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        if(!finalData.email){
            warning("还没有填写邮箱哦~");
            return;
        }else if(finalData.email.search(regEmail) == -1) {
            warning("请输入正确格式的邮箱哦~");
            return;
        }

        var regQQ = /[1-9][0-9]{4,}/;
        if(!finalData.qq){
            warning("还没有填写qq哦~");
            return;
        }else if(finalData.qq.search(regQQ) == -1){
            warning("请输入正确格式的QQ哦~");
            return;
        }

        if (clubID == 1 && !finalData.check) {
            warning("必须先确认注意事项哦~");
            return;
        }
        var loading = "<div class='popup' style='height:200px'>" +
            "<img src='../../img/apply/loading.gif'>" +
            "<div>正在提交</div>" +
            "</div>";
        var form = new FormData(document.getElementById("formfile"));
        $container.append(loading);
        sendPicData(form, finalData);
    })
})
