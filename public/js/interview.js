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
  var $infomationCard = $('.information')
  var $commentCard = $('.comment')
  var $timer = $('#timer');
  var clock = new Clock(function (time){
    $timer[0].innerText = time;
  });

  var stepCtl = new StepCtl()
  stepCtl.push(new Step(null, function () {
    $loginCard.removeClass('active').addClass('inactive')
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

  // login to wait to call
  $loginCard.find('button').on('click', function () {
    stepCtl.next()
  })

  // call to loading
  $callCard.find('button').on('click', function () {
    stepCtl.next()
    setTimeout(function () {
      stepCtl.next()
    }, 2000)
  })

  // open comment
  $infomationCard.find('button.start').on('click', function () {
    stepCtl.next()
  })
})
