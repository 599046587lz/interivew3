//baseURL = 'http://interview.redhome.cc/';
//baseURL = 'http://interview.redhome.cc';
baseURL = '/';

$(function () {

    var pass_input = $("#password")[0]
    var icon = $("#visibility")[0]

    $(".visibility").click(function () {
        if(pass_input.type === 'password'){
            pass_input.type = 'text';
            icon.style.color = '#3275E0'
        } else {
            pass_input.type = 'password';
            icon.style.color = '#919191'
        }
        pass_input.focus()
    })

    $("input").keyup(function (e) {
        if(e.keyCode === 13){
            $("#login").click()
        }
    })

    $(".button").click(function (e) {
        e.preventDefault()

        var account = $("[name=username]").val();
        var password = $("[name=password]").val();

        $.ajax({
            url: baseURL + "common/login",
            type: 'post',
            data: JSON.stringify({user: account, password: password}),
            contentType: "application/json",
            // dataType: 'json',
            beforeSend: function () {
                $(".button").addClass('loading');
            },
            statusCode: {
                200: function () {
                    success('登陆成功!');
                    setTimeout(function () {
                        window.location.href = "select.html";
                    }, 500);
                },
                403: function () {
                    err("帐号或密码错误！");
                },
                404: function () {
                    err("Page not found!");
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

