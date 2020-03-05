function SignButton(signMember) {
  var $signButtonHtml = $
  (`<div class="addCircle">
            <div class="addContainer">
                <i class="material-icons">person_add</i>
                <input class="staffId transparent"  type="text" placeholder="input staff id">
                <i class="material-icons transparent done">done</i>
            </div>
        </div>`)
  $('body').append($signButtonHtml);

  $signButtonHtml.on('click', function (event) {
    if (event.target.classList.contains('done')) {
      $(this).removeClass('active');
      var $staffId = $signButtonHtml.find("input");
      var sid = $staffId.val();
      $staffId.val("");
      signMember(sid);
      return;
    }
    if (event.target.classList.contains('material-icons') || event.target.classList.contains('addContainer')) {
      $(this).toggleClass('active');
    }
  })
}

function Queue(rootDom, department, promise) {
  this.body = $('body')
  this.rootDom = rootDom;
  this.newData = [];
  this.queueData = [];
  this.department = department
  this.promise = promise
}

Queue.prototype.render = function (renderTemplate) {
  this.rootDom.find('.blur').addClass('disNone')
  var renderHtml = this.replaceData(renderTemplate)
  this.rootDom.append(renderHtml)
}

Queue.prototype.getData = function () {
  window.setInterval(function () {
    this.promise().then((data) => {
      this.newData = data
    })
    this.deffer()
  }.bind(this), 3000)
}

Queue.prototype.renderSkeleton = function () {
  this.rootDom.find('.blur').removeClass('disNone')
}

Queue.prototype.deffer = function () {
  if (this.newData.length === 0) {
    this.renderSkeleton()
    this.queueData = []
    return
  }
  this.newData.forEach(item => {
    if (!this.queueData.find(function(value){return value.sid === item.sid})) {
      this.render(item)
      this.queueData = this.queueData.concat(item)
    }
  })
  this.queueData.forEach(item => {
    if (!this.newData.find(function(value){return value.sid === item.sid})) {
      var index = this.queueData.indexOf(item)
      this.queueData.splice(index, 1)
      this.removeDom(item)
    }
  })
}

Queue.prototype.removeDom = function (item) {
  this.rootDom.find(`[data-id=${item.sid}]`).remove()
}

function SignedQueue(rootDom, department, promise) {
  Queue.call(this, rootDom, department, promise)
  this.renderTemplate = `<div class="cover" data-id="_sid">
                                <span>
                                    <div class="circleNumber">_number</div>
                                    <span class="name">_name</span>
                                    <span class="stdNumber">_sid</span>
                                </span>
                                    <div class="mdc-chip-set">_allDepartment
                                </div>
                            </div>`
}

SignedQueue.prototype = Object.create(Queue.prototype)
SignedQueue.prototype.constructor = SignedQueue

SignedQueue.prototype.replaceData = function (element) {
  var allDepartment = "";
  element.volunteer.forEach((depart) => {
    allDepartment += `<div class="mdc-chip"><span class="mdc-chip__text">${this.department[depart].name}</span></div>`;
  })
  if (element.name.length > 4) {
    element.name = element.name.substring(0, 4) + "...";
  }
  var beSigned = this.renderTemplate.replace('_name', element.name)
    .replace('_number', element.signNumber)
    .replace(/_sid/g, element.sid)
    .replace('_allDepartment', allDepartment)

  return beSigned
}

function CalledQueue(rootDom, department, promise, confirmCalled) {
  Queue.call(this, rootDom, department, promise)
  this.confirmCalled = confirmCalled
  this.renderTemplate = `<div class="roomBorder" data-id="_sid">
                                <div>
                                    <div class="circleNumber">_number</div>
                                    <div class="name">_name</div>
                                </div>
                                <div class="mdc-chip-set">
                                    <div class="mdc-chip"><span class="mdc-chip__text">_department</span></div>
                                </div>
                                <div class="roomVague">
                                    <div class="tip">you need to go</div>
                                    <div class="classRoom">_interviewRoom</div>
                                    <div class="skip">skip</div>
                                    <div class="ok">ok</div>
                                </div>
                            </div>`
}

CalledQueue.prototype = Object.create(Queue.prototype)
CalledQueue.prototype.constructor = CalledQueue

CalledQueue.prototype.replaceData = function (element) {
  var $render = $(this.renderTemplate.replace('_name', element.name)
    .replace('_sid', element.sid)
    .replace('_number', element.signNumber)
    .replace('_department', this.department[element.calldid].name)
    .replace('_interviewRoom', this.department[element.calldid].location));
  $render.on("click", function (e) {
    var roomBorder = e.currentTarget;
    var $roomVague = $(roomBorder).find(".roomVague");
    var sid = roomBorder.dataset.id
    if (e.target.classList.contains('ok')) {
      this.confirmCalled(1, sid, roomBorder);
      return
    }
    if (e.target.classList.contains('skip')) {
      this.confirmCalled(0, sid, roomBorder);
      return
    }
    if (e.target.classList.contains('classRoom') || e.target.classList.contains('tip') || e.target.classList.contains('roomVague')) {
      $roomVague.hide();
      return;
    }
    $roomVague.show();
  }.bind(this))

  return $render
}

$(function () {
  var baseURL = '';
  var $left = $('#left');
  var $right = $('#right');
  var $wait = $('#wait');
  var $bull = $('.bull');
  var $roomContainer = $("#roomContainer");

  var scrollLeft = 0;
  var department = [];

  var getDepartment = function () {
    $.ajax({
      url: baseURL + '/club/clubInfo',
      type: 'get',
      statusCode: {
        200: function (data) {
          data.departments.forEach(function (element) {
            department[element.did] = {
              name: element.name,
              location: element.location
            }
          })
        }
      }
    });
  }

  //呼叫 返回所有被叫到的人的信息
  var callMember = function () {
    return new Promise(function (resolve) {
      $.ajax({
        url: baseURL + '/room/calling',
        type: 'get',
        statusCode: {
          200: function (data) {
            resolve(data)
          }
        }
      });
    })
  }

  //返回所有签到者信息
  var getInformation =function () {
    return new Promise(function (resolve) {
      $.ajax({
        url: baseURL + '/room/signed',
        type: 'get',
        statusCode: {
          200: function (data) {
            resolve(data)
          }
        }
      });
    })
  }

  //确认
  var confirmCalled = function (confirm, sid, roomBorder) {
    $.ajax({
      url: baseURL + '/room/confirm',
      type: 'post',
      data: JSON.stringify({
        sid: sid,
        confirm: confirm,
      }),
      contentType: "application/json",
      statusCode: {
        200: function () {
          roomBorder.remove();
          judgeScroll();
          snackbar.success('确认成功')
        }
      }
    });
  }

  var signMember = function (sid) {
    $.ajax({
      url: baseURL + '/room/sign',
      type: 'get',
      data: {
        sid: sid,
      },
      dataType: 'json',
      statusCode: {
        403: function () {
          snackbar.err("该学生未报名");
        },
        200: function () {
          snackbar.success("签到成功！");
        },
        204: function () {
          snackbar.err("该学生已签到");
        }
      }
    });
  }

  $wait.on('scroll', function () {
    if ($(this).scrollLeft() === 0) {
      $left.addClass("transparent");
    } else {
      $left.removeClass('transparent')
    }

    if ($(this).scrollLeft() + $bull.width() > $bull[0].scrollWidth) {
      $right.addClass("transparent");
    } else {
      $right.removeClass('transparent');
    }
  })
  $right.on("click", function () {
    scrollLeft = $wait.scrollLeft();
    $wait.scrollLeft(scrollLeft + 680);
  })
  $left.on("click", function () {
    scrollLeft = $wait.scrollLeft();
    $wait.scrollLeft(scrollLeft - 680);
  })

  var judgeScroll = function () {
    if ($wait.scrollLeft() + $bull.width() >= $bull[0].scrollWidth) {
      $right.addClass("transparent");
    } else {
      $right.removeClass('transparent');
    }
  }

  getDepartment();
  judgeScroll();

  new SignButton(signMember);

  var calledQueue = new CalledQueue($wait, department, callMember, confirmCalled)
  var signedQueue = new SignedQueue($roomContainer, department, getInformation)

  calledQueue.getData()
  signedQueue.getData()
});
