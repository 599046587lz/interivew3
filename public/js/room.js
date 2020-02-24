    //data + foreach + 模块写好 + 轮询
    var baseURL = '';
    var numberTop;
    var numberUnder;
    var $signSuccess = $("#signSuccess");
    var $signError =  $("#signError");
    var $addCircle = $("#addCircle");
    var $staffId = $('#staffId');
    var $left = $('#left');
    var $right = $('#right');
    var $wait = $('#wait');
    var $surface = $(".mdc-snackbar__surface");
    var sid;
    var confirm;
    var $bull = $('.bull');
    var scrollLeft = 0;
    var department = [];
    var interviewRoom = [];
    var bool = [];
    var f = false;
    // const snackbar = mdc.snackbar.MDCSnackbar.attachTo(document.querySelector('.mdc-snackbar'));
    snackbar.timeoutMs = 4000;

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
    	// if (!(/^\d{8}$/.test(staffId.value))){
    	// 	err("请输入正确的学号");
    	// 	return false;
    	// }
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
                    // snackbar.open();
                    // $(".mdc-snackbar__surface").css('background','var(--platform-color-red)');
                    // $surface.addClass("backRed");
                    // $surface.removeClass("backGreen");
                    // $signError.addClass("disBlock");
                    // $signSuccess.removeClass("disBlock");
                    // snackbar.labelText = "该学生未报名";
                    snackbar.err("该学生未报名");

    			},
    			200: function () {
                    // snackbar.open();	
                    // $(".mdc-snackbar__surface").css('background','var(--platform-color-green)');
                    // $surface.addClass("backGreen");
                    // $surface.removeClass("backRed");
                    // $signSuccess.addClass("disBlock");
                    // $signError.removeClass("disBlock");
                    // snackbar.labelText = "签到成功！";
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
    	$.ajax({
        	url: baseURL + '/room/calling',
        	type: 'get',
        	statusCode: {
            	200: function (data) {
            		numberTop = 1;
            		data.forEach(function(element){
            			if (bool[element.sid]){return true;} 
		   				var room = `<div class="roomBorder">
	                			<div>
	                    			<div class="circleNumber">${numberTop}</div>
	                    			<div class="name">${element.name}</div>
	                			</div>
	                			<div class="mdc-chip-set">
	                				<div class="mdc-chip"><span class="mdc-chip__text">${department[element.calldid]}</span></div>
	                			</div>
								<div class="roomVague">
 									<div class="tip">you need to go</div>
       								<div class="classRoom">${interviewRoom[element.calldid]}</div>
        							<div class="skip" onclick>skip</div>
        							<div class="ok">ok</div>
        						</div>
	            			</div>`;
	            		$wait.append(room);
	            		getVague(element.sid);
	            		numberTop++;
	            		bool[element.sid] = true;
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
                200: function (data) {
                    roomBorder.remove();
                    judge();
                }
            }
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
            		numberUnder = 1;
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
	    						<div class="circleNumber">${numberUnder}</div>
	    						<span class="name">${element.name}</span>
	    						<span class="stdNumber">${element.sid}</span>
	    					</span>
	    					<div class="mdc-chip-set">` +kk
	    					+`</div>
	    					</div>`;
	    					numberUnder++;
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
 
	var getVague = function (sid) {
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
        } else {
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

    $(".fork").on('click',function () {
        snackbar.close();
    })

    var toShow = function (){
    	getinformation();
    	callTemplate();  
	}

    var judge = function(){
        if ($wait.scrollLeft() + $bull.width() > $bull[0].scrollWidth) {
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



 