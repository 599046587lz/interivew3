/**
 * Created by karboom on 14-9-28.
 */
// functions
var relogin = function(){
    window.loaction = '/';
};
// update queue info
var update_queue = function(){
    var queue = {done:3,wait:50};
    var root = $('#header');
    root.find('.done .count').text(queue.done);
    root.find('.wait .count').text(queue.wait);
    return;
    $.getJSON();
};
// ajax helper
var ajaxHandler = function(func){
    return function(data, status, xhr){
        switch (xhr.status){
            case "500":err('服务器错误');break;
            case '403':relogin();break;
            case '200':
                if(data.status && data.status == 'failed'){
                    err('网络出错,请稍候重试');
                }else{
                    func();
                }
                break;
        };
    };
};
// global var -- club
var set_club = function(){
    window.club = { departments: [{did:1,name:'人力资源中心'},{did:5,name:'技术'},{did:4,name:'设计'},{did:3,name:'运营部'},{did:2,name:'外联部'}]};
    return;
    $.getJSON('profile', ajaxHandler(function(){
        window.club = data;
    }));
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
// -clock
var add_clock=function(){
    var root = $("#header").find(".time");
    var sec = root.find(".sec");
    var min = root.find(".min");
    if ("59" == sec.text()) {
        sec.text("0");
        min.text(1 + 1*min.text());
        //chekc time and give tip
        if(min.text() > 6){
            root.find('.min, .sec').css({color:'yellow'});
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
    var root = $('#header .time');
    root.find('.min, .sec').text('0');
};

// -profile
var fix_vl = function(){
    var root = $('#main .profile');
    var height = root.find('table').css('height');
    root.find('.vl').css({height:height});
};

var set_property = function(){
    var extra = ['籍贯', '政治面貌', '出生地'];
    var html ='';
    for(var i in extra){
        html += '<tr><td class="prop">'+ extra[i] +'</td><td class="val">--</td></tr>';
    }
    $('#main .profile table').append(html);
    return;
    $.getJSON('');
};

var del_profile = function(){
    var root = $("#main .profile table");
    root.find('td.val').text('--');
};

var add_profile = function(){
    var root = $('#main .profile table');
    var tbs = root.find('td.val');
    var interviewee = window.interviewee;
    tbs[0].innerText = interviewee.sid;
    tbs[1].innerText = interviewee.name;
    tbs[2].innerText = interviewee.sex ? '男':'女';
    tbs[3].innerText = interviewee.major;
    tbs[4].innerText = interviewee.phone;
    tbs[5].innerText = interviewee.email;
    tbs[6].innerText = interviewee.qq;
    tbs[7].innerText = interviewee.notion;
    var keys = Object.keys(interviewee.extra);
    for (var i in keys){
        tbs[(8+1*i)].innerText = interviewee.extra[keys[i]];
    }
};

// -rate
var del_rate = function(){
    var root = $('#main .rate');
    root.find('.comment').val('');
    root.find('.stars').raty('score',0);
};

var check_stars =function(){
    if($('#score').val()){
        return true;
    }else{
        return false;
    }
};
// logic helper
var finish = function(){
    $('.qtip').hide();
    success('操作成功');
    del_profile();
    del_rate();
    clear_clock();
    window.interviewee = null;
    //todo update_queue(finish)
};
var start = function(){
    start_clock();
    add_profile();
    //todo update_queue(start)
};
//action(routes)
var next = function(){
     if(window.interviewee){
        err('请先评定,推荐,或者跳过当前面试者');
        return;
    };
    window.interviewee = {
        sid: 12062136,
        name: '赵健',
        sex: 1,
        major: '计算机',
        phone: 186065206363,
        email: 'mail@karboom.me',
        qq: 823448759,
        notion: '活着真好',
        extra: {
            '籍贯' : '东北',
            '政治面貌' : '党员'
        }
    };
    start();
    return;
    $.getJSON('call', ajaxHandler(function(){
        window.interviewee = data;

    }));


};

var specialCall = function(){
    if(window.interviewee){
        err('请先评定,推荐,或者跳过当前面试者');
        return;
    };
    window.interviewee = {
        sid: 11111111,
        name: '赵健',
        sex: 1,
        major: '计算机',
        phone: 186065206363,
        email: 'mail@karboom.me',
        qq: 823448759,
        notion: '活着真好',
        extra: {
            '籍贯' : '东北',
            '政治面貌' : '党员'
        }
    };
    start();
    return;
    var data = {sid:$('#appointSid input').val()};
    $.getJSON('call', ajaxHandler(function(){
        window.interviewee = data;
    }));
};

var commit = function(){
    if(!window.interviewee){
        err('尚未有面试者');
        return;
    };
    if(!check_stars()){
        err('请评定星级');
        return;
    };
    var data = {
        sid:window.interviewee.sid,
        score:$('#main .rate .stars').raty('score'),
        comment:$('#main .rate .comment').val()
    };
    $.post('rate', data, function(data){
        if('success' == data.status){
            finish();
        }else{
            err('网络错误,请稍候重试');
        };
    }, 'json');
};

var skip = function(){
    if(!window.interviewee){
        err('尚未有面试者');
        return;
    };
    finish();
    return;
    $.post();
};

var recommend = function(){
     if(!window.interviewee){
        err('尚未有面试者');
        return;
    };
    if($('#selectDep .checked').length == 0){
        err('请选择部门');
        return;
    };
    var data = {
        sid:window.interviewee.sid,
        department:$('#selectDep').find('.checked input').val()
    };

    finish();
    return;
    $.post('recommend', data, ajaxHandler(function(){
        alert(123);
        finish();
    }));
};
// start
$(document).ready(function(){
    set_club();
    set_property();
    //set qtip
    $.fn.qtip.defaults.show.event = 'click';
    $.fn.qtip.defaults.hide.event = 'unfocus';
    $.fn.qtip.defaults.position.my = 'top center';
    $.fn.qtip.defaults.position.at = 'bottom center';
    $.fn.qtip.defaults.style.classes = 'qtip-light';

    // profile module
    var profile = $('#main .profile');
    profile.jScrollPane();

    //rate module
    var rate = $('#main .rate');
    rate.find('.stars').raty({
        starOff : 'img/star-off.png',
        starOn  : 'img/star-on.png',
        hints : ['不能要','慎重考虑','表现一般','值得考虑','一定要'],
        target : "#score",
        targetType : 'score',
        targetKeep : true
    });

    rate.find(".commit").click(commit);

//    rate.find('.commit').qtip({
//        content:{
//            text: $('#confirmCommit')
//        },
//        show: {
//            event: 'click'
//        },
//        hide : {
//            event: 'unfocus'
//        },
//        position:{
//            at: 'bottom center',
//            my: 'top center'
//        }
//    });

    // handle module
    var handle = $('#main .handle');
    handle.find('.recommend').qtip({
        content:{
            text: $('#selectDep')
        }
    });

    handle.find('.skip').qtip({
        content:{
            text: $('#skip')
        },
        show:{
            event:'click'
        },
        hide:{
            event:'unfocus'
        },
        position:{
            at: 'bottom center',
            my: 'top center'
        }
    });
    // call module
    var call = $('#main .call');
    call.find('.special').qtip({
        content:{
            text: $('#appointSid')
        },
        show:{
            event:'click'
        },
        hide:{
            event: 'unfocus'
        },
        position:{
            at: 'bottom center',
            my: 'top center'
        }
    });

    call.find('.next').click(next);
    // selectDep module
    var selectDep = $('#selectDep');
    var departs = window.club.departments;
    var html = '';
    for (var i in departs){
        html += "<li><input type=\"radio\" name=\"depart\" id=\"depart-"+ departs[i]['did']+"\" value=\""+departs[i]['did'] +"\"/><label for=\"depart-"+departs[i]['did']+"\">"+departs[i]['name']+"</label></li>";
    };
    selectDep.find('ul').html(html);

    selectDep.find('input').iCheck({checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue'});

    selectDep.find('.confirm').click(recommend);

    // skip module
    $('#skip .confirm').click(skip);

    // appointSid
    $('#appointSid .confirm').click(specialCall);
});