    var baseURL = '';
    var number = 2;
    var $addCircle = $("#addCircle");
    var $staffId = $('#staffId');
    var $left = $('#left');
    var $right = $('#right');
    var $wait = $('#wait');
    var sid;
    var cid;

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
        if (!staffId){
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
        // success: function (data) {
        //     console.log("签到");
        //     console.log(data);
        // },
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
        // if (name.length > 4){
        //     name = name.substring(0,4) + "...";
        // }
        // var part = `<div class="cover">
        //                 <span>
        //                     <div class="circleNumber">${number}</div>
        //                     <span class="name">${name}</span>
        //                     <span class="stdNumber">${sid}</span>
        //                 </span>
        //                 <div class="mdc-chip-set">
        //                     <div class="mdc-chip"><span class="mdc-chip__text">${volunteer}</span></div>
        //                     <div class="mdc-chip" ><span class="mdc-chip__text">媒体运营部</span></div>
        //                     <div class="mdc-chip"><span class="mdc-chip__text">媒体运营部</span></div>
        //                 </div>
        //             </div>`;
        // number++;
        // $("#roomContainer").append(part);
        // $staffId.val("input staff id");
    })

 