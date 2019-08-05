var baseURL = '';

var storage = window.localStorage;

//测试数据

// var stuLine = [
//
//                 {sid:12214, name: "asd", did:"技术dSVsvSDBvBSDBdvSDbWBSDvSbesd" ,room:"1教"},
//                 {sid:123, name: "asd", did:"技术" ,room:"1教"},
//                 {sid:123, name: "asd", did:"技术" ,room:"1教"},
//                 {sid:123, name: "asd", did:"技术" ,room:"1教"},
//                 {sid:123, name: "asd", did:"技术" ,room:"1教"},
//                 {sid:123, name: "asd", did:"技术" ,room:"1教"},
//                 {sid:123, name: "asd", did:"技术" ,room:"1教"},
//                 {sid:123, name: "asd", did:"技术" ,room:"1教"},
//                 {sid:123, name: "asd", did:"技术" ,room:"1教"},
//                 {sid:123, name: "asd", did:"技术" ,room:"1教"},
//                 {sid:123, name: "asd", did:"技术" ,room:"1教"},
// ];

var err = function(text){
    notif({
        msg:text,
        position:'center',
        type:'error'
    });
};

var success = function(text){
    notif({
        msg:text,
        position:'center',
        type:'success'
    });
};
var relogin = function(){
	window.location.href = 'login.html';
};

// 排队表格模板
var waitingTemplate = function(no, sid, name, did, room){
    var dids = did.join(',') ;
    var rooms = room.join(',');
    // console.log(dids);
    var template = `<tr class = \"template\">
                        <td>${no}</td>
                        <td>${sid}</td>
                        <td>${name}</td>
                        <td class=\"depart tdOverHide\" >${dids}</td>
                        <td class=\"tdOverHide\" >${rooms}</td>
                    </tr>`;
    return template;
}

// 呼叫模板
var callTemplate = function(name, room, did){

    var template = `<div class = \"template\">
                        <span class='smallCircle'></span>
                        <span class='calling'>请${name}同学到${room}教室参加${did}面试</span>
                    </div>`;
    return template;
}

//改变呼叫
var changeCallRow = function(){
    $(".current ._default").remove();
    $(".current .template").remove();
    var calling = JSON.parse(storage.getItem("calling"));
    if(calling.length == 0){
        var a = "<div class=\"_default\"><span class=\"smallCircle\"></span><span class=\"calling\">暂无呼叫</span></div>";
        $(".current").append(a);
    }
    else{
        var departmentInfo = JSON.parse(storage.getItem("departmentInfo"));
        for(var i = 0; i < calling.length; i ++){
            var room ;
            var did ;
            for(var j = 0; j < departmentInfo[0].departments.length; j ++){

                // console.log(parseInt(calling[i].calldid));
                if(parseInt(calling[i].calldid) == departmentInfo[0].departments[j].did){
                    did = departmentInfo[0].departments[j].name;
                    room = departmentInfo[0].departments[j].location;
                }

                // console.log(did);
            }
            var a = callTemplate(calling[i].name, room, did);
            // console.log(a);
            $(".current").append(a);
        }
    }

}
// 改变排队
var changeWaitRow = function(){
    var waiting = JSON.parse(storage.getItem("waiting"));
    var departmentInfo = JSON.parse(storage.getItem("departmentInfo"));
    // console.log(departmentInfo);
    // console.log(waiting);
    var waitingContainer = $('.waitingList tbody');
    $(".waitingList ._default").remove();
    $(".waitingList .template").remove();

    for(var i = 0; i < waiting.length; i ++){
        var did = [];
        var room = [];
        for(var j = 0; j < departmentInfo[0].departments.length; j ++){
            // console.log(waiting[i].volunteer.length);
            for(var k = 0; k < waiting[i].volunteer.length; k ++){
                if(waiting[i].volunteer[k] ==  departmentInfo[0].departments[j].did){
                    did[k] = departmentInfo[0].departments[j].name;
                    room[k] = departmentInfo[0].departments[j].location;
                }
            }
            // console.log(did);
        }

        var a = waitingTemplate(i + 1, waiting[i].sid, waiting[i].name, did, room);
        // console.log(a);
        waitingContainer.append(a);
    }
    if(waiting.length > 7)
        $(".waitingList").jScrollPane();

    // 测试
    // for(var i = 0; i < stuLine.length; i ++){
    //     var a = waitingTemplate(i + 1, stuLine[i].sid, stuLine[i].name, [0,1], ["7jiao","6jiaoDF VZSVFSDFDS fSDFsdC"]);
    //     // console.log(a);
    //     waitingContainer.append(a);
    // }
    // if(stuLine.length > 7)
    //     $(".waitingList").jScrollPane();

    //设置单元格宽度
    var tdHeader = $(".tHead").find("td");                  //获取表头对象
    var tds = $('.template').find("td");                    //获取表格对象
    for (var i = 0; i < tdHeader.length; i ++){
        $(tds.eq(i)).width(tdHeader.eq(i).width());
    }

}

// 面试人数
var interviewStatus = function(){
    $(".interviewedNumber").html(storage.getItem("interviewed")) ;
    var waiting = JSON.parse(storage.getItem("waiting"));
    // console.log(waiting.length);
    $(".waitingNumber").html(waiting.length);
}


var getDepartmentInfo = function(){
    $.ajax({
        url : baseURL + 'room/getDepartmentInfo',
        type : 'get',
        dataType : 'json',

        statusCode : {
            404 : function(){
                err("Page not found!");
            },
            500 : function(){
                err('服务器错误,请重试!');
            },
            200 : function(data){
                // console.log("部门");
                // console.log(data) ;
                storage.setItem("departmentInfo", JSON.stringify(data.message))
            }
        }
    });
}

var getFinishNumber = function(){
    $.ajax({
        url : baseURL + '/room/finish',
        type : 'get',
        dataType : 'json',

        statusCode : {
            500 : function(){
                err('服务器错误,请重试!');
            },
            204 : function(){
                // err('没人');
                console.log("暂时没人完成面试")
            },
            200 : function(data){
                // console.log(data.data) ;
                storage.setItem("interviewed", data.data)

            }
        }
    });
}

var getCalling = function(){

    $.ajax({
        url : baseURL + '/room/calling',
        type : 'get',
        dataType : 'json',

        statusCode : {
            404 : function(){
                err("Page not found!");
            },
            500 : function(){
                err('服务器错误,请重试!');
            },
            200 : function(data){
                // console.log("呼叫");
                // console.log(data.data) ;
                storage.setItem("calling", JSON.stringify(data.data))

            }
        }
    });

}

var getWaiting = function(){

    $.ajax({
        url : baseURL + '/room/sighed',
        type : 'get',
        dataType : 'json',

        statusCode : {
            404 : function(){
                err("Page not found!");
            },
            500 : function(){
                err('服务器错误,请重试!');
            },
            200 : function(data){
                // console.log("排队");
                // console.log(data.data) ;
                storage.setItem("waiting", JSON.stringify(data.data));

            }
        }
    });

}

// 签 到
var signin = function(){
    var input = $("input[ name = sid ]");
    var stuID = input.val();
    // console.log(stuID);
    if(!stuID){
        err("请输入学号");
        input.focus();
        return false;
    }
    $.ajax({
        url : baseURL + '/room/sign',
        type : 'get',
        data : {
            sid: stuID
        },
        dataType : 'json',
        success : function(data){
            console.log("签到");
            console.log(data);
        },
        statusCode : {
            404 : function(){
                err("Page not found!");
            },
            403 : function(){
                err("该学生未报名!");
                // relogin();
            },
            204 : function () {
                success("该学生已经签到过了!");
            },
            // 待开发的部门选择
            // 205 : function(){
            //     selectDepDiv();
            // },
            500 : function(){
                    err('服务器错误,请重试!');
            },
            200 : function(data){
                success("签到成功!");
            }
        }
    });
};

// 展示页面(呼叫,排队,面试状态)
var toShow = function(){

                                        //更新数据
    getFinishNumber();
    getWaiting();
    getCalling();


    changeWaitRow();                    //改变排队
    interviewStatus();                  //面试人数,排队人数
    changeCallRow();                    //叫号
}


$(function(){
    $('.back').click(function () {
        window.history.back();
    });
    getDepartmentInfo();
    if(!storage.getItem("waiting")){
        var waiting =[];
        storage.setItem("waiting", JSON.stringify(waiting));
    }
    if(!storage.getItem("calling")){
        var calling =[];
        storage.setItem("calling", JSON.stringify(calling));
    }
    if(!storage.getItem("interviewed")){
        var interviewed = 0;
        storage.setItem("interviewed", interviewed);
    }
    toShow();

	$(".signin .submit").click(signin);                     //签到

    var interval = setInterval(toShow, 3000);               //刷新展示页面/3s

});
