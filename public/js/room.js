    var baseURL = '';
    var number = 2;
    var $addCircle = $("#addCircle");
    var $staffId = $('#staffId');
    var $left = $('#left');
    var $right = $('#right');
    var $wait = $('#wait');

    var scrollLeft = 0;


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

    $("#done").on('click',function () {
        $addCircle.removeClass('active');
        if (!staffId.val()){
        	err("请输入学号");
       		input.focus();
        	return false;
        }
        $.ajax({
        url: baseURL + '/room/sign',
        type: 'get',
        data: {
            sid: sid,
            cid: cid
        },
        dataType: 'json',
        success: function (data) {
            console.log("签到");
            console.log(data);
        },
        statusCode: {      
            403: function () {
                err("该学生未报名!");
            },
            200: function () {
                success("签到成功!");
                // data: 签到时间(string) ???
            }
        }
    });
        if (name.length > 4){
            name = name.substring(0,4) + "...";
        }
        var part = `<div class="cover">
                        <span>
                            <div class="circleNumber">${number}</div>
                            <span class="name">${name}</span>
                            <span class="stdNumber">${sid}</span>
                        </span>
                        <div class="mdc-chip-set">
                            <div class="mdc-chip"><span class="mdc-chip__text">${volunteer}</span></div>
                            <div class="mdc-chip" ><span class="mdc-chip__text">媒体运营部</span></div>
                            <div class="mdc-chip"><span class="mdc-chip__text">媒体运营部</span></div>
                        </div>
                    </div>`;
        number++;
        $("#roomContainer").append(part);
        $staffId.val("input staff id");
    })

    $(".roomBorder").on("click",function () {
    	$.ajax({
        url: baseURL + '/room/calling',
        type: 'get',
        data: {
            cid: cid
        },
        dataType: 'json',
        // success: function (data) {
        //     storage.setItem("calling", JSON.stringify(data.data));
        //     changeCallRow();
        // },
        statusCode: {
            200: function () {
            	name: 面试者姓名(string),
    			sex: 面试者性别(int),
    			volunteer: 志愿部门(Array),
    			notion: 个人简介(string),
    			done: 已完成面试的部门(Array),
    			busy: 是否正在面试(boolean),
    			ifsign: 是否签到(boolean),
    			ifcall: 是否被叫号(boolean),
    			ifconfirm : 是否确认叫号(boolean),
    			ifstart: 是否开始面试(boolean),
    			email: 面试者邮箱(string),
    			rate: 评价(Array)[{
        			did: 部门ID(int),
        			score: 面试者分数(int),
        			comment: 面试评价(string),
        			interviewer: 面试官(string),
    			}],
    			sid: 面试者学号(int),
    			major: 面试者专业(string),
    			phone: 面试者长号(string),
    			short_tel: 面试者短号(string),
    			qq: 面试者qq(string),
    			cid: 面试社团(int),
    			signTime: 签到时间(string),
            }
        }
    });
        var roomBorder = this;
        var room = `<div class="roomVague">
        <div class="tip">you need to go</div>
        <div class="classRoom">210 room</div>
        <div class="skip" onclick>skip</div>
        <div class="ok">ok</div>
        </div>`;
        $(this).append(room);
        $(".roomVague").on("click",function(event){
            event.stopPropagation();
            this.remove();
        });
        $(".ok").on("click",function(){
            roomBorder.remove();
        });
        $(".skip").on("click",function(){
            roomBorder.remove();
        });
    })
    //返回签到者信息
    var getinformation = function () {
    	$.ajax({
        	url: baseURL + '/room/sighed',
        	type: 'get',
        	dataType: 'json',
        	data: {
            	cid: cid
        	},
        	// success: function (data) {
         //    	storage.setItem("interviewed", data.data);
         //    	interviewStatus();
        	// },
        	statusCode: {
            	200: function () {
    				name: 面试者姓名(string),
    				sex: 面试者性别(int),
    				volunteer: 志愿部门(Array),
    				notion: 个人简介(string),
    				done: 已完成面试的部门(Array),
    				busy: 是否正在面试(boolean),
    				ifsign: 是否签到(boolean),
    				ifcall: 是否被叫号(boolean),
    				ifconfirm : 是否确认叫号(boolean),
    				ifstart: 是否开始面试(boolean),
    				email: 面试者邮箱(string),
    				rate: 评价(Array)[{
        				did: 部门ID(int),
        				score: 面试者分数(int),
        				comment: 面试评价(string),
        				interviewer: 面试官(string),
    				}],
    				sid: 面试者学号(int),
    				major: 面试者专业(string),
    				phone: 面试者长号(string),
    				short_tel: 面试者短号(string),
    				qq: 面试者qq(string),
    				cid: 面试社团(int),
    				signTime: 签到时间(string),
  				}
        	}
    	});
    }
    var getFinishNumber = function () {
    	$.ajax({
        	url: baseURL + '/room/finish',
        	type: 'get',
        	dataType: 'json',
        	data: {
            	cid: cid
        	},
        	// success: function (data) {
         //    	storage.setItem("interviewed", data.data);
         //    	interviewStatus();
        	// },
        	statusCode: {
            	200: function () {
            		data: 已经结束面试的人数(int);
            	}
        	}
    	});
	}
    $wait.on('scroll',function(){
        if ($(this).scrollLeft() === 0) {
            $left.addClass("transparent");
        } else {
            $left.removeClass('transparent')
        }
        var $bull = $('.bull');
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

