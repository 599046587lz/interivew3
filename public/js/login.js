//baseURL = 'http://interview.redhome.cc/';
//baseURL = 'http://interview.redhome.cc';
baseURL = '/';

$(function () {

    var pass_input = $("#password")[0]
    var $visibility = $("#visibility")
    var $login = $('#login');

    $visibility.on('mousedown',function () {
        pass_input.focus()
        if(pass_input.type === 'password'){
            pass_input.type = 'text';
            $visibility[0].style.color = '#3275E0'
        } else {
            pass_input.type = 'password';
            $visibility[0].style.color = '#919191'
        }
    })

    $("input").keyup(function (e) {
        if(e.keyCode === 13){
            $("#login").click()
        }
    })

    $login.click(function (e) {
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
                $login.addClass('load')
            },
            statusCode: {
                200: function () {
                    snackbar.success('登陆成功!');
                    setTimeout(function () {
                        window.location.href = "./select.html";
                    }, 500);
                },
                403: function () {
                    snackbar.err("帐号或密码错误！");
                },
                404: function () {
                    snackbar.err("Page not found!");
                },
                500: function () {
                    snackbar.err('服务器错误,请重试!');
                }
            },
            complete: function () {
                $login.removeClass('load');
            }
        });
    });
});

