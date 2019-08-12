$(function () {
    var departments = []
    var getDepartmentInfo = function () {
        var departmentsHtml = ""
        $.ajax({
            url: '/club/clubinfo',
            type: 'get',
            statusCode: {
                200: function (data) {
                    var departmentsInfo = data.message.departments
                    if (departmentsInfo) {
                        departmentsHtml += "<a class='item department'>所有部门</a>"
                        departmentsInfo.forEach(item => {
                            departments[item.did] = item.name
                            departmentsHtml += "<a class='item department'>" + item.name + "</a>"
                        })
                    }
                    $("#departments").append(departmentsHtml)
                    changeDepart()
                    exportAll()
                }
            }
        })
    }

    var exchange = function (array) {
        var departmentInfo = []
        array.forEach(function (item,index) {
            departmentInfo[index] = departments[item]
        })
        return departmentInfo
    }

    var changeDepart = function () {
        $(".department.item").click(function (data) {
            var did = departments.indexOf(data.target.innerHTML)
            if(did === -1){
                exportAll()
            } else {
                exportSingle(did)
            }
        })
    }

    var exportAll = function () {
        $.ajax({
            url: '/club/export',
            type: 'get',
            statusCode: {
                200: function (data) {
                    appendData(data)
                }
            }
        });
    };

    var exportSingle = function (did) {
        $.ajax({
            url: '/club/export',
            data: {did: did},
            type: 'get',
            dataType: 'json',
            statusCode: {
                200: function (data) {
                    appendData(data)
                }
            }
        });
    }
    
    var appendData = function (data) {
        var output = "";
        $("#export tbody").html("");
        for (var i in data) {
            if (data[i]) {
                if (data[i].rate != []) {
                    var out = "<tr>\n <td> " + data[i].sid + " </td> <td> " + data[i].name + " </td> <td> "
                        + data[i].major + " </td> <td> " + data[i].email + " </td> <td> " + data[i].phone + " </td> <td> " + data[i].qq + " </td> <td> " + exchange(data[i].volunteer) + " </td> <td> " + data[i].rate.score + " </td> <td>" + data[i].rate.comment + " </td> <td>" + data[i].rate.interviewer + " </td>";
                    output += out;
                }
            }
        }
        $("#export tbody").append(output);
    }
    getDepartmentInfo()
    $('.back').click(function () {
        window.history.back();
    });
});