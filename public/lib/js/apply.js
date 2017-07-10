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
        var $warn=$(this).parent();
        $warn.css("animation","warning-out 0.3s");
        setTimeout(function () {
            $warn.remove();
        },300)
    })
}




$(function () {
    //set data localstored
    //$.ajax({
    //  url:"",
    //  success:function(data){
    //  localStorage.setItem("listData",data);
    // }
    //  error:function(){
    //  alert("啊哦 数据走丢了");
    // }
    // });
    //var data=localStorage.getItem("listData")
    var data = {
        homeId: 1,
        name: "红色家园",
        homelist: [
            {
                dId: 1,
                depart: "公关部",
                column: ["面基&技术", "你们都有毒"]
            },
            {
                dId: 2,
                depart: "技术部",
                column: ["再见老笨蛋", "哈哈啥"]
            },
            {
                dId: 3,
                depart: "设计部",
                column: ["老子写代码", "就用php", "想怎样", "打我啊", "大", "打我啊a", "来打我啊"]
            },
            {
                dId: 4,
                depart: "活动运营部",
                column: []
            },
            {
                dId: 5,
                depart: "体育联合部",
                column: []
            },
            {
                dId: 6,
                depart: "产品运营部",
                column: []
            }
        ]
    }

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


    var depart = 0;
    //load list
    var $list = $(".depart_list");
    var list1 = "<list1 did='__did__'>__depart__</list1>";
    var list2 = "<list2 cid='__cid__'>__column__</list2>";
    var popcontent = '<div class="popup invisible" did="__did__">' +
        '<img class="close" src="./img/close.png" alt="">' +
        '<div class="pop_title">__depart__</div>' +
        '<div class="pop_neck">栏目列表</div>' +
        '<div class="pop_list">__list__</div>' +
        '</div>'

    for (var i in data.homelist) {
        var list = data.homelist[i];
        var temp = list1.replace("__depart__", list.depart).replace("__did__", list.dId);
        $list.append(temp);
        if (list.column[0]) {
            ///initpopups
            var poplist = '';
            for (var j in list.column) {
                poplist = poplist + list2.replace("__column__", list.column[j]).replace("__cid__", j - (-1));
            }
            var insert = popcontent.replace("__depart__", list.depart).replace("__did__", list.dId).replace("__list__", poplist);
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
    // $(".submitAll").on("click",function () {
    //     var pic=$("#student_pic").css("background-image").split('"')[1];
    //     var name=$("#sName").val();
    //     var sid=$("#sId").val();
    //     var sex=$(".sex_pick").attr("sex");
    //     var academy=$("#academy").val();
    //     var major=$("#major").val();
    //     var info=$(".text_here").text();
    //     var long=$("#long").val();
    //     var short=$("#short").val();
    //     var qq=$("#qq").val();
    //     var checked=$("ins").parent().hasClass("checked");
    // })

})