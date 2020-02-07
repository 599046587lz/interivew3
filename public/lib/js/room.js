    var number = 2;
    var addCircle = $("#addCircle");
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
        var part = `<div class="cover">
                        <span>
                            <div class="circleNumber">${number}</div>
                            <span class="stdName">Jerry</span>
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
        var roomBorder = this;
        $(".roomVague").on("click",function(event){
            event.stopPropagation();
            this.remove();
        });
        $(".ok").on("click",function(){
            roomBorder.remove()
        });
        $(".skip").on("click",function(){
            roomBorder.remove()
        });
    })

    left.click(function(){stepLeft();});
    right.click(function(){stepRight();});

    function stepRight()
    {
        var scrollLeft = $("#wait").scrollLeft();
        $("#wait").scrollLeft(scrollLeft + 680);
        scrollLeft += 680;
        if (scrollLeft <= 0)
            left.css('display','none');
        else
            left.css('display','block');
        if (scrollLeft > $("#wait").scrollLeft())
            right.css('display','none');
        else
            right.css('display','block');
    }
    function stepLeft()
    {
        var scrollLeft = $("#wait").scrollLeft();
        $("#wait").scrollLeft(scrollLeft - 680);
        scrollLeft -= 680;
        if (scrollLeft <= 0)
            left.css('display','none');
        else
            left.css('display','block');
        if (scrollLeft < $("#wait").scrollLeft() && scrollLeft >= 0)
            right.css('display','none');
        else
            right.css('display','block');
    }
