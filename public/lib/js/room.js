    var number = 2;
    var addCircle = $("#addCircle");
    var submitCircle = $("#submitCircle");
    var left = $("#left");
    var right = $("#right");
    addCircle.click(function(){add();});
    left.click(function(){stepLeft();});
    right.click(function(){stepRight();});
    $("#returnMember").click(function(){back();});
    $("#checkAdd").click(function(){addReturn();});
    function add()
    {
        addCircle.css('display','none');
        submitCircle.css('display','block');
    }
    function back()
    {
        addCircle.css('display','block');
        submitCircle.css('display','none');
    }
    function addReturn()
    {
        addCircle.css('display','block');
        submitCircle.css('display','none');
        var part = `<div class="cover">
        <span>
        <div class="circleNumber">${number}</div>
        <span class="stdName">Jerry</span>
        <span class="stdNumber">${$("#staffid").val()}</span>
        </span>
        <div class="mdc-chip-set">
        <div class="mdc-chip">
        <span class="mdc-chip__text">技术部</span>
        </div>
        <div class="mdc-chip" >
        <span class="mdc-chip__text">媒体运营部</span>
        </div>
        <div class="mdc-chip">
        <span class="mdc-chip__text">媒体运营部</span>
        </div>
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
