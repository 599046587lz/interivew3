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
        var cover= document.createElement("div");
        cover.className = "cover";
        var cirleNumber = document.createElement("div");
        cirleNumber.className = "cirleNumber";
        cirleNumber.innerHTML = number;
        cover.appendChild(cirleNumber);
        number++;
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
        var mdcset = document.createElement("div");
        mdcset.className = "mdc-chip-set";
        cover.appendChild(mdcset);
        var leftDepartment = document.createElement("div");
        leftDepartment.className = "mdc-chip";
        var spanDepartment = document.createElement("span");
        spanDepartment.className = "mdc-chip__text";
        spanDepartment.innerHTML = "技术部";
        leftDepartment.appendChild(spanDepartment);
        mdcset.appendChild(leftDepartment);
        var rightDepartment = document.createElement("div");
        rightDepartment.className = "mdc-chip";
        var spanDepartmentD = document.createElement("span");
        spanDepartmentD.className = "mdc-chip__text";
        spanDepartmentD.innerHTML = "媒体运营部";
        rightDepartment.appendChild(spanDepartmentD);
        mdcset.appendChild(rightDepartment);
        var container = document.getElementById("container");
        // container.appendChild(roomContainer);
        container.appendChild(cover);
        var butn = document.createElement("button");
        butn.className = "mdc-button mdc-button--raised submit button btn1";
        butn.innerHTML = "面试";
        butn.onclick = function(){
            up($(this));
        } 
     }
     function vague(obj){ 
        var roomVague = document.createElement("div");
        roomVague.className = "roomVague";
        var tip = document.createElement("p");
        tip.className = "tip";
        tip.innerHTML = "you need go to";
        roomVague.appendChild(tip);
        var classRoom = document.createElement("p");
        classRoom.className = "classRoom";
        classRoom.innerHTML = "210 room";
        roomVague.appendChild(classRoom);
        var skip = document.createElement("div");
        skip.className = "skip";
        skip.innerHTML = "skip";
        roomVague.appendChild(skip);
        skip.onclick = function(){
            var k = confirm("确定取消此人吗");
            if (k == true)
                obj.remove();
        }
        var ok = document.createElement("div");
        ok.className = "ok";
        ok.innerHTML = "ok";
        ok.onclick = function(){
            var k = confirm("确定让此人吗");
            if (k == true)
                obj.remove()
        }
        roomVague.appendChild(ok);
        obj.appendChild(roomVague);
        roomVague.onclick = function(){
            event.stopPropagation();
            roomVague.remove();
        }
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