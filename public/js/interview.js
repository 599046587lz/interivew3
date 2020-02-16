function Step(pre, next) {
  this.pre = pre
  this.next = next
}

function StepCtl() {
  this.stepNow = 0
  this.steps = []
}
StepCtl.prototype.next = function() {
  this.steps[this.stepNow].next()
  this.stepNow ++
}
StepCtl.prototype.push = function (step) {
  this.steps.push(step)
}
StepCtl.prototype.pre = function () {
  this.steps[this.stepNow].pre()
  this.stepNow --
}

function addZero(num) {
  return num < 10 ? '0' + num : num;
}

function Clock(callback,intervalTime) {
  this.min = 0;
  this.sec = 0;
  this.time = "00:00"
  // TODO init Clock
  this.callback = function() {
    this.timeInterval = window.setInterval(function () {
      this.changeTime()
      callback(this.time)
    }.bind(this),intervalTime || 1000)
  }
}

Clock.prototype.clear = function () {
  this.min = 0;
  this.sec = 0;
  this.time = "00:00";
  // TODO Clock clear
  clearInterval(this.timeInterval);
}

Clock.prototype.changeTime = function () {
  if(this.sec === 59){
    this.sec = 0;
    this.min ++;
  } else {
    this.sec ++;
  }
  this.time = addZero(this.min) + ":" + addZero(this.sec);
}

Clock.prototype.start = function () {
  this.callback();
}
// TODO Clock start



$(function () {
  var $loginCard = $('.login')
  var $callCard = $('.call')
  var $prepareStep = $('.prepareStep')
  var $commentStep = $('.commentStep')
  var $informationCard = $('.information')
  var $commentCard = $('.comment')
  var $timer = $('#timer');
  var clock = new Clock(function (time){
    $timer[0].innerText = time;
  });

  var departmentInfo = null;
  var departments = []
  var $mdcSelect = $('.mdc-select__menu .mdc-list')

  var $waitNum = $('.tip .waitNum')
  var sid = 0;

  var stepCtl = new StepCtl()
  stepCtl.push(new Step(null, function () {
    intervieweeLogin();
    callNext();
    $loginCard.removeClass('active').addClass('inactive');
    $callCard.removeClass('inactive').addClass('active')
  }))
  stepCtl.push(new Step(null, function () {
    $callCard.find('.operation').fadeOut(400, function () {
      $callCard.find('.waiting').fadeIn(400)
    })
  }))
  stepCtl.push(new Step(null, function () {
    $prepareStep.fadeOut(400, function () {
      $commentStep.fadeIn()
    })
  }))
  stepCtl.push(new Step(null, function () {
    $commentCard.removeClass('inactive').addClass('active')
    clock.start();
  }))
  stepCtl.push(new Step(null,function () {
    submitComment();
  }))

  // login to wait to call
  $loginCard.find('button').on('click', function () {
    stepCtl.next()
  })

  // call to loading
  $callCard.find('button').on('click', function () {
    stepCtl.next()
    // setTimeout(function () {
    //   stepCtl.next()
    // }, 2000)
  })

  // open comment
  $informationCard.find('button.start').on('click', function () {
    stepCtl.next()
  })

  //submit comment
  $commentCard.find('button.submit').on('click',function () {
    stepCtl.next()
  })

  //获取社团信息
  var getDepartmentInfo = function () {
    $.ajax({
      url:'/club/clubInfo',
      type:'get',
      statusCode:{
        200 : function (data) {
          departmentInfo = data;
          var departmentsHtml = '';
          departmentInfo.departments.forEach(item => {
            departmentsHtml = departmentsHtml.concat(
                `<li class="mdc-list-item" data-value="${item.name}">${item.name}</li>`)
            departments[item.did] = item.name
          })
          $mdcSelect[0].innerHTML += departmentsHtml;
        }
      }
    })
  }

  var intervieweeLogin = function () {
    var did = departments.indexOf(select.value);
    var interviewerName = $loginCard.find(' .mdc-text-field input')[0].value;
    $.ajax({
      url:'/club/setIdentify',
      type:'post',
      data:{
        did:Number(did),
        interviewerName:interviewerName
      },
      statusCode : {
        204 : function(){
          getQueueNumber(did);
        }}
    })
  }



  //获取排队人数
  var getQueueNumber = function(){
    $.ajax({
      url:'/interview/queue',
      type:'get',
      statusCode:{
        200 : function (data) {
          $waitNum[0].innerText = data
        }
      }
    })
  }

  //call or call by staffId
  var callNext = function (sid) {
    var obj = {};
    if(sid) {
      obj = {
        sid:sid
      }
    }

    $.ajax({
      url:'/interview/call',
      type:'get',
      data:obj,
      dataType:'json',
      statusCode:{
        200 : function (data) {
          sid = data.sid;
          waitConfirm();
        }
      }
    })
  }

  var waitConfirm = function () {
    $.ajax({
      url:'/interview/start',
      type:'get',
      statusCode:{
        200 : function (data) {
          renderComment(data.name,data.major,data.sid,data.notion)
        },
        403 : function () {
          alert('此人未确认，已被room跳过');
        }
      }
    })
  }

  var renderComment = function (name,specialty,sid,introduction) {
    $informationCard.find('.name')[0].innerText = name || '--';
    $informationCard.find('.specialty')[0].innerText = specialty || '--';
    $informationCard.find('.tags .mdc-chip__text')[0].innerText = sid || '--';
    $informationCard.find('.introduction')[0].innerText = introduction || '--';
  }

  var submitComment = function(){
    var score = slider.value;
    var comment = $commentCard.find('.note textarea')[0].value

    $.ajax({
      url:'/interview/rate',
      type:'post',
      data:{
        sid: sid,
        score: score,
        comment: comment
      },
      statusCode:{
        204 : function () {
          alert('评价成功，即将跳转回叫号页面');
        }
      }
    })
  }

  getDepartmentInfo()
})
