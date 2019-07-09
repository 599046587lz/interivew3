var baseURL = '';

var storage = window.localStorage;

//测试数据
// var freeDepartment = [
//                     // {sid:123, name: "asd", did:"技术" ,room:"1教"},
//                     // {sid:123, name: "asd", did:"技术" ,room:"1教"},
//                     // {sid:123, name: "asd", did:"技术" ,room:"1教"},
//
//                         ];
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

    var random;
    if(did.length > 1){                                                         //多个部门随机挑选面试部门
        random = (Math.floor(Math.random() * did.length));
    }
    var didr = did[random];
    var roomr = room[random];
    var template = `<div class = \"template\">
                        <span class='smallCircle'></span>
                        <span class='calling'>请${name}同学到${roomr}教室参加${didr}面试</span>
                    </div>`;
    return template;
}

//改变呼叫
var changeCallRow = function(){
    var calling = JSON.parse(storage.getItem("calling"));
    var departmentInfo = JSON.parse(storage.getItem("departmentInfo"));
    // console.log(calling);
    $(".current ._default").remove();
    $(".current .template").remove();
    for(var i = 0; i < calling.length; i ++){
        var room = [];
        var did = [];
        for(var j = 0; j < departmentInfo[0].departments.length; j ++){
            for (var k = 0; k <calling[i].volunteer.length; k ++){
                if(calling[i].volunteer[k] == departmentInfo[0].departments[j].did){
                    did[k] = departmentInfo[0].departments[j].name;
                    room[k] = departmentInfo[0].departments[j].location;
                }
            }
            // console.log(did);
        }
        var a = callTemplate(calling[i].name, room, did);
        // console.log(a);
        $(".current").append(a);
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
                console.log("部门");
                console.log(data) ;
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
            404 : function(){
                err("Page not found!");
            },
            500 : function(){
                err('服务器错误,请重试!');
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
                console.log("呼叫");
                console.log(data.data) ;
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
                console.log("排队");
                console.log(data.data) ;
                storage.setItem("waiting", JSON.stringify(data.data));

            }
        }
    });

}

// 签 到
var signin = function(){
    var input = $("input[ nam = sid]");
    var stuID = input.val();
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
                err("该学生未报名（待测试）!");                    //待测试
                relogin();
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

                                        //拿数据
    getFinishNumber();
    getWaiting();
    getCalling();
    getDepartmentInfo();

    changeWaitRow();                    //改变排队
    interviewStatus();                  //面试人数,排队人数
    changeCallRow();                    //叫号
}


$(function(){

	$(".signin .submit").click(signin);                     //签到

    var interval = setInterval(toShow, 3000);               //刷新展示页面/3s
    // toShow();
});
