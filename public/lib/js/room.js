    var number = 2;
    document.getElementById("left").onclick = function() {stepLeft();}
    document.getElementById("right").onclick = function() {stepRight();}
    document.getElementById("addCircle").onclick = function() {add();}
    document.getElementById("returnMember").onclick = function() {back();}
    document.getElementById("checkAdd").onclick = function() {addReturn();}
    function add()
    {
        var addCircle = document.getElementById('addCircle');
        var submitCircle = document.getElementById('submitCircle');
        addCircle.style.display = "none";
        submitCircle.style.display = "block";
        submitCircle.style.marginTop = "30px";
    }
    function back()
    {
        var addCircle = document.getElementById('addCircle');
        var submitCircle = document.getElementById('submitCircle');
        addCircle.style.display = "block";
        submitCircle.style.display = "none";
    }
    function addReturn()
    {
        var addCircle = document.getElementById('addCircle');
        var submitCircle = document.getElementById('submitCircle');
        var staffid = document.getElementById("staffid").value;
        addCircle.style.display = "block";
        submitCircle.style.display = "none";
        var part = `<div class="cover">
        <span>
        <div class="circleNumber">1</div>
        <span class="stdName">Jerry</span>
        <span class="stdNumber">`+staffid+`</span>
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
        $("#roomContainer").append(part);
        // var butn = document.createElement("button");
        // butn.className = "mdc-button mdc-button--raised submit button btn1";
        // butn.innerHTML = "面试";
        // butn.onclick = function(){
        //     up($(this));
        // } 
    }
    function vague(obj){ 
        var room = `<div class="roomVague">
        <p class="tip">you need to go</p>
        <p class="classRoom">210 room</p>
        <div class="skip" onclick>skip</div>
        <div class="ok">ok</div>
        </div>`;
        $(obj).append(room);
        $(".roomVague").on("click",function(){
            event.stopPropagation();
            $(".roomVague").remove();
            // obj.removeChild(obj.querySelector('.roomVague'));
            // obj.removeChild($('roomVague'));
        });
        $(".ok").on("click",function(){
            event.stopPropagation();
            var k = confirm("确定让此人面试吗");
            if (k == true)
                obj.remove();
        });
        $(".skip").on("click",function(){
            event.stopPropagation();
            var k = confirm("确定取消此人吗");
            if (k == true)
                obj.remove();
        });
        // room.click(function(){
        //     alert(23);
        // });

         // skip.onclick = function(){
         //     var k = confirm("确定取消此人吗");
         //     if (k == true)
         //        obj.remove();
         // }
        // var ok = document.createElement("div");
        // ok.className = "ok";
        // ok.innerHTML = "ok";
        // ok.onclick = function(){
        //     var k = confirm("确定让此人吗");
        //     if (k == true)
        //         obj.remove()
        // }
        // roomVague.appendChild(ok);
        // obj.appendChild(roomVague);
        // roomVague.onclick = function(){
        //     event.stopPropagation();
        //     roomVague.remove();
        // }
    }
    // function up(obj)
    // {
    //  var k = confirm("确定让此人面试吗");
    //  if (k == true){
    //      obj.parents(".room_main2").remove();
    //      var divz = document.createElement("div");
    //      divz.className = "bull";

    //      var diva = document.createElement("div");
    //      diva.className = "room_border";
    //      diva.onclick = function()
    //      {
    //          mohu(this);
    //      }
    //      divz.appendChild(diva);
    //      var divb = document.createElement("div");
    //      divb.className = "cirle_number";
    //      diva.appendChild(divb);
    //      var spana = document.createElement("span");
    //      spana.className = "span_circle";
    //      spana.innerHTML = "1";
    //      divb.appendChild(spana);
    //      var spanb = document.createElement("span");
    //      spanb.className = "span1";
    //      spanb.innerHTML = "Jerry";
    //      diva.appendChild(spanb);
    //      var divc = document.createElement("div");
    //      divc.className = "department";
    //      divc.innerHTML = "技术部";
    //      diva.appendChild(divc);
    //      var jj = document.getElementById("wait");
    //      jj.appendChild(divz);
    //      // var jj = document.getElementsByClassName("bull_wai");
    //      // jj.appendChild(divz);
    //      // var div5 = document.createElement("div");
    //      // div5.className = "department2";
    //      // div5.innerHTML = "技术部";
    //      // div2.appendChild(div5);

    //      // <div class="bull">
    //      // <div class="room_border" onclick="mohu1()"  id="clear1" >
    //      // <div class="cirle_number"><span class="span_circle">1</span></div>
    //      // <span class="span1">Jerry</span>
    //      // <div class="department">技术部</div>
    //      // </div>
    //      // <div class="room_border_mohu"  id="mohu1" onclick="yikai1()">
    //      // <p class="p1">you need go to </p> 
    //      // <p class="p2">210 room</p> 
    //      // <div class="skip" onclick="skip($(this))">skip</div>
    //      // <div class="ok" onclick="ok($(this))">ok</div>
    //      // </div>
    //      // <!-- <div class="kong" style="margin-left: 10px;" id="kong1"></div> -->
    //      // </div>
    //  }
    // }
    function stepRight()
    {
        var scrollLeft = document.getElementById("wait").scrollLeft;    
        // alert(scrollLeft);
        document.getElementById("wait").scrollLeft = scrollLeft + 680;
        scrollLeft += 680;
        if (scrollLeft <= 0) {
            var a = document.getElementById("left");
            a.style.display  = "none";
        }
        else
        {
            var a = document.getElementById("left");
            a.style.display  = "block";
        }
        if (scrollLeft > document.getElementById("wait").scrollLeft)
        {
            var b = document.getElementById("right");
            b.style.display  = "none";
        }
        else{
            var b = document.getElementById("right");
            b.style.display  = "block";
        }
    }
    function stepLeft()
    {
        var scrollLeft = document.getElementById("wait").scrollLeft;
        document.getElementById("wait").scrollLeft = scrollLeft - 680;
        scrollLeft -= 680;
        if (scrollLeft <= 0) {
            var a = document.getElementById("left");
            a.style.display  = "none";
        }
        else
        {
            var a = document.getElementById("left");
            a.style.display  = "block";
        }
        if (scrollLeft < document.getElementById("wait").scrollLeft && scrollLeft >= 0)
        {
            var b = document.getElementById("right");
            b.style.display  = "none";
        }
        else{
            var b = document.getElementById("right");
            b.style.display  = "block";
        }
    }