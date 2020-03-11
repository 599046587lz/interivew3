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

    this.refreshData()
}

Queue.prototype.render = function (renderItem) {
    this.rootDom.find('.blur').addClass('disNone')
    var $renderHtml = this.replaceData(renderItem)
    $renderHtml[0].dataset.sid = renderItem.sid;
    this.rootDom.append($renderHtml)
}

Queue.prototype.refreshData = function () {
    this.getData();
    window.setInterval(() => {
        this.getData()
    }, 3000)
}
Queue.prototype.getData = function () {
    this.fetchData().then((data) => {
        this.diff(data)
    }).catch(() => {
        snackbar.err('请重新登录')
        relogin()
    })
}
Queue.prototype.renderSkeleton = function () {
    this.rootDom.find('.blur').removeClass('disNone')
}

Queue.prototype.diff = function (newData) {
    var queueLonger = Boolean(this.queueData.length > newData.length)
    if (newData.length === 0) {
        this.renderSkeleton()
        this.queueData.forEach(item => {
            this.removeDom(item.sid)
        })
        this.queueData = []
        return
    }
    newData.forEach((item) => {
        if (!(this.queueData.find(val => val.sid == item.sid))) {
            this.render(item);
            this.queueData = this.queueData.concat(item)
        }
    })
    this.queueData.forEach((val) => {
        if (!(newData.find(item => item.sid == val.sid))) {
            this.removeDom(val.sid);
        }
    })
}

Queue.prototype.removeDom = function (sid) {
    this.rootDom.find(`[data-sid=${sid}]`).remove();
}

Queue.prototype.replaceData = null; // 需要子类实现
Queue.prototype.fetchData = null; //需要子类实现

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
    return $(this.renderTemplate.replace('_name', element.name)
        .replace('_number', element.signNumber)
        .replace('_sid', element.sid)
        .replace('_allDepartment', allDepartment));
}

SignedQueue.prototype.fetchData = function () {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: '/room/signed',
            type: 'get',
            statusCode: {
                200: function (data) {
                    resolve(data)
                },
                403: function () {
                    reject()
                }
            }
        });
    })
}

function CalledQueue(rootDom, department, renderTemplate) {
    Queue.call(this, rootDom, department)
    this.renderTemplate = renderTemplate
}

CalledQueue.prototype = Object.create(Queue.prototype)
CalledQueue.prototype.constructor = CalledQueue

CalledQueue.prototype.replaceData = function (element) {
    return $(this.renderTemplate.replace('_name', element.name)
        .replace('_number', element.signNumber)
        .replace('_department', this.department[element.calldid].name)
        .replace('_interviewRoom', this.department[element.calldid].location));
}

CalledQueue.prototype.fetchData = function () {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: '/room/calling',
            type: 'get',
            statusCode: {
                200: function (data) {
                    resolve(data)
                },
                403: function () {
                    reject()
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
        called: `<div class="roomBorder">
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
        signed: `<div class="cover">
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
                    calledQueue.removeDom(sid);
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

    $wait.on('click', function (e) {
        var roomBorder = $(e.target).parents('.roomBorder');
        var $roomVague = $(roomBorder).find(".roomVague");
        var sid = roomBorder.data("sid");
        if (e.target.classList.contains('ok')) {
            confirmCalled(1, sid, roomBorder);
            return
        }
        if (e.target.classList.contains('skip')) {
            confirmCalled(0, sid, roomBorder);
            return
        }
        if (e.target.classList.contains('classRoom') || e.target.classList.contains('tip') || e.target.classList.contains('roomVague')) {
            $roomVague.hide();
            return;
        }
        $roomVague.show();
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

    var calledQueue = new CalledQueue($wait, department, templateHtml.called);
    new SignedQueue($roomContainer, department, templateHtml.signed)

});
