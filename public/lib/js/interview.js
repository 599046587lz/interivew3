/**
 * Created by karboom on 14-9-28.
 */
var urlRoot = '/';


window.onbeforeunload = function(e) {
    if(window.interviewee){
        return '如果现在刷新页面,当前面试者资料将丢失,请慎重!';
    }
};

// functions
var relogin = function(){
    window.location = '/';
};

var set_depName = function(){
    $('.topBar .title').text(decodeURIComponent(window.location.hash.replace('#','')));
};

var HTTPCode = {
    204:{
        text:'操作成功',
        action:function(){
            success(HTTPCode[204].text);
        }
    },
    500:{
        text:'服务器错误',
        action:function(){
            err(HTTPCode[500].text);
        }
    },
    403:{
        text:'没有权限,禁止访问',
        action:function(){
//            console.log(HTTPCode);
            err(HTTPCode[403].text);
//            err('error');
        }
    },
    404:{
        text:'没有找到信息',
        action:function(){
            err(HTTPCode[404].text);
        }
    }
};

// -err
var err = function(text){
    notif({
        msg:text,
        position:'center',
        type:'error'
    });
};
// -success
var success = function(text){
    notif({
        msg:text,
        position:'center',
        type:'success'
    })
};

$.ajaxSetup({
    statusCode:(function(){
        var tmp = {};
        for (var i in HTTPCode){
            tmp[i] = HTTPCode[i].action;
        }
        return tmp;
    })()
});


// update queue info
var update_queue = function(doneNumber){
//    var queue = {done:3,wait:50};
    var root = $('.topBar');
    if (!doneNumber) {
        doneNumber = root.find('.done .count').text() * 1 + 1;
        localStorage.setItem('doneNumber', doneNumber);
    }
    root.find('.done .count').text(doneNumber);
//    root.find('.wait .count').text(queue.wait);
//    return;
    $.ajax({
        url:urlRoot + 'interview/queue',
        type:'get',
        statusCode:{},
        success:function(data){
            root.find('.wait .count').text(data.count);
        }
    });
};

// global var -- club
var set_club = function(){
//    window.club = { departments: [{did:1,name:'人力资源中心'},{did:5,name:'技术'},{did:4,name:'设计'},{did:3,name:'运营部'},{did:2,name:'外联部'}]};
//    return;
    $.ajax({
        url:urlRoot+'club/clubInfo',
        data:{
            clubId:1
        },
        type:'get',
        async:false,
        success:function(data){
            window.club = data.message;
        }
    });
};

// -clock
var add_clock=function(){
    var root = $(".topBar").find(".time");
    var sec = root.find(".sec");
    var min = root.find(".min");
    if ("59" == sec.text()) {
        sec.text("0");
        min.text(1 + 1*min.text());
        //chekc time and give tip
        if(min.text() > 6){
            root.find('.min, .sec').css({color:'darkorange'});
        }
        if(min.text() > 15){
            root.find('.min, .sec').css({color:'red'});
        }
    } else {
        sec.text(1 + 1*sec.text());
    };


};

var start_clock=function(){
    window.clocking = setInterval(add_clock, 1000);
};

var stop_clock=function(){
    clearInterval(window.clocking);
};

var clear_clock=function(){
    var root = $('.topBar .time');
    root.find('.min, .sec').text('0').css({color:'#ffffff'});
};

var set_property = function(){
//    var extra = ['籍贯', '政治面貌', '出生地'];
//    var html ='';
//    for(var i in extra){
//        html += '<tr><td class="prop">'+ extra[i] +'</td><td class="val">--</td></tr>';
//    }
//    $('#main .profile table').append(html);
//    return;
    $.ajax({
        url:urlRoot + 'club/extra',
        type:'get',
        async:false,
        success:function(data){
            var html ='';
            for(var i in data){
                html += '<tr><td class="prop">'+ data[i] +'</td><td class="val">--</td></tr>';
            }
            $('#main .profile table').append(html);
        }
    });
};

var del_profile = function(){
    $('.infoDetail div').text('--');
};

var add_profile = function(){
    var items =  $('.infoDetail div');
    var interviewee = window.interviewee;
    items[0].innerText = interviewee.sid;
    items[1].innerText = interviewee.name;
    items[2].innerText = interviewee.sex*1 !=2 ? (interviewee.sex? '男':'女') : '--';

    items[3].innerText = interviewee.major || '--';
    items[4].innerText = interviewee.phone || '--';
    items[5].innerText = interviewee.email || '--';
    items[6].innerText = interviewee.qq || '--';
    items[7].innerText = interviewee.notion || '--';
    // var keys = Object.keys(interviewee.extra);
    // for (var i in keys){
    //     tbs[(8+1*i)].innerText = interviewee.extra[keys[i]] || '--';
    // }
    $('.scrollContainer').jScrollPane();
};
// -selectDep
var set_depList = function(){
    var selectDep = $('.recommendContent');
    var departs = window.club.departments;
    var html = '';
    for (var i in departs){
        html += "<li><input type=\"radio\" name=\"depart\" id=\"depart-"+ departs[i]['did']+"\" value=\""+departs[i]['did'] +"\"/><label for=\"depart-"+departs[i]['did']+"\">"+departs[i]['name']+"</label></li>";
    };
    selectDep.find('ul').html(html);

    selectDep.find('input').iCheck({checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue'});

    selectDep.find('.confirm').click(recommend);
};
// -rate
var del_rate = function(){
    var root = $('.rate');
    root.find('.comment').val('');
    root.find('.stars').raty('score',0);
};

var check_stars =function(){
    return $('#score').val();
};
// logic helper
var finish = function(){
    $('.qtip').hide();
    success('操作成功');
    del_profile();
    del_rate();
    stop_clock();
    clear_clock();
    window.interviewee = null;
    update_queue();
};
var start = function(){
    start_clock();
    add_profile();
    $('.qtip').hide();
};
//action(routes)
var next = function(){
     if(window.interviewee){
        err('请先评定,推荐,或者跳过当前面试者');
        return;
    }
//    window.interviewee = {
//        sid: 12062136,
//        name: '赵健',
//        sex: 1,
//        major: '计算机',
//        phone: 186065206363,
//        email: 'mail@karboom.me',
//        qq: 823448759,
//        notion: '活着真好',
//        extra: {
//            '籍贯' : '东北',
//            '政治面貌' : '党员'
//        }
//    };
//    start();
//    return;
    $('.next').addClass('loading');
    $.ajax({
        url:urlRoot + 'interview/call',
//        async:false,
        type:'get',
        success:function(data){
            window.interviewee = data;
            start();
        },
        complete: function () {
            $('.next').removeClass('loading');
        }
    });


};

var specialCall = function(){
    if(window.interviewee){
        err('请先评定,推荐,或者跳过当前面试者');
        return;
    };
//    window.interviewee = {
//        sid: 11111111,
//        name: '赵健',
//        sex: 1,
//        major: '计算机',
//        phone: 186065206363,
//        email: 'mail@karboom.me',
//        qq: 823448759,
//        notion: '活着真好',
//        extra: {
//            '籍贯' : '东北',
//            '政治面貌' : '党员'
//        }
//    };
//    start();
//    return;
//    var data = {sid:$('#appointSid input').val()};
    var $this = $(this);
    $this.addClass('loading');
    $.ajax({
        url:urlRoot + 'interview/call',
        type:'get',
        data:{sid:$('.specialContent input').val()},
        success:function(data){
            window.interviewee = data;
            start();
        },
        complete: function () {
            $this.removeClass('loading');
        }
    })
};

var submit = function(){
    if(!window.interviewee){
        err('尚未有面试者');
        return;
    }
    if(!check_stars()){
        err('请评定星级');
        return;
    }
    if (!confirm('确认提交？'))  {
        return;
    }
//    var data = {
//        sid:window.interviewee.sid,
//        score:$('#main .rate .stars').raty('score'),
//        comment:$('#main .rate .comment').val()
//    };
    var $this = $(this);
    $this.addClass('loading');
    $.ajax({
        url:urlRoot + 'interview/rate',
        type:'post',
        data:{
            sid:window.interviewee.sid,
            score:$('.rate .stars').raty('score'),
            comment:$('.rate .comment').val()
        },
        success:function(){
            finish();
        },
        complete: function () {
            $this.removeClass('loading');
        }
    });
};

var skip = function(){
    console.dir(window.interviewee);
    if(!window.interviewee){
        err('尚未有面试者');
        return;
    };
//    finish();
//    return;
    var $this = $(this);
    $this.addClass('loading');
    $.ajax({
        url:urlRoot + 'interview/skip',
        type:'post',
        data:{sid:window.interviewee.sid},
        success:function(){
            finish();
        },
        complete: function () {
            $this.removeClass('loading');
        }
    });
};

var recommend = function(){
    if(!window.interviewee){
        err('尚未有面试者');
        return;
    }
    if($('.recommendContent .checked').length == 0){
        err('请选择部门');
        return;
    }
//    var data = {
//        sid:window.interviewee.sid,
//        department:$('#selectDep').find('.checked input').val()
//    };
//
//    finish();
//    return;
    var $this = $(this);
    $this.addClass('loading');
    $.ajax({
        url:urlRoot + 'interview/recommend',
        type:'post',
        data:{
            sid:window.interviewee.sid,
            department:$('.recommendContent').find('.checked input').val()
        },
        success:function(){
            $('.qtip').hide();
            success('操作成功');
        },
        complete: function () {
            $this.removeClass('loading');
        }
    });
};
// start
$(document).ready(function(){
    set_club();
    set_depName();
    set_depList();
    // set_property();
    update_queue(localStorage.getItem('doneNumber'));

    //back button
    $('.back').click(function () {
       window.history.back();
    });

    //set qtip
    $.fn.qtip.defaults.show.event = 'click';
    $.fn.qtip.defaults.hide.event = 'click';
    $.fn.qtip.defaults.position.my = 'top center';
    $.fn.qtip.defaults.position.at = 'bottom center';
    $.fn.qtip.defaults.style.classes = 'qtip-light';

    // profile module
    var profile = $('.main .scrollContainer');
    profile.jScrollPane();

    //rate module
    var rate = $('.main .rate');
    rate.find('.stars').raty({
        starOff : 'img/star-off.png',
        starOn  : 'img/star-on.png',
        hints : ['不能要','慎重考虑','表现一般','值得考虑','一定要'],
        target : "#score",
        targetType : 'score',
        targetKeep : true
    });
    rate.find(".submit").click(submit);

    // action
    $('.recommend').qtip({
        content:{
            text: $('.recommendContent')
        }
    });

    $('.skip').qtip({
        content:{
            text: $('.skipContent')
        },
        position:{
            at: 'bottom center',
            my: 'top center'
        }
    });

    $('.special').qtip({
        content:{
            text: $('.specialContent')
        },
        position:{
            at: 'bottom center',
            my: 'top center'
        }
    });

    $('.next').click(next);


    // skip module
    $('.skipContent .confirm').click(skip);

    // appointSid
    $('.specialContent .confirm').click(specialCall);
});