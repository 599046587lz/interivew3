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

function Queue(rootDom, department) {
  this.rootDom = rootDom;
  this.queueData = [];
  this.department = department
}

Queue.prototype.render = function (renderItem) {
  this.rootDom.find('.blur').addClass('disNone')
  var $renderHtml = this.replaceData(renderItem)
  $renderHtml[0].dataset.sid = renderItem.sid;
  this.rootDom.append($renderHtml)
}

Queue.prototype.getData = function () {
  window.setInterval(function () {
    this.promise().then((data) => {
      this.diff(data)
    })
  }.bind(this), 3000)
}

Queue.prototype.renderSkeleton = function () {
  this.rootDom.find('.blur').removeClass('disNone')
}

Queue.prototype.diff = function (newData) {
  var queueLonger = true;
  if (newData.length === 0) {
    this.renderSkeleton()
    this.queueData = []
    return
  }
  newData.forEach((item,index) => {
    if(!this.queueData[index]){
      this.render(item);
      this.queueData = this.queueData.concat(item)
      queueLonger = false;
    }
    if(this.queueData[index].sid !== item.sid){
      this.removeDom(this.queueData[index])
      this.render(item)
      this.queueData[index] = item;
    }
  })
  if(queueLonger){
    this.queueData.slice(newData.length).forEach(item => {
      this.removeDom(item)
    })
    this.queueData = this.queueData.slice(0,newData.length)
  }
}

Queue.prototype.removeDom = function (item) {
  this.rootDom.find(`[data-sid=${item.sid}]`).remove()
}

Queue.prototype.replaceData = null; // 需要子类实现
Queue.prototype.promise = null; //需要子类实现

function SignedQueue(rootDom, department, renderTemplate) {
  Queue.call(this, rootDom, department)
  this.renderTemplate = renderTemplate
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
  var $beSigned = $(this.renderTemplate.replace('_name', element.name)
    .replace('_number', element.signNumber)
    .replace('_sid', element.sid)
    .replace('_allDepartment', allDepartment));

  return $beSigned
}

SignedQueue.prototype.promise = function () {
  return new Promise(function (resolve) {
    $.ajax({
      url: '/room/signed',
      type: 'get',
      statusCode: {
        200: function (data) {
          resolve(data)
        }
      }
    });
  })
}

function CalledQueue(rootDom, department, renderTemplate, confirmCalled) {
  Queue.call(this, rootDom, department)
  this.confirmCalled = confirmCalled
  this.renderTemplate = renderTemplate
}

CalledQueue.prototype = Object.create(Queue.prototype)
CalledQueue.prototype.constructor = CalledQueue

CalledQueue.prototype.replaceData = function (element) {
  var $render = $(this.renderTemplate.replace('_name', element.name)
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

CalledQueue.prototype.promise = function () {
  return new Promise(function (resolve) {
    $.ajax({
      url:'/room/calling',
      type: 'get',
      statusCode: {
        200: function (data) {
          resolve(data)
        }
      }
    });
  })
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

  var templateHtml = {
    called : `<div class="roomBorder">
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
                            </div>`,
    signed : `<div class="cover">
                                <span>
                                    <div class="circleNumber">_number</div>
                                    <span class="name">_name</span>
                                    <span class="stdNumber">_sid</span>
                                </span>
                                    <div class="mdc-chip-set">_allDepartment
                                </div>
                            </div>`
  }

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
  // var callMember = function () {
  //   return new Promise(function (resolve) {
  //     $.ajax({
  //       url: baseURL + '/room/calling',
  //       type: 'get',
  //       statusCode: {
  //         200: function (data) {
  //           resolve(data)
  //         }
  //       }
  //     });
  //   })
  // }

  //返回所有签到者信息
  // var getInformation =function () {
  //   return new Promise(function (resolve) {
  //     $.ajax({
  //       url: baseURL + '/room/signed',
  //       type: 'get',
  //       statusCode: {
  //         200: function (data) {
  //           resolve(data)
  //         }
  //       }
  //     });
  //   })
  // }

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

  var calledQueue = new CalledQueue($wait, department, templateHtml.called, confirmCalled)
  var signedQueue = new SignedQueue($roomContainer, department, templateHtml.signed)

  calledQueue.getData()
  signedQueue.getData()
});
