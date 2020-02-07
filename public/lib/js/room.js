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
    left.click(function(){stepLeft();});
    right.click(function(){stepRight();});
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
        // var butn = document.createElement("button");
        // butn.className = "mdc-button mdc-button--raised submit button btn1";
        // butn.innerHTML = "面试";
        // butn.onclick = function(){
        //     up($(this));
        // }
    }
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
    function stepRight()
    {
        var scrollLeft = $("#wait").scrollLeft();
        $("#wait").scrollLeft(scrollLeft + 680);
        scrollLeft += 680;

        left.css("opacity","1");
    }
    function stepLeft()
    {
        var scrollLeft = $("#wait").scrollLeft();
        $("#wait").scrollLeft(scrollLeft - 680);
        right.css("opacity","1");    
    }
