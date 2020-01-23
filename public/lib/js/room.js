    var number = 3;
    var f1 = true;
    var f2 = true;
    var f3 = true;
    function add()
    {
        var a = document.getElementById('room_circle');
        var b = document.getElementById('room_circle2');
        a.style.display = "none";
        b.style.display = "block";
        b.style.marginTop = "30px";
    }
    function add_return()
    {
        var a = document.getElementById('room_circle');
        var b = document.getElementById('room_circle2');
        var h = document.getElementById("staffid").value;
        a.style.display = "block";
        b.style.display = "none";
        var c = document.createElement("div");
        c.className = "room_main2";
        var div2= document.createElement("div");
        div2.className = "room_border2";
        c.appendChild(div2);
        var div3 = document.createElement("div");
        div3.className = "cirle_number";
        div2.appendChild(div3);
        var span1 = document.createElement("span");
        span1.innerHTML = number;
        if (number<10)
            span1.className = "span_circle";
        else span1.className = "span_circle2";
        number++;
        div3.appendChild(span1);
        var div6 = document.createElement("div");
        div6.className = "interviewee";
        var span2 = document.createElement("span");
        span2.innerHTML = "Jerry";
        span2.className = "span1";
        var span3 = document.createElement("span");
        span3.innerHTML = h;
        span3.className = "span2";
        div6.appendChild(span2);
        div6.appendChild(span3);
        div2.appendChild(div6);
        var div4 = document.createElement("div");
        div4.className = "department1";
        div4.innerHTML = "设计部";
        div2.appendChild(div4);
        var div5 = document.createElement("div");
        div5.className = "department2";
        div5.innerHTML = "技术部";
        div2.appendChild(div5);
        // var d = document.getElementById("tianjia");
        //a.parentNode.insertBefore(c, a);
        var hhh = document.getElementById("dier");
        hhh.appendChild(c);
        var butn = document.createElement("button");
        butn.className = "mdc-button mdc-button--raised submit button btn1";
        butn.innerHTML = "面试";
        butn.onclick = function(){
            up($(this));
        } 
        div2.appendChild(butn);
        // alert("添加成功");
    }
    function mohu(obj){
        var divv = document.createElement("div");
        divv.className = "room_border_mohu";
        divv.style.display = "block";
        var p3 = document.createElement("p");
        p3.className = "p1";
        p3.innerHTML = "you need go to";
        divv.appendChild(p3);
        var p4 = document.createElement("p");
        p4.className = "p2";
        p4.innerHTML = "210 room";
        divv.appendChild(p4);
        var divd = document.createElement("div");
        divd.className = "skip";
        divd.innerHTML = "skip";
        divv.appendChild(divd);
        divd.onclick = function(){
            var k = confirm("确定取消此人吗");
            if (k == true)
                aa.remove();
        }
        var dive = document.createElement("div");
        dive.className = "ok";
        dive.innerHTML = "ok";
        dive.onclick = function(){
            var k = confirm("确定让此人吗");
            if (k == true)
                aa.remove();
        }
        divv.appendChild(dive);
        divv.onclick = function(){
            divv.remove();
        }
        var aa = obj.parentNode;
        aa.appendChild(divv);
        // <div class="bull">
            // <div class="room_border" onclick="mohu1()"  id="clear1" >
            // <div class="cirle_number"><span class="span_circle">1</span></div>
            // <span class="span1">Jerry</span>
            // <div class="department">技术部</div>
            // </div>
            // <div class="room_border_mohu"  id="mohu1" onclick="yikai1()">
            // <p class="p1">you need go to </p> 
            // <p class="p2">210 room</p> 
            // <div class="skip" onclick="skip($(this))">skip</div>
            // <div class="ok" onclick="ok($(this))">ok</div>
            // </div>
            // <!-- <div class="kong" style="margin-left: 10px;" id="kong1"></div> -->
            // </div>
        }
        function mohu1()
        {
            var a =document.getElementById("mohu1");
            a.style.display = "block";
        //var b = document.getElementById("clear1");
    }
    function mohu2()
    {
        var a =document.getElementById("mohu2");
        a.style.display = "block";
        //var b = document.getElementById("clear2");
    }
    function mohu3()
    {
        var a =document.getElementById("mohu3");
        a.style.display = "block";
        //var b = document.getElementById("clear3");
    }
    function yikai1()
    {
        var a =document.getElementById("mohu1");
        a.style.display = "none";
    }
    function yikai2()
    {
        var a =document.getElementById("mohu2");
        a.style.display = "none";
    }
    function yikai3()
    {
        var a =document.getElementById("mohu3");
        a.style.display = "none";
    }
    function up(obj)
    {
        var k = confirm("确定让此人面试吗");
        if (k == true){
            obj.parents(".room_main2").remove();
            var divz = document.createElement("div");
            divz.className = "bull";

            var diva = document.createElement("div");
            diva.className = "room_border";
            diva.onclick = function()
            {
                mohu(this);
            }
            divz.appendChild(diva);
            var divb = document.createElement("div");
            divb.className = "cirle_number";
            diva.appendChild(divb);
            var spana = document.createElement("span");
            spana.className = "span_circle";
            spana.innerHTML = "1";
            divb.appendChild(spana);
            var spanb = document.createElement("span");
            spanb.className = "span1";
            spanb.innerHTML = "Jerry";
            diva.appendChild(spanb);
            var divc = document.createElement("div");
            divc.className = "department";
            divc.innerHTML = "技术部";
            diva.appendChild(divc);
            var jj = document.getElementById("wait");
            jj.appendChild(divz);
            // var jj = document.getElementsByClassName("bull_wai");
            // jj.appendChild(divz);
            // var div5 = document.createElement("div");
            // div5.className = "department2";
            // div5.innerHTML = "技术部";
            // div2.appendChild(div5);

            // <div class="bull">
            // <div class="room_border" onclick="mohu1()"  id="clear1" >
            // <div class="cirle_number"><span class="span_circle">1</span></div>
            // <span class="span1">Jerry</span>
            // <div class="department">技术部</div>
            // </div>
            // <div class="room_border_mohu"  id="mohu1" onclick="yikai1()">
            // <p class="p1">you need go to </p> 
            // <p class="p2">210 room</p> 
            // <div class="skip" onclick="skip($(this))">skip</div>
            // <div class="ok" onclick="ok($(this))">ok</div>
            // </div>
            // <!-- <div class="kong" style="margin-left: 10px;" id="kong1"></div> -->
            // </div>
        }
    }
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
         var hh = document.getElementById("wait").scrollLeft;
         document.getElementById("wait").scrollLeft = hh + 732;
    }
    function step_left()
    {
         var hh = document.getElementById("wait").scrollLeft;
         document.getElementById("wait").scrollLeft = hh - 732;
    }