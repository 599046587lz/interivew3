    var number = 2;
    var addCircle = $("#addCircle");
    var submitCircle = $("#submitCircle");
    var left = $("#left");
    var right = $("#right");
    var $staffId = $('#staffId');

   
    addCircle.on('click',function () {
        addCircle.toggleClass('active');
    })

    $(".extra").on('click',function (e) {
        e.stopPropagation()
    })

    $staffId.on('focus',function () {
        if ($staffId.val() === 'input staff id'){
            $staffId.val("")
        }
    })



    $("#done").on('click',function () {
        addCircle.removeClass('active');
        var name = "好好学习天天向上";
        if (name.length > 4)
            name = name.substring(0,4) + "...";
        var part = `<div class="cover">
                        <span>
                            <div class="circleNumber">${number}</div>
                            <span class="stdName">${name}</span>
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
    $(".roomBorder").click(function () {
        var room = `<div class="roomVague">
        <p class="tip">you need to go</p>
        <p class="classRoom">210 room</p>
        <div class="skip" onclick>skip</div>
        <div class="ok">ok</div>
        </div>`;
        $(this).append(room);
        $(".roomVague").on("click",function(event){
            event.stopPropagation();
            this.remove();
        });
        $(".ok").on("click",function(event){
            var roomVague = this.parentNode;
            roomVague.parentNode.remove();
        });
        $(".skip").on("click",function(event){
            var roomVague = this.parentNode;
            roomVague.parentNode.remove();
        });
    })
    left.click(function(){stepLeft();});
    right.click(function(){stepRight();});


    $("#wait").on('scroll',function(e){
        if ($(this).scrollLeft() === 0) {
            alert('到起点了');
            left.css("opacity","0");
        }
        if ($(this).scrollLeft() > $('.roomBorder').width()*11) {
            alert('到最右侧了');
            right.css("opacity","0");

        }
    })
    function stepRight()
    {
        var scrollLeft = $("#wait").scrollLeft();
        $("#wait").scrollLeft(scrollLeft + 680);
        left.css("opacity","1");
    }
    function stepLeft()
    {
        var scrollLeft = $("#wait").scrollLeft();
        $("#wait").scrollLeft(scrollLeft - 680);
        right.css("opacity","1");    
    }
