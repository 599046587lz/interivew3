    var number = 2;
    document.getElementById("leftt").onclick = function() {step_left();}
    document.getElementById("rightt").onclick = function() {step_right();}
    document.getElementById("room_circle").onclick = function() {add();}
    document.getElementById("member2").onclick = function() {back();}
    document.getElementById("check2").onclick = function() {add_return();}
    function add()
    {
        var room_circle = document.getElementById('room_circle');
        var room_add = document.getElementById('room_circle2');
        room_circle.style.display = "none";
        room_add.style.display = "block";
        room_add.style.marginTop = "30px";
    }
    function back()
    {
        var room_circle = document.getElementById('room_circle');
        var room_add = document.getElementById('room_circle2');
        room_circle.style.display = "block";
        room_add.style.display = "none";
    }
    function add_return()
    {
        var room_circle = document.getElementById('room_circle');
        var room_add = document.getElementById('room_circle2');
        var staffid = document.getElementById("staffid").value;
        room_circle.style.display = "block";
        room_add.style.display = "none";
        var roomContainer = document.createElement("div");
        roomContainer.className = "roomContainer";
        var cover= document.createElement("div");
        cover.className = "cover";
        roomContainer.appendChild(cover);
        var cirleNumber = document.createElement("div");
        cirleNumber.className = "cirleNumber";
        cover.appendChild(cirleNumber);
        var span_number = document.createElement("span");
        span_number.innerHTML = number;
        if (number<10)
            span_number.className = "spanCircle";
        else span_number.className = "span_circle2";
        number++;
        cirleNumber.appendChild(span_number);
        var interviewee = document.createElement("div");
        interviewee.className = "interviewee";
        var span1 = document.createElement("span");
        span1.innerHTML = "Jerry";
        span1.className = "span1";
        var span2 = document.createElement("span");
        span2.innerHTML = staffid;
        span2.className = "span2";
        interviewee.appendChild(span1);
        interviewee.appendChild(span2);
        cover.appendChild(interviewee);
        var department1 = document.createElement("div");
        department1.className = "department1";
        department1.innerHTML = "设计部";
        cover.appendChild(department1);
        var department2 = document.createElement("div");
        department2.className = "department2";
        department2.innerHTML = "媒体运营部";
        cover.appendChild(department2);
        var dier = document.getElementById("dier");
        dier.appendChild(roomContainer);
        var butn = document.createElement("button");
        butn.className = "mdc-button mdc-button--raised submit button btn1";
        butn.innerHTML = "面试";
        butn.onclick = function(){
            up($(this));
        } 
         // cover.appendChild(butn);
     }
     function mohu(obj){
        var room_border_mohu = document.createElement("div");
        room_border_mohu.className = "room_border_mohu";
        room_border_mohu.style.display = "block";
        var p1 = document.createElement("p");
        p1.className = "p1";
        p1.innerHTML = "you need go to";
        room_border_mohu.appendChild(p1);
        var p2 = document.createElement("p");
        p2.className = "p2";
        p2.innerHTML = "210 room";
        room_border_mohu.appendChild(p2);
        var skip = document.createElement("div");
        skip.className = "skip";
        skip.innerHTML = "skip";
        room_border_mohu.appendChild(skip);
        skip.onclick = function(){
            var k = confirm("确定取消此人吗");
            if (k == true)
                obj_father.remove();
        }
        var ok = document.createElement("div");
        ok.className = "ok";
        ok.innerHTML = "ok";
        ok.onclick = function(){
            var k = confirm("确定让此人吗");
            if (k == true)
                obj_father.remove();
        }
        room_border_mohu.appendChild(ok);
        room_border_mohu.onclick = function(){
            room_border_mohu.remove();
        }
        var obj_father = obj.parentNode;
        obj_father.appendChild(room_border_mohu);
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
    function ok(obj)
    {
        var k = confirm("确定让此人面试吗");
        if (k == true)
            obj.parents(".bull").remove();
    }
    function skip(obj)
    {
        var k = confirm("确定取消此人吗");
        if (k == true){
            obj.parents(".bull").remove();
        }
    }
    function step_right()
    {
        var scrollLeft = document.getElementById("wait").scrollLeft;    
        // alert(scrollLeft);
        document.getElementById("wait").scrollLeft = scrollLeft + 732;
        scrollLeft += 732;
        if (scrollLeft <= 0) {
            var a = document.getElementById("leftt");
            a.style.display  = "none";
        }
        else
        {
            var a = document.getElementById("leftt");
            a.style.display  = "block";
        }
        if (scrollLeft > document.getElementById("wait").scrollLeft)
        {
            var b = document.getElementById("rightt");
            b.style.display  = "none";
        }
        else{
            var b = document.getElementById("rightt");
            b.style.display  = "block";
        }
    }
    function step_left()
    {
        var scrollLeft = document.getElementById("wait").scrollLeft;
        // alert(scrollLeft);
        document.getElementById("wait").scrollLeft = scrollLeft - 732;
        scrollLeft -= 732;
        if (scrollLeft <= 0) {
            var a = document.getElementById("leftt");
            a.style.display  = "none";
        }
        else
        {
            var a = document.getElementById("leftt");
            a.style.display  = "block";
        }
        if (scrollLeft < document.getElementById("wait").scrollLeft && scrollLeft >= 0)
        {
            var b = document.getElementById("rightt");
            b.style.display  = "none";
        }
        else{
            var b = document.getElementById("rightt");
            b.style.display  = "block";
        }
    }