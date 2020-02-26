$(function () {
    var baseURL = '';
    var $addCircle = $("#addCircle");
    var $staffId = $('#staffId');
    var $left = $('#left');
    var $right = $('#right');
    var $wait = $('#wait');
    var $bull = $('.bull');
    var $roomContainer = $("#roomContainer");
    var $roomBorder = $(".roomBorder");
    var scrollLeft = 0;
    var department = [];
    var interviewRoom = [];
    var ifStaffidCalled = [];
    var templateHtml = [];
    templateHtml['blank'] = `<div class="cover blur">
                                <div class="blurry">
                                    <div class="skeleton">
                                        <div class="avatar"></div>
                                        <div class="line"></div>
                                    </div>
                                </div>
                            </div>`;
    templateHtml['room'] = `<div class="roomBorder">
                                <div>
                                    <div class="circleNumber">_number</div>
                                    <div class="name">_name</div>
                                </div>
                                <div class="mdc-chip-set">
                                    <div class="mdc-chip"><span class="mdc-chip__text">_department</span></div>
                                </div>
                                <div class="roomVague">
                                    <div class="tip">you need to go</div>
                                    <div class="classRoom">_interviewRoom</div>
                                    <div class="skip" onclick>skip</div>
                                    <div class="ok">ok</div>
                                </div>
                            </div>`;
    templateHtml['part'] = `<div class="cover">
                                <span>
                                    <div class="circleNumber">_number</div>
                                    <span class="name">_name</span>
                                    <span class="stdNumber">_sid</span>
                                </span>
                                    <div class="mdc-chip-set">_allDepartment
                                </div>
                            </div>`;

    $addCircle.on('click',function () {
        $addCircle.toggleClass('active');
    })

    $(".transparent").on('click',function (e) {
        e.stopPropagation()
    })

    $staffId.on('focus',function () {
        if ($staffId.val() === 'input staff id'){
            $staffId.val("")
        }
    })

    var getDepartment = function(){
        $.ajax({
            url: baseURL + '/club/clubInfo',
            type: 'get',
            statusCode: {
                200: function (data) {
                    data.departments.forEach(function(element){
                        department[element.did] = element.name;
                        interviewRoom[element.did] = element.location;
                    })
                }
            }   
        });
    }

    

    $("#done").on('click',function () {
        $addCircle.removeClass('active');
        // if (!(/^\d{8}$/.test(staffId.value))){
        //  snackbar.err("请输入正确的学号");
        // }
        // else{}
        var sid = staffId.value;
        $.ajax({
            url: baseURL + '/room/sign',
            type: 'get',
            data: {
                sid: sid,
            },
            dataType: 'json',
            statusCode: {      
                403: function () {
                    snackbar.err("该学生未报名");
                },
                200: function () {
                    snackbar.success("签到成功！");  
                },
                204: function()  {
                    snackbar.err("该学生已签到");
                }
            }
        });
        snackbar.labelText = "";
        $staffId.val("input staff id");
    })
    //呼叫模板 返回所有被叫到的人的信息
    var callMember = function(){
        $.ajax({
            url: baseURL + '/room/calling',
            type: 'get',
            statusCode: {
                200: function (data) {
                    // var numberTop = 1;
                    if (data.length == 0){
                        $roomBorder.removeClass("disnone");
                    }
                    else{
                        $roomBorder.addClass("disnone");
                    }
                    data.forEach(function(element){  
                        if (!ifStaffidCalled[element.sid]){
                            var beCalled = templateHtml['room'].replace('_name',element.name)
                                               .replace('_number',element.signNumber)
                                               .replace('_department',department[element.calldid])
                                               .replace('_interviewRoom',interviewRoom[element.calldid]);
                            $wait.append(beCalled);
                            getVague(element.sid);
                            // numberTop++;
                            ifStaffidCalled[element.sid] = true;  
                            judgeScroll();
                        }
                    })
                }
            }   
        });
    }

    //确认模板
    var confirmCalled = function(confirm,sid,roomBorder){
        $.ajax({
            url: baseURL + '/room/confirm',
            type: 'post',
            data: JSON.stringify({
                sid: sid,
                confirm: confirm,
            }),
            contentType: "application/json",
            statusCode: {
                200: function () {
                    roomBorder.remove();
                    judgeScroll();
                }
            }
        });
    }
    //返回所有签到者信息
    var getInformation = function () {
        $.ajax({
            url: baseURL + '/room/signed',
            type: 'get',
            statusCode: {
                200: function (data) {
                    $roomContainer.html("");
                    // var numberUnder = 1;
                    if (data.length === 0){
                        $roomContainer.append(templateHtml['blank']);
                        $roomContainer.append(templateHtml['blank']);
                    }
                    data.forEach(function(element){
                        var allDepartment = '';
                        element.volunteer.forEach(function(depart){
                            allDepartment += `<div class="mdc-chip"><span class="mdc-chip__text">${department[depart]}</span></div>`;
                        })
                        if (element.name.length > 4){
                            element.name = element.name.substring(0,4) + "...";}
                            var beSigned = templateHtml['part'].replace('_name',element.name)
                                               .replace('_number',element.signNumber)
                                               .replace('_sid',element.sid)
                                               .replace('_allDepartment',allDepartment);
                            // numberUnder++;
                            $roomContainer.append(beSigned);
                        })
                }
            }
        });
    }

    var getVague = function (sid) {
        $(".roomBorder").on("click",function () {
            var roomBorder = this;
            var roomVague = $(this).find(".roomVague");
            $(roomVague).show();
            roomVague.on("click",function(event){
                event.stopPropagation();
                $(this).hide();
            });
            $($(roomVague).find(".ok")).on("click",function(){
                confirmCalled(1,sid,roomBorder);      
            });
            $($(roomVague).find(".skip")).on("click",function(){
                confirmCalled(0,sid,roomBorder);
            });
        })
    }



    $wait.on('scroll',function(){
        if ($(this).scrollLeft() === 0) {
            $left.addClass("transparent");
        } 
        else {
            $left.removeClass('transparent')
        }

        if ($(this).scrollLeft() + $bull.width() > $bull[0].scrollWidth) {
            $right.addClass("transparent");
        } else {
            $right.removeClass('transparent');
        }
    })
    $right.on("click",function () {
        scrollLeft = $wait.scrollLeft();
        $wait.scrollLeft(scrollLeft + 680);
    })
    $left.on("click",function () {
        scrollLeft = $wait.scrollLeft();
        $wait.scrollLeft(scrollLeft - 680);
    })


    var roundCall = function (){
        getInformation();
        callMember();  
    }

    var judgeScroll = function(){
        if ($wait.scrollLeft() + $bull.width() >= $bull[0].scrollWidth) {
            $right.addClass("transparent");
        } 
        else {
            $right.removeClass('transparent');
        }   
    }
    getDepartment();
    roundCall();
    judgeScroll();
    setInterval(roundCall, 3000);                  
});



