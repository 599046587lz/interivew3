$(function () {

    var departments = []
    var intervieweesData = []
    var tableBasic = $("#exportBasic tbody");
    var tableMore = $("#exportInterviewers tbody")
    var exportBasic = $("#exportBasic")
    var exportInterviewers = $("#exportInterviewers")

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
                        departments[item.did] = item.name
                        departmentsHtml += `<a class='item department'>${item.name}</a>`
                    })
                }
                $("#departments").prepend(departmentsHtml)
                getDepartmentData()
            }
        })
    }

    var judgeDepart = function (data) {
        for (let i in departments) {
            if (data.indexOf(departments[i]) !== -1) {
                return Number(i)
            }
        }
        if (data.indexOf("所有部门") !== -1) {
            return -1
        }
        return undefined
    }

    var getDepartmentInter = function () {
        var department = $(".department")
        for (let i = 0; i <= departments.length; i++) {
            let depart = department[i]
            let did = judgeDepart(depart.innerHTML)
            if (did === -1) {
                depart.innerHTML = `所有部门(${intervieweesData.length})`
            } else if (did !== undefined) {
                let eles = intervieweesData.filter(function (ele) {
                    if (ele.volunteer.indexOf(did) !== -1) return ele
                })
                depart.innerHTML = `${departments[did]}(${eles.length})`
            }

        }
    }

    var getDepartmentData = function (did) {
        var obj = {
            url: '/club/export',
            type: 'get',
            success: function (data) {
                intervieweesData = data
                addSearch()
                renderTable()
                renderInterviewersTable()
                getDepartmentInter()
            }
        }
        if (!isNaN(+did)) {
            obj.data = {did: did}
            obj.success = function (data) {
                intervieweesData = data
                addSearch()
                renderTable()
                renderInterviewersTable()
            }
        }
        $.ajax(obj);
    }

    var addSearch = function () {
        for (let i in intervieweesData) {
            let ele = intervieweesData[i]
            let data = [ele.name, String(ele.sid), ele.major, ele.email, ele.phone, ele.qq, ele.notion, addRate(ele.rate)]
            intervieweesData[i]["information"] = data.join("#")
        }
    }

    var addRate = function (data) {
        if (!data) {
            return ""
        }
        return data.map(item => `#${departments[item.did]}#${item.score}#${item.comment}#${item.interviewer}`).join('#')

    }

    var renderInterviewers = function (data) {
        if (data.length === 0) {
            return `<td colspan="4">未进行面试</td>>`
        } else {
            data = data[0]
            return `<td>${departments[data.did]}</td><td>${data.score}</td><td>${data.comment}</td><td>${data.interviewer}</td>`
        }
    }

    var renderTable = function (data) {
        tableBasic.html("")
        if (!data) data = intervieweesData
        data = data.map(item => `<tr>
                       <td>${item.sid}</td> 
                       <td>${item.name}</td> 
                       <td>${item.major}</td>
                       <td>${item.email} </td> 
                       <td>${item.phone}</td> 
                       <td>${item.qq} </td> 
                       <td>${item.volunteer.map(item => departments[item])}</td>
                       <td>${item.notion}</td>
                       </tr>`)
        tableBasic.append(data.join(''));
    }

    var renderInterviewersTable = function (data) {
        tableMore.html("")
        if (!data) data = intervieweesData
        data = data.map(item => {
            let rowNumber = item.rate.length || 1
            return `<tr>
                       <td rowspan="${rowNumber}">${item.sid}</td> 
                       <td rowspan="${rowNumber}">${item.name}</td> 
                       <td rowspan="${rowNumber}">${item.volunteer.map(item => departments[item])}</td>
                       ${renderInterviewers(item.rate.slice(0, 1))}
                       </tr>
                        ${item.rate.slice(1).map(item => `<tr><td>${departments[item.did]}</td><td>${item.score}</td><td>${item.comment}</td><td>${item.interviewer}</td></tr>`)}`
        })
        tableMore.append(data.join(''))
    }

    $("#departments").on('click', 'a', function (ev) {
        var did = judgeDepart(this.innerHTML)
        if ($(this).hasClass('department')) {
            $(".department.item.active").removeClass('active')
            $(this).addClass('active')
        }
        if (did !== undefined) {
            if (did === -1) {
                getDepartmentData()
            } else {
                getDepartmentData(did)
            }
        }
    })

    $("#exchange").on('click', function () {
        if (exportBasic.hasClass('hidden')) {
            this.innerHTML = "基本信息"
        } else {
            this.innerHTML = "面试信息"
        }
        exportBasic.toggleClass('hidden')
        exportInterviewers.toggleClass('hidden')
    })

    $("#search").on('input', function () {
        var val = this.value
        var searchData = intervieweesData.filter(function (ele) {
            if (ele.information.indexOf(val) !== -1) {
                return ele
            }
        })
        renderTable(searchData)
        renderInterviewersTable(searchData)
    })

    $('.back').on('click', (function () {
        window.history.back();
    }));

    getDepartmentInfo()

});