    var number = 2;
    document.getElementById("left").onclick = function() {stepLeft();}
    document.getElementById("right").onclick = function() {stepRight();}
    document.getElementById("addCircle").onclick = function() {add();}
    document.getElementById("member2").onclick = function() {back();}
    document.getElementById("check2").onclick = function() {addReturn();}
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
        var roomContainer = document.createElement("div");
        roomContainer.className = "roomContainer";
        var cover= document.createElement("div");
        cover.className = "cover";
        roomContainer.appendChild(cover);
        var cirleNumber = document.createElement("div");
        cirleNumber.className = "cirleNumber";
        cover.appendChild(cirleNumber);
        var spanNumber = document.createElement("span");
        spanNumber.innerHTML = number;
        if (number<10)
            spanNumber.className = "spanCircle";
        else spanNumber.className = "spanTen";
        number++;
        cirleNumber.appendChild(spanNumber);
        var interviewee = document.createElement("div");
        interviewee.className = "interviewee";
        var stdName = document.createElement("span");
        stdName.innerHTML = "Jerry";
        stdName.className = "stdName";
        var stdNumber = document.createElement("span");
        stdNumber.innerHTML = staffid;
        stdNumber.className = "stdNumber";
        interviewee.appendChild(stdName);
        interviewee.appendChild(stdNumber);
        cover.appendChild(interviewee);
        var leftDepartment = document.createElement("div");
        leftDepartment.className = "leftDepartment";
        leftDepartment.innerHTML = "设计部";
        cover.appendChild(leftDepartment);
        var rightDepartment = document.createElement("div");
        rightDepartment.className = "rightDepartment";
        rightDepartment.innerHTML = "媒体运营部";
        cover.appendChild(rightDepartment);
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
        var roomVague = document.createElement("div");
        roomVague.className = "roomVague";
        roomVague.style.display = "block";
        var p1 = document.createElement("p");
        p1.className = "p1";
        p1.innerHTML = "you need go to";
        roomVague.appendChild(p1);
        var p2 = document.createElement("p");
        p2.className = "p2";
        p2.innerHTML = "210 room";
        roomVague.appendChild(p2);
        var skip = document.createElement("div");
        skip.className = "skip";
        skip.innerHTML = "skip";
        roomVague.appendChild(skip);
        skip.onclick = function(){
            var k = confirm("确定取消此人吗");
            if (k == true)
                objFather.remove();
        }
        var ok = document.createElement("div");
        ok.className = "ok";
        ok.innerHTML = "ok";
        ok.onclick = function(){
            var k = confirm("确定让此人吗");
            if (k == true)
                objFather.remove();
        }
        roomVague.appendChild(ok);
        roomVague.onclick = function(){
            roomVague.remove();
        }
        var objFather = obj.parentNode;
        objFather.appendChild(roomVague);
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
    function stepRight()
    {
        var scrollLeft = document.getElementById("wait").scrollLeft;    
        // alert(scrollLeft);
        document.getElementById("wait").scrollLeft = scrollLeft + 732;
        scrollLeft += 732;
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
        // alert(scrollLeft);
        document.getElementById("wait").scrollLeft = scrollLeft - 732;
        scrollLeft -= 732;
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