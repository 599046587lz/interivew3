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
                        departmentsHtml += "<a class='item department'>" + item.name + "</a>"
                    })
                }
                $("#departments").append(departmentsHtml)
                getDepartmentData()
            }
        })
    }

    var getDepartmentData = function (did) {
        var obj = {
            url: '/club/export',
            type: 'get',
            success: renderTable
        }
        if(!isNaN(+did)) {
            obj.data = {did: did}
        }
        $.ajax(obj);
    }

    var renderTable = function (data) {
        table.html("")
        data = data.map(item => `<tr>
                       <td> ${item.sid} </td> 
                       <td>${item.name}</td> 
                       <td>${item.major}</td>
                       <td>${item.email} </td> 
                       <td> ${item.phone}</td> 
                       <td> ${item.qq} </td> 
                       <td>${item.volunteer.map(item => departments[item])}</td>
                       <td>${item.rate.score}</td>
                       <td>${item.rate.comment}</td> 
                       <td>${item.rate.interviewer}</td>
                       </tr>`)
        table.append(data.join(''));
    }

    $("#departments").on('click','a',function (ev) {
        var did = departments.indexOf(ev.target.innerHTML)
        if(did === -1){
            getDepartmentData()
        } else {
            getDepartmentData(did)
        }
    })
    $('.back').on('click',(function () {
        window.history.back();
    }));

    getDepartmentInfo()

});