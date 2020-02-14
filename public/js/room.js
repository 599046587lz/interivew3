    var baseURL = '';
    var number = 2;
    var $addCircle = $("#addCircle");
    var $staffId = $('#staffId');
    var $left = $('#left');
    var $right = $('#right');
    var $wait = $('#wait');
    var sid;

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
    	if (staffId.value == "input staff id" || staffId.value == ""){
    		err("请输入学号");
    		//alert("请输入学号");
    		return false;
    	}
    	sid = staffId.value;
    	$.ajax({
    		url: baseURL + '/room/sign',
    		type: 'get',
    		data: {
    			sid: sid,
    		},
    		dataType: 'json',
    		statusCode: {      
    			403: function () {
    				err("该学生未报名!");
    				console(error);
    			},
    			200: function () {
    				success("签到成功!");
    				console(data);
    				getinformation();//返回签到者信息
    				if (name.length > 4){
    					name = name.substring(0,4) + "...";
    				}
    				var part = `
    				<div class="cover">
    					<span>
    						<div class="circleNumber">${number}</div>
    						<span class="name">${name}</span>
    						<span class="stdNumber">${sid}</span>
    					</span>
    					<div class="mdc-chip-set">
    						<div class="mdc-chip"><span class="mdc-chip__text">${did}</span></div>
    						<div class="mdc-chip" ><span class="mdc-chip__text">媒体运营部</span></div>
    						<div class="mdc-chip"><span class="mdc-chip__text">媒体运营部</span></div>
    					</div>
    				</div>`;
    				number++;
    				$("#roomContainer").append(part);
                // data: 签到时间(string) ???
            	}
        	}
    	});
    	$staffId.val("input staff id");
    })
    //呼叫模板
    var callTemplate = function(){
    	$.ajax({
        	url: baseURL + '/room/calling',
        	type: 'get',
       		dataType: 'json',
        	statusCode: {
            	200: function () {
	    			var room = `<div class="roomBorder">
                			<div>
                    			<div class="circleNumber">${number}</div>
                    			<div class="name">${name}</div>
                			</div>
                			<div class="mdc-chip-set">
                    			<div class="mdc-chip"><span class="mdc-chip__text">${did}</span></div>
                			</div>
            			</div>`;
            		$wait.append(room);
            	}
        	}
    	});
    }

    //确认模板
    var confirmTemplate = function(){
    	$.ajax({
        	url: baseURL + '/room/confirm',
        	type: 'get',
        	data: {
        		sid: sid,
        		confirm: confirm
        	},
       		dataType: 'json',
    	});
    }
    //返回签到者信息
    var getinformation = function () {
    	$.ajax({
        	url: baseURL + '/room/sighed',
        	type: 'get',
        	dataType: 'json',
        	statusCode: {
            	200: function () {
            		console("成功");
  				}
        	}
    	});
    }
    //返回已完成面试人数
    var getFinishNumber = function () {
    	$.ajax({
        	url: baseURL + '/room/finish',
        	type: 'get',
        	dataType: 'json',
        	statusCode: {
            	200: function () {
            		console(data);
            	}
        	}
    	});
	}


    $(".roomBorder").on("click",function () {
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
        	confirmTemplate();
            roomBorder.remove();
        });
        $(".skip").on("click",function(){
        	confirmTemplate();
            roomBorder.remove();
        });
    })
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



 