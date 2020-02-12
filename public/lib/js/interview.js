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

function Clock() {
  // TODO init Clock
}
Clock.prototype.clear = function () {
  // TODO Clock clear
}
// TODO Clock start

$(function () {
  var $loginCard = $('.login')
  var $callCard = $('.call')
  var $prepareStep = $('.prepareStep')
  var $commentStep = $('.commentStep')
  var $infomationCard = $('.information')
  var $commentCard = $('.comment')

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
