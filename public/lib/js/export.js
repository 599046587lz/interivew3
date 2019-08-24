$(function () {

    var departments = []
    var table = $("#export tbody");
    var getDepartmentInfo = function () {
        var departmentsHtml = ""
        $.ajax({
            url: '/club/clubinfo',
            type: 'get',
            success: function (data) {
                var departmentsInfo = data.message.departments
                if (departmentsInfo) {
                    departmentsHtml += "<a class='item department'>所有部门</a>"
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
        return -1
    }

    var getDepartmentInter = function (data) {
        var department = $(".department")
        for (let i=0;i<=departments.length;i++) {
            let depart = department[i]
            if (depart.innerHTML.indexOf("所有部门") !== -1) {
                depart.innerHTML = `所有部门(${data.length})`
            } else {
                let did = judgeDepart(depart.innerHTML)
                let eles = data.filter(function (ele) {
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
            success: function (data){
                renderTable(data)
                getDepartmentInter(data)
            }

        }
        if (!isNaN(+did)) {
            obj.data = {did: did}
            obj.success = renderTable
        }
        $.ajax(obj);
    }

    var renderInterviewers = function (data) {
        if (data.length === 0) {
            return `<td colspan="4">未进行面试</td>>`
        } else {
            data = data[0]
            return `<td>${departments[data.did]}</td><td>${data.score}</td><td>${data.comment}</td><td>${data.interviewer}</td>`
        }
    }

    var getRowNumber = function (data) {
        if (data.rate.length === 0) return 1
        else {
            return data.rate.length
        }
    }

    var renderTable = function (data) {
        table.html("")
        data = data.map(item => `<tr>
                       <td rowspan="${getRowNumber(item)}">${item.sid}</td> 
                       <td rowspan="${getRowNumber(item)}">${item.name}</td> 
                       <td rowspan="${getRowNumber(item)}">${item.major}</td>
                       <td rowspan="${getRowNumber(item)}">${item.email} </td> 
                       <td rowspan="${getRowNumber(item)}">${item.phone}</td> 
                       <td rowspan="${getRowNumber(item)}">${item.qq} </td> 
                       <td rowspan="${getRowNumber(item)}">${item.volunteer.map(item => departments[item])}</td>
                       ${renderInterviewers(item.rate.slice(0, 1))}
                       </tr>
                        ${item.rate.slice(1).map(item => `<tr><td>${departments[item.did]}</td><td>${item.score}</td><td>${item.comment}</td><td>${item.interviewer}</td></tr>`)}`)
        table.append(data.join(''));
    }

    $("#departments").on('click', 'a', function (ev) {
        var did = judgeDepart(ev.target.innerHTML)
        if (did === -1) {
            getDepartmentData()
        } else {
            getDepartmentData(did)
        }
    })
    $('.back').on('click', (function () {
        window.history.back();
    }));

    getDepartmentInfo()

});