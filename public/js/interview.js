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

function addZero(num) {
  return num < 10 ? '0' + num : num;
}

function Clock(callback,intervalTime) {
  this.min = '00';
  this.sec = '00';
  this.time = "00:00"
  // TODO init Clock
  this.callback = function() {
    window.setInterval(function () {
      this.changeTime()
      callback.call(this)
    }.bind(this),intervalTime || 1000)
  }
}

Clock.prototype.clear = function () {
  this.min = "00"
  this.sec = "00"
  // TODO Clock clear
  window.clearInterval();
}

Clock.prototype.changeTime = function () {
  if(this.sec === '59'){
    this.sec = '00';
    this.min = addZero(Number(this.min) + 1);
  } else {
    this.sec = addZero(Number(this.sec) + 1);
  }
  this.time = this.min + ":" + this.sec;
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
    var clock = new Clock(function (){
      $timer[0].innerText = this.time;
    });
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
