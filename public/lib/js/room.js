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
        var name = "好好学习天天向上";
        if (name.length > 4){
            name = name.substring(0,4) + "...";
        }
        var part = `<div class="cover">
                        <span>
                            <div class="circleNumber">${number}</div>
                            <span class="name">${name}</span>
                            <span class="stdNumber">${$staffId.val()}</span>
                        </span>
                        <div class="mdc-chip-set">
                            <div class="mdc-chip"><span class="mdc-chip__text">技术部</span></div>
                            <div class="mdc-chip" ><span class="mdc-chip__text">媒体运营部</span></div>
                            <div class="mdc-chip"><span class="mdc-chip__text">媒体运营部</span></div>
                        </div>
                    </div>`;
        number++;
        $("#roomContainer").append(part);
        $staffId.val("input staff id");
    })

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
            roomBorder.remove();
        });
        $(".skip").on("click",function(){
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

