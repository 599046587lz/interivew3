$(function () {

    var departmentsName = []
    var intervieweesData = []
    var renderData = []
    var searchValue = ""
    var thead = ""
    var isBasic = true
    var exportTable = $("#export");

    function debounce(fun, delay) {
        var id = null
        return function () {
            var that = this
            var args = Array.prototype.slice.call(arguments)
            clearTimeout(id)
            id = setTimeout(function () {
                fun.apply(that, args)
            }, delay)
        }
    }

    var getDepartmentInfo = function () {
        var departmentsHtml = ""
        $.ajax({
            url: '/club/clubinfo',
            type: 'get',
            success: function (data) {
                var departmentsInfo = data.message.departments
                if (departmentsInfo) {
                    departmentsHtml += "<a class='item department active'>所有部门</a>"
                    departmentsInfo.forEach(item => {
                        departmentsName[item.did] = item.name
                        departmentsHtml += `<a class='item department'>${item.name}</a>`
                    })
                }
                $("#departments").prepend(departmentsHtml)
                getDepartmentData()

                $("#download").attr('href',`./common/download?cid=${data.message.cid}`)
            }
        })
    }

    var judgeDepart = function (data) {
        for (let i in departmentsName) {
            if (data.indexOf(departmentsName[i]) !== -1) {
                return Number(i)
            }
        }
        if (data.indexOf("所有部门") !== -1) {
            return -1
        }
        return undefined
    }

    var getDepartmentInterNumber = function () {
        var department = $(".department")
        for (let i = 0; i <= departmentsName.length; i++) {
            let depart = department[i]
            let did = judgeDepart(depart.innerHTML)
            if (did === -1) {
                depart.innerHTML = `所有部门(${intervieweesData.length})`
            } else if (did !== undefined) {
                let eles = intervieweesData.filter(function (ele) {
                    if (ele.volunteer.indexOf(did) !== -1) return ele
                })
                depart.innerHTML = `${departmentsName[did]}(${eles.length})`
            }

        }
    }

    var getDepartmentData = function (did) {
        var obj = {
            url: '/club/export',
            type: 'get',
            success: function (data) {
                intervieweesData = data
                renderData = intervieweesData
                renderTable()
            }
        }
        obj.data = {}
        if(did!==undefined && did !== -1){
            obj.data.did = did
        }
        if(searchValue !== ""){
            obj.data.search = searchValue
        }
        if(did === undefined && searchValue === ""){
            obj.success = function (data) {
                intervieweesData = data
                renderData = intervieweesData
                renderTable()
                getDepartmentInterNumber()
            }
        }
        $.ajax(obj);
    }

    var renderInterviewers = function (data) {
        if (data.length === 0) {
            return `<td colspan="4">未进行面试</td>>`
        } else {
            data = data[0]
            return `<td>${departmentsName[data.did]}</td><td>${data.score}</td><td>${data.comment}</td><td>${data.interviewer}</td>`
        }
    }

    var renderTable = function () {
        exportTable.html("")
        var data = renderData
        if (searchValue !== "") {
            data = renderData.filter(function (ele) {
                if (ele.information.indexOf(searchValue) !== -1) {
                    return ele
                }
            })
        }
        if (isBasic) {
            thead = ` <thead>
                      <tr>
                      <th>学号</th>
                      <th>姓名</th>
                      <th>专业</th>
                      <th>邮箱</th>
                      <th>电话号码</th>
                      <th>qq</th>
                      <th>状态</th>
                      <th>报名部门</th>
                      <th>个人简介</th>
                      </tr>
                      </thead>`
            data = data.map(item => `<tr>
                       <td>${item.sid}</td> 
                       <td>${item.name}</td> 
                       <td>${item.major}</td>
                       <td>${item.email} </td> 
                       <td>${item.phone}</td> 
                       <td>${item.qq} </td> 
                       <td>${item.state}</td>
                       <td>${item.volunteer.map(item => departmentsName[item])}</td>
                       <td>${item.notion}</td>
                       </tr>`)
        } else {
            thead = `<thead>
                     <tr>
                     <th rowspan="2">学号</th>
                     <th rowspan="2">姓名</th>
                     <th rowspan="2">报名部门</th>
                     <th colspan="4">面试详情</th>
                     </tr>
                     <tr>
                     <th>面试部门</th>
                     <th>评分</th>
                     <th>评论</th>
                     <th>面试官</th>
                     </tr>
                     </thead>`
            data = data.map(item => {
                let rowNumber = item.rate.length || 1
                return `<tr>
                       <td rowspan="${rowNumber}">${item.sid}</td> 
                       <td rowspan="${rowNumber}">${item.name}</td> 
                       <td rowspan="${rowNumber}">${item.volunteer.map(item => departmentsName[item])}</td>
                       ${renderInterviewers(item.rate.slice(0, 1))}
                       </tr>
                        ${item.rate.slice(1).map(item => `<tr><td>${departmentsName[item.did]}</td><td>${item.score}</td><td>${item.comment}</td><td>${item.interviewer}</td></tr>`)}`
            })
        }

        exportTable.append(`${thead}<tbody>${data.join('')}</tbody>`);
    }

    $("#departments").on('click', 'a', function () {
        var did = judgeDepart(this.innerHTML)
        if (!$(this).hasClass('department')) {
            return
        }
        $(".department.item.active").removeClass('active')
        $(this).addClass('active')
        getDepartmentData(did)
    })

    $("#exchange").on('click', function () {
        if (isBasic) {
            this.innerHTML = "基本信息"
        } else {
            this.innerHTML = "面试信息"
        }
        isBasic = !isBasic
        renderTable()
    })

    var searchAjax = debounce(function () {
        var did = judgeDepart($(".department.active").html())
        getDepartmentData(did)
    }, 1000)

    $("#search").on('input', function () {
        searchValue = this.value
        searchAjax(searchValue)
    })

    $('.back').on('click', (function () {
        window.history.back();
    }));

    getDepartmentInfo()
    getDepartmentInterNumber()

});
