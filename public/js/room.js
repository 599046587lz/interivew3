    //data + foreach + 模块写好 + 轮询
    var baseURL = '';
    var number = 2;
    var $addCircle = $("#addCircle");
    var $staffId = $('#staffId');
    var $left = $('#left');
    var $right = $('#right');
    var $wait = $('#wait');
    var sid;
    var scrollLeft = 0;
    var department = [];
    var interviewRoom = [];

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
            		console.log(data);
            		var i = 0;
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
    	if (!(/^\d{8}$/.test(staffId.value))){
    		err("请输入正确的学号");
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
    				console.log(error);
    			},
    			204: function (data) {
    				success("签到成功!");
    				// console.log(data);
    				// callTemplate();
    				getinformation();   				
            	}
        	}
    	});
    	$staffId.val("input staff id");
    })
    //呼叫模板 返回所有被叫到的人的信息
    var callTemplate = function(){
    	$.ajax({
        	url: baseURL + '/room/calling',
        	type: 'get',
        	statusCode: {
            	200: function (data) {
            		$wait.html("");
            		console.log(data);
            		data.forEach(function(element){
		   				var room = `<div class="roomBorder">
	                			<div>
	                    			<div class="circleNumber">${number}</div>
	                    			<div class="name">${element.name}</div>
	                			</div>
	                			<div class="mdc-chip-set">
	                				<div class="mdc-chip"><span class="mdc-chip__text">${department[element.rate.did]}</span></div>
	                			</div>
								<div class="roomVague">
 									<div class="tip">you need to go</div>
       								<div class="classRoom">${interviewRoom[element.rate.did]}</div>
        							<div class="skip" onclick>skip</div>
        							<div class="ok">ok</div>
        						</div>
	            			</div>`;
	            		$wait.append(room);
    				})

            	}
        	}	
    	});
    }

    //确认模板
    var confirmTemplate = function(confirm){
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
    //返回所有签到者信息
    var getinformation = function () {
    	$.ajax({
        	url: baseURL + '/room/signed',
        	type: 'get',
        	statusCode: {
            	200: function (data) {
            		$("#roomContainer").html("");
            		number = 1;
            		data.forEach(function(element){
	            			var kk = '';
	            			element.volunteer.forEach(function(depart){
	            				kk += `<div class="mdc-chip"><span class="mdc-chip__text">${department[depart]}</span></div>`;
	            			})
	             			if (element.name.length > 4){
	    					 	element.name = element.name.substring(0,4) + "...";}
	            			var part = `
	    					<div class="cover">
	    					<span>
	    						<div class="circleNumber">${number}</div>
	    						<span class="name">${element.name}</span>
	    						<span class="stdNumber">${element.sid}</span>
	    					</span>
	    					<div class="mdc-chip-set">` +kk
	    					+`</div>
	    					</div>`;
	    					number++;
	    					$("#roomContainer").append(part);
            		})

  				}
        	}
    	});
    }
    //返回已完成面试人数
    var getFinishNumber = function () {
    	$.ajax({
        	url: baseURL + '/room/finish',
        	type: 'get',
        	statusCode: {
            	200: function (data) {
            		console.log(data);
            	}
        	}
    	});
	}


    $(".roomBorder").on("click",function () {
        var roomBorder = this;
        var roomVague = $(this).find(".roomVague");
        // $($(this).find(".roomVague")).show();
        $(roomVague).show();
        $(".roomVague").on("click",function(event){
            event.stopPropagation();
            $(this).hide();
        });
        $($(roomVague).find(".ok")).on("click",function(){
        	confirmTemplate(true);
            roomBorder.remove();
        });
        $($(roomVague).find(".skip")).on("click",function(){
        	confirmTemplate(false);
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

    var toShow = function () {
    getFinishNumber();
    getinformation();
    // callTemplate();
}

    $(function () {
    	getDepartment();
    // toShow();
    // setInterval(toShow, 3000);               

});



 