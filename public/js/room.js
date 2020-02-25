    var baseURL = '';
    var $addCircle = $("#addCircle");
    var $staffId = $('#staffId');
    var $left = $('#left');
    var $right = $('#right');
    var $wait = $('#wait');
    var $bull = $('.bull');
    var scrollLeft = 0;
    var department = [];
    var interviewRoom = [];
    var ifstaffidCalled = [];

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
    	// 	snackbar.err("请输入正确的学号");
    	// }
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
    var callTemplate = function(){
        var $filt = $(".filt");
        $.ajax({
            url: baseURL + '/room/calling',
            type: 'get',
            statusCode: {
                200: function (data) {
                    var numberTop = 1;
                    if (data.length === 0){
                        $filt.removeClass("disnone");
                    }
                    else{
                        $filt.addClass("disnone");
                    }
                    var room = `<div class="roomBorder">
                        <div>
                        <div class="circleNumber">_numberTop</div>
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
                    data.forEach(function(element){  
                        if (!ifstaffidCalled[element.sid]){
                            var beCalled;
                            beCalled = room.replace('_name',element.name);
                            beCalled = beCalled.replace('_numberTop',numberTop);
                            beCalled = beCalled.replace('_department',department[element.calldid]);
                            beCalled = beCalled.replace('_interviewRoom',interviewRoom[element.calldid]);
                            $wait.append(beCalled);
                            getVague(element.sid);
                            numberTop++;
                            ifstaffidCalled[element.sid] = true;  
                            judge();
                        }
                    })
                }
            }	
        });
    }

    //确认模板
    var confirmTemplate = function(confirm,sid,roomBorder){
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
                    judge();
                }
            }
        });
    }
    //返回所有签到者信息
    var getInformation = function () {
        var $roomContainer = $("#roomContainer");
        $.ajax({
            url: baseURL + '/room/signed',
            type: 'get',
            statusCode: {
                200: function (data) {
                    $roomContainer.html("");
                    var numberUnder = 1;
                    if (data.length === 0){
                    var blank = `<div class="cover blur disblock">
                        <div class="blurry">
                        <div class="skeleton">
                        <div class="avatar"></div>
                        <div class="line"></div>
                        </div>
                        </div>
                        </div>
                        <div class="cover blur disblock">
                        <div class="blurry">
                        <div class="skeleton">
                        <div class="avatar"></div>
                        <div class="line"></div>
                        </div>
                        </div>
                        </div>`;
                    $roomContainer.append(blank);
                    }
                    data.forEach(function(element){
                        var allDepartment = '';
                        element.volunteer.forEach(function(depart){
                            allDepartment += `<div class="mdc-chip"><span class="mdc-chip__text">${department[depart]}</span></div>`;
                        })
                        if (element.name.length > 4){
                            element.name = element.name.substring(0,4) + "...";}
                        var part = `
                            <div class="cover">
                            <span>
                            <div class="circleNumber">${numberUnder}</div>
                            <span class="name">${element.name}</span>
                            <span class="stdNumber">${element.sid}</span>
                            </span>
                            <div class="mdc-chip-set">` +allDepartment
                            +`</div>
                            </div>`;
                        numberUnder++;
                        $roomContainer.append(part);
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
        	$(".roomVague").on("click",function(event){
                event.stopPropagation();
                $(this).hide();
            });
            $($(roomVague).find(".ok")).on("click",function(){
                confirmTemplate(1,sid,roomBorder);      
            });
        	$($(roomVague).find(".skip")).on("click",function(){
                confirmTemplate(0,sid,roomBorder);
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


    var toShow = function (){
        getInformation();
        callTemplate();  
    }

    var judge = function(){
        if ($wait.scrollLeft() + $bull.width() >= $bull[0].scrollWidth) {
            $right.addClass("transparent");
        } 
        else {
            $right.removeClass('transparent');
        }   
    }

    $(function () {
        getDepartment();
        toShow();
        judge();
        setInterval(toShow, 3000);                  
    });



