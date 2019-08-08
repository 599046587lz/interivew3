//baseURL = 'http://interview.redhome.cc/';
//baseURL = 'http://interview.redhome.cc';
baseURL = '/';

var err = function (text) {
    notif({
        msg: text,
        position: 'center',
        type: 'error'
    });
};
// -success
var success = function (text) {
    notif({
        msg: text,
        position: 'center',
        type: 'success'
    })
};

$(function () {

    $('#password').keydown(function (event) {
        if (event.keyCode == "13") {
            $(".button").click()
        }
    })

    $(".button").click(function () {
        var account = $("[name=account]").val();
        var password = $("[name=password]").val();

        $.ajax({
            url: baseURL + "common/login",
            type: 'post',
            data: JSON.stringify({user: account, password: password}),
            contentType: "application/json",
            dataType: 'json',
            beforeSend: function () {
                $(".button").addClass('loading');
            },
            statusCode: {
                404: function () {
                    err("Page not found!");
                },
                403: function () {
                    err("帐号或密码错误！");
                    $("[name=account]").focus();
                },
                200: function () {
                    success('登陆成功!');
                    setTimeout(function () {
                        window.location.href = "select.html";
                    }, 500);
                },
                500: function () {
                    err('服务器错误,请重试!');
                }
            },
            complete: function () {
                $(".button").removeClass('loading');
            }
        });
    });
});
