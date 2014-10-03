/**
 * Created by karboom on 14-9-28.
 */
// functions
// global var -- club
var set_club = function(){
    $.get('profile', function(data, status, obj){

    });
};
// -feedback
var feedback = function(text){
    alert(text);
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

};

var del_profile = function(){
    var root = $("#main .profile table");
    root.find('td.val').text('--');
};

var add_profile = function(){
    var root = $('#main .profile table');
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

//action(routes)
var next = function(){

};

var specialCall = function(){

};

var commit = function(){
    if(!check_stars()){
        feedback('请评定星级');
    };
    //todo pluck data
    $.post('rate', data, function(data){
        if('success' == data.status){
            del_profile();
            del_rate();
        }else{
            feedback('网络错误,请稍候重试');
        };
    }, 'json');
};

var skip = function(){

};

var recommend = function(){

};
// start
$(document).ready(function(){
    start_clock();
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

    // handle module
    var handle = $('#main .handle');
    handle.find('.recommend').qtip({
        content:{
            text: $('#selectDep')
        },
        show: {
            event: 'click'
        },
        hide : {
            event: 'unfocus'
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
    // selectDep module
    var selectDep = $('#selectDep');
    selectDep.find('input').iCheck({checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue'});
});