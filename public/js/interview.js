function Step(pre, next) {
  this.pre = pre
  this.next = next
}

function StepCtl() {
  this.stepNow = 0
  this.steps = []
}

StepCtl.prototype.next = function (number) {
  this.steps[this.stepNow].next(number)
  this.stepNow++
}
StepCtl.prototype.push = function (step) {
  this.steps.push(step)
}
StepCtl.prototype.pre = function () {
  this.steps[this.stepNow].pre()
  this.stepNow--
}
StepCtl.prototype.reStart = function () {
  this.stepNow = 1;
}

function addZero(num) {
  return num < 10 ? '0' + num : num;
}

function Clock(callback, intervalTime) {
  this.min = 0;
  this.sec = 0;
  this.time = "00:00"
  // TODO init Clock
  this.callback = function () {
    this.timeInterval = window.setInterval(function () {
      this.changeTime()
      callback(this.time)
    }.bind(this), intervalTime || 1000)
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
  if (this.sec === 59) {
    this.sec = 0;
    this.min++;
  } else {
    this.sec++;
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
  var clock = new Clock(function (time) {
    $timer[0].innerText = time;
  });

  var departmentInfo = null;
  var departments = []
  var $mdcSelect = $('.mdc-select__menu .mdc-list')
  var $waitNum = $('.tip .waitNum')

  var stepCtl = new StepCtl()
  //login to call
  stepCtl.push(new Step(null, function () {
    intervieweeLogin();
    $loginCard.removeClass('active').addClass('inactive');
    $callCard.removeClass('inactive').addClass('active')
  }))
  //call or call by StaffId & waiting loading
  stepCtl.push(new Step(function () {
    $callCard.find('.waiting').fadeOut()
    $callCard.find('.operation').fadeIn()
  }, function (number) {
    if (number === 0) {
      if ($waitNum[0].innerText === '0') {
        err('暂时无人面试')
        stepCtl.pre()
      } else {
        callNext();
        $callCard.find('.operation').fadeOut(400, function () {
          $callCard.find('.waiting').fadeIn(400)
        })
      }
    } else {
      getStaffId()
    }
  }))
  //loading over and information
  stepCtl.push(new Step(function () {
    getQueueNumber()
    $callCard.find('.waiting').fadeOut(400, function () {
      $callCard.find('.operation').fadeIn(400)
    })
  }, function () {
    $prepareStep.fadeOut(400, function () {
      $commentStep.fadeIn()
    })
  }))
  //start or skip
  stepCtl.push(new Step(function () {
    getQueueNumber()
    $commentStep.fadeOut(400, function () {
      $prepareStep.fadeIn()
    })
  }, function () {
    $commentCard.removeClass('inactive').addClass('active')
    clock.start();
  }))
  //submit
  stepCtl.push(new Step(function () {
    $commentCard.removeClass('active').addClass('inactive')
  }, function () {
    submitComment();
    getQueueNumber();
    $callCard.find('.waiting').fadeOut()
    $callCard.find('.operation').fadeIn()
    clock.clear()
    $commentStep.fadeOut(400, function () {
      $prepareStep.fadeIn()
    })
  }))
  //restart

  // login to call
  $loginCard.find('button').on('click', function () {
    stepCtl.next()
  })

  // call to loading number 0
  $callCard.find('button').on('click', function () {
    stepCtl.next(0)
  })
  //call by staffId number 1
  $callCard.find('.link').on('click', function () {
    stepCtl.next(1)
  })

  // open comment or skip
  $informationCard.find('button.start').on('click', function () {
    if($commentCard.hasClass('active')){
      err('面试已开始')
    } else {
      stepCtl.next()
    }
  })
  $informationCard.find('button.skip').on('click', function () {
    snackConfirm('确认跳过？',null,function () {
      if($commentCard.hasClass('active')){
        stepCtl.pre()
      }
      stepCtl.pre()
      stepCtl.pre()
      skip()
    })
  })

  //submit comment
  $commentCard.find('button.submit').on('click', function () {
    stepCtl.next()
    stepCtl.reStart()
  })

  //获取社团信息
  var getDepartmentInfo = function () {
    $.ajax({
      url: '/club/clubInfo',
      type: 'get',
      statusCode: {
        200: function (data) {
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
      url: '/club/setIdentify',
      type: 'post',
      data: {
        did: Number(did),
        interviewerName: interviewerName
      },
      statusCode: {
        204: function () {
          getQueueNumber(did);
        }
      }
    })
  }


  //获取排队人数
  var getQueueNumber = function () {
    $.ajax({
      url: '/interview/queue',
      type: 'get',
      statusCode: {
        200: function (data) {
          $waitNum[0].innerText = data
        }
      }
    })
  }

  //call by staffId
  var getStaffId = function () {
    var $dialog = $('.mdc-dialog')
    dialog.open();
    $dialog.find('.cancel').on('click', function () {
      dialog.close()
      stepCtl.pre();
    })
    $dialog.find('.ok').on('click', function () {
      var sid = $dialog.find('input')[0].value;
      if((/[0-9]{8}/).test(sid)){
        dialog.close()
        callNext(sid)
      } else {
        err('学号格式有误！请重新输入')
        stepCtl.pre()
      }
    })
  }

  //call or call by staffId
  var callNext = function (sid) {
    var obj = {};
    if (sid) {
      obj = {sid: sid}
    }
    $.ajax({
      url: '/interview/call',
      type: 'get',
      data: obj,
      dataType: 'json',
      statusCode: {
        200: function () {
          waitConfirm();
        },
        403: function () {
          err('该同学未报名');
          stepCtl.pre()
          stepCtl.pre()
        }
      }
    })

  };

  var waitConfirm = function () {
    $.ajax({
      url: '/interview/start',
      type: 'get',
      statusCode: {
        200: function (data) {
          renderComment(data.name, data.major, data.sid, data.notion)
          stepCtl.next()
        },
        403: function () {
          err('此人未确认，已被room跳过');
          stepCtl.pre();
          stepCtl.pre();
        },
        202: function () {
          waitConfirm()
        }
      }
    })
  }

  var renderComment = function (name, specialty, sid, introduction) {
    $informationCard.find('.name')[0].innerText = name || '--';
    $informationCard.find('.specialty')[0].innerText = specialty || '--';
    $informationCard.find('.tags .mdc-chip__text')[0].innerText = sid || '--';
    $informationCard.find('.introduction')[0].innerText = introduction || '--';
  }

  var submitComment = function () {
    var score = slider.value;
    var comment = $commentCard.find('.note textarea')[0].value
    var sid = $informationCard.find('.mdc-chip .mdc-chip__text')[0].innerText;

    if(score === 0){
      err('请先进行评分')
    } else if (comment === ''){
      err('请先进行评论')
    } else {
      $.ajax({
        url: '/interview/rate',
        type: 'post',
        data: {
          sid: sid,
          score: score,
          comment: comment
        },
        statusCode: {
          204: function () {
            success('评论成功，将跳转至叫号页面');
          }
        }
      })
    }
  }

  var skip = function () {
    var sid = $informationCard.find('.mdc-chip .mdc-chip__text')[0].innerText;
    $.ajax({
      url: '/interview/skip',
      type: 'post',
      data: {
        sid: sid,
      }
    })
  }

  getDepartmentInfo()
})
