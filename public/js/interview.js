baseURL = '/';

function Step(prev, next) {
  this.prev = prev
  this.next = next
}

function StepCtl() {
  this.stepNow = 0;
  this.steps = []
}

StepCtl.prototype.next = function () {
  this.steps[this.stepNow].next();
  this.stepNow++
}
StepCtl.prototype.push = function (step) {
  this.steps.push(step)
}
StepCtl.prototype.prev = function () {
  this.steps[this.stepNow].prev();
  this.stepNow--
}

function Clock(callback, intervalTime) {
  this.min = 0;
  this.sec = 0;
  this.callback = callback;
  this.intervalTime = intervalTime;
}

Clock.prototype.clear = function () {
  this.min = 0;
  this.sec = 0;
  clearInterval(this.timeInterval);
  this.callback(this.time)
}

Clock.prototype.changeTime = function () {
  if (this.sec === 59) {
    this.sec = 0;
    this.min++;
  } else {
    this.sec++;
  }
}

Clock.prototype.start = function () {
  this.timeInterval = window.setInterval(function () {
    this.changeTime()
    this.callback(this.time)
  }.bind(this), this.intervalTime || 1000)
}

Object.defineProperty(Clock.prototype, 'time', {
  get: function () {
    var min = this.min < 10 ? '0' + this.min : this.min;
    var sec = this.sec < 10 ? '0' + this.sec : this.sec;
    return min + ':' + sec;
  }
})


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
  var slider = null;
  var sliderHasInitialize = false;

  var stepCtl = new StepCtl()
  //login to call
  stepCtl.push(new Step(null, function () {
    $loginCard.removeClass('active').addClass('inactive');
    $callCard.removeClass('inactive').addClass('active')
  }))
  //call or call by StaffId & waiting loading
  stepCtl.push(new Step(function () {
    $callCard.find('.waiting').fadeOut()
    $callCard.find('.operation').fadeIn()
  }, function () {
    $callCard.find('.operation').fadeOut(400, function () {
      $callCard.find('.waiting').fadeIn(400)
    })
  }))
  //loading over and information
  stepCtl.push(new Step(function () {
    $callCard.find('.waiting').fadeOut(400, function () {
      $callCard.find('.operation').fadeIn(400)
    })
  }, function () {
    $prepareStep.fadeOut(400, function () {
      $commentStep.fadeIn()
    })
  }))
  //start or Skip
  stepCtl.push(new Step(function () {
    $commentStep.fadeOut(400, function () {
      $prepareStep.fadeIn()
    })
  }, function () {
    $commentCard.removeClass('inactive').addClass('active')
    clock.start();
    if(!sliderHasInitialize){
      sliderHasInitialize = true;
      setTimeout(function () {
        slider = mdc.slider.MDCSlider.attachTo(document.querySelector('.mdc-slider'));
      },500)
    }
  }))
  //submit
  stepCtl.push(new Step(function () {
    $commentCard.removeClass('active').addClass('inactive')
  }, function () {
    $commentCard.removeClass('active').addClass('inactive')
    $callCard.find('.waiting').fadeOut()
    $callCard.find('.operation').fadeIn()

    $commentStep.fadeOut(400, function () {
      $prepareStep.fadeIn()
    })
    stepCtl.stepNow = 0;
  }))

  // login to call
  $loginCard.find('button').on('click', function () {
    intervieweeLogin();
  })

  // call to loading number 0
  $callCard.find('button').on('click', function () {
    if ($waitNum[0].innerText === '0') {
      snackbar.err('暂时无人面试')
    } else {
      callNext()
    }
  })
  //call by staffId number 1
  $callCard.find('.link').on('click', function () {
    dialog.open()
  })

  // open comment or Skip
  $informationCard.find('button.start').on('click', function () {
    if ($commentCard.hasClass('active')) {
      snackbar.err('面试已开始')
    } else {
      stepCtl.next()
    }
  })
  $informationCard.find('button.skip').on('click', function () {
    snackbar.confirm('确认跳过？', ()=>{}, function () {
      apiSkip()
    })
  })

  //submit comment
  $commentCard.find('button.submit').on('click', function () {
    submitComment();
  })

  //获取社团信息
  var getDepartmentInfo = function () {
    $.ajax({
      url: baseURL + 'club/clubInfo',
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
    var interviewerName = $loginCard.find(' .mdc-text-field input').val();
    $.ajax({
      url: baseURL + 'club/setIdentify',
      type: 'post',
      data: {
        did: Number(did),
        interviewerName: interviewerName
      },
      statusCode: {
        204: function () {
          getQueueNumber();
          stepCtl.next()
        }
      }
    })
  }

  //获取排队人数
  var getQueueNumber = function () {
    $.ajax({
      url: baseURL + 'interview/queue',
      type: 'get',
      statusCode: {
        200: function (data) {
          $waitNum.text(data)
        }
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
      url: baseURL + 'interview/call',
      type: 'get',
      data: obj,
      dataType: 'json',
      statusCode: {
        200: function () {
          waitConfirm();
          stepCtl.next()
        },
        204: function () {
          snackbar.err('暂时无人面试');
          stepCtl.prev()
        },
        403: function (errInfo) {
          snackbar.err(errInfo.responseText);
          stepCtl.prev()
        },
        500: function () {
          snackbar.err('与服务器通讯错误')
          stepCtl.prev()
        }
      }
    })

  };

  var waitConfirm = function () {
    $.ajax({
      url: baseURL + 'interview/start',
      type: 'get',
      statusCode: {
        200: function (data) {
          renderComment(data.name, data.major, data.sid, data.notion)
          stepCtl.next()
        },
        403: function () {
          snackbar.err('此人未确认，已被room跳过');
          stepCtl.prev();
        },
        202: function () {
          waitConfirm()
        }
      }
    })
  }

  var renderComment = function (name, specialty, sid, introduction) {
    $informationCard.find('.name').text(name || '--');
    $informationCard.find('.specialty').text(specialty || '--');
    $informationCard.find('.tags .mdc-chip__text').text(sid || '--');
    $informationCard.find('.introduction').text(introduction || '--');
  }

  var submitComment = function () {
    var score = slider.value;
    var comment = $commentCard.find('.note textarea').val()
    var sid = $informationCard.find('.mdc-chip .mdc-chip__text').text();

    if (score === 0) {
      snackbar.err('请先进行评分')
    } else if (comment === '') {
      snackbar.err('请先进行评论')
    } else {
      $.ajax({
        url: baseURL + 'interview/rate',
        type: 'post',
        data: {
          sid: sid,
          score: score,
          comment: comment
        },
        statusCode: {
          204: function () {
            snackbar.success('评论成功，将跳转至叫号页面');
            clock.clear()
            node.value = '';
            slider.value = 0;
            stepCtl.next()
            getQueueNumber()
          }
        }
      })
    }
  }

  var apiSkip = function () {
    var sid = $informationCard.find('.mdc-chip .mdc-chip__text').text();
    $.ajax({
      url: baseURL + 'interview/skip',
      type: 'post',
      data: {
        sid: sid,
      },
      statusCode:{
        200 : function () {
          getQueueNumber()
          if ($commentCard.hasClass('active')) {
            stepCtl.prev()
          }
          stepCtl.prev()
          stepCtl.prev()
        }
      }
    })
  }

  dialog.init('Input StaffId',function () {
    var sid = dialog.text.value;
    if ((/[0-9]{8}/).test(sid)) {
      callNext(sid)
    } else {
      snackbar.err('学号格式有误！请重新输入')
    }
    dialog.reset()
  },function () {
      stepCtl.prev();
      dialog.reset()
  })

  getDepartmentInfo()

})
