baseURL = '/';

// $(function () {
// $(".back").click(function () {
//     window.history.back();
// });
//
// //获取clubinfo
// $.ajax({
//     url: baseURL + "club/clubInfo",
//     type: "get",
//     statusCode: {
//         200 : function (data) {
//             $(".clubName").html(data.message.name);
//             var $container = $(".container");
//             var $department = $(".department");
//             var $classroom = $(".classroom");
//             $container.css('height', $container.height() + 35 * data.message.departments.length + 'px');
//             for (var i in data.message.departments) {
//                 $department.append("<input value='" + data.message.departments[i]["name"] + "' readonly/>");
//                 $classroom.append("<input class='room' depart='" + data.message.departments[i]["did"] + "' value='" + data.message.departments[i]["location"] + "' />");
//             }
//         },
//         403 : function () {
//             relogin()
//         }
//     }
// });
//
//
// $("#submit").click(function () {
//     var self = $(this);
//     self.addClass('loading');
//     //提交修改表单
//     var dep = [];
//     $("input.room").each(function () {
//         var depart = $(this).attr("depart");
//         var dId = Number(depart);
//         var room = $(this).val();
//         if (depart && room) dep.push({departmentId: dId, roomLocation: room});
//     });
//     $.ajax({
//         url: baseURL + "club/upload/location",
//         type: "post",
//         data: JSON.stringify({
//             info: dep
//         }),
//         contentType: 'application/json',
//         statusCode: {
//             200: function () {
//                 alert("修改成功!");
//             },
//             204: function () {
//                 alert("修改成功!");
//             },
//             205: function () {
//                 alert("修改成功!");
//             }
//         }, complete: function () {
//             self.removeClass('loading');
//         }
//     });
//
//     //上传文件(有文件时上传文件)
//     var excelName = $('#file').val();
//     var fileTArr = excelName.split(".");
//     //切割出后缀文件名
//     var filetype = fileTArr[fileTArr.length - 1];
//     if (filetype != null && filetype != "") {
//         $(function () {
//             let files = $('#file').prop('files');
//             var data = new FormData();
//             data.append('archive', files[0]);
//
//             if (filetype == "xls" || filetype == "xlsx") {
//                 $.ajax({
//                     url: baseURL + "club/upload/archive",
//                     type: 'post',
//                     data: data,
//                     //async: false,
//                     cache: false,
//                     processData: false,
//                     contentType: false,
//                     success: function (data) {
//
//                         alert("上传文件成功！已成功上传 " + data.count + " 人的信息。");
//                     },
//                     error: function () {
//                         alert("与服务器通讯失败，请稍后再试！");
//                     }
//                 });
//             } else {
//                 alert("请上传正确的Excel文件，只能上传后缀为'xls'的Excel文件！");
//             }
//         });
//     }
// });
//
//
// $("#file").on("click", function (event) {
//     var select = $('#select');
//     select.addClass('loading');
//     if (confirm("上传文件,是否继续？")) {
//         setTimeout(function () {
//             select.removeClass('loading');
//         }, 1500);
//     } else {
//         //取消上传文件关闭inputfile窗口
//         event.preventDefault();
//         setTimeout(function () {
//             select.removeClass('loading');
//         }, 100);
//     }
//     //confirm是同步的 confirm时不能渲染页面
// });
// });

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
    var $tabContainer = $('.tabContainer')

    var getDepartmentInfo = function () {
        var departmentsHtml = ""
        $.ajax({
            url: '/club/clubinfo',
            type: 'get',
            statusCode : {
                200 : function (data) {
                    var departmentsInfo = data.departments
                    if (departmentsInfo) {
                        departmentsHtml += "<a class='item department active'>所有部门</a>"
                        departmentsInfo.forEach(item => {
                            departmentsName[item.did] = item.name
                            departmentsHtml += `<a class='item department'>${item.name}</a>`
                        })
                    }
                    $("#departments").prepend(departmentsHtml)
                    getDepartmentData()

                    $("#download").attr('href',`./common/download?cid=${data.cid}`)
                },
                403 : function () {
                    relogin()
                }
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
    //
    // var getDepartmentInterNumber = function () {
    //     var department = $(".department")
    //     for (let i = 0; i <= departmentsName.length; i++) {
    //         let depart = department[i]
    //         let did = judgeDepart(depart.innerHTML)
    //         if (did === -1) {
    //             depart.innerHTML = `所有部门(${intervieweesData.length})`
    //         } else if (did !== undefined) {
    //             let eles = intervieweesData.filter(function (ele) {
    //                 if (ele.volunteer.indexOf(did) !== -1) return ele
    //             })
    //             depart.innerHTML = `${departmentsName[did]}(${eles.length})`
    //         }
    //
    //     }
    // }

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
                // getDepartmentInterNumber()
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
                      <tr class="mdc-data-table__header-row">
                      <th class="mdc-data-table__header-cell"  role="columnheader" scope="col">学号</th>
                      <th class="mdc-data-table__header-cell"  role="columnheader" scope="col">姓名</th>
                      <th class="mdc-data-table__header-cell"  role="columnheader" scope="col">专业</th>
                      <th class="mdc-data-table__header-cell"  role="columnheader" scope="col">邮箱</th>
                      <th class="mdc-data-table__header-cell"  role="columnheader" scope="col">电话号码</th>
                      <th class="mdc-data-table__header-cell"  role="columnheader" scope="col">qq</th>
                      <th class="mdc-data-table__header-cell"  role="columnheader" scope="col">状态</th>
                      <th class="mdc-data-table__header-cell"  role="columnheader" scope="col">报名部门</th>
                      <th class="mdc-data-table__header-cell"  role="columnheader" scope="col">个人简介</th>
                      <th class="mdc-data-table__header-cell"  role="columnheader" scope="col">报名时间</th>
                      </tr>
                      </thead>`
            data = data.map(item => `<tr class="mdc-data-table__row">
                       <td class="mdc-data-table__cell">${item.sid}</td> 
                       <td class="mdc-data-table__cell">${item.name}</td> 
                       <td class="mdc-data-table__cell">${item.major}</td>
                       <td class="mdc-data-table__cell">${item.email} </td> 
                       <td class="mdc-data-table__cell">${item.phone}</td> 
                       <td class="mdc-data-table__cell">${item.qq} </td> 
                       <td class="mdc-data-table__cell">${item.state}</td>
                       <td class="mdc-data-table__cell">${item.volunteer.map(item => departmentsName[item])}</td>
                       <td class="mdc-data-table__cell">${item.notion}</td>
                       <td class="mdc-data-table__cell">${item.regTime}</td>
                       </tr>`)
        } else {
            thead = `<thead>
                     <tr class="mdc-data-table__header-row">
                     <th class="mdc-data-table__header-cell" rowspan="2">学号</th>
                     <th class="mdc-data-table__header-cell" rowspan="2">姓名</th>
                     <th class="mdc-data-table__header-cell" rowspan="2">报名部门</th>
                     <th class="mdc-data-table__header-cell">面试部门</th>
                     <th class="mdc-data-table__header-cell">评分</th>
                     <th class="mdc-data-table__header-cell">评论</th>
                     <th class="mdc-data-table__header-cell">面试官</th>
                     </tr>
                     </thead>`
            data = data.map(item => {
                let rowNumber = item.rate.length || 1
                return `<tr class="mdc-data-table__row">
                       <td class="mdc-data-table__cell" rowspan="${rowNumber}">${item.sid}</td> 
                       <td class="mdc-data-table__cell" rowspan="${rowNumber}">${item.name}</td> 
                       <td class="mdc-data-table__cell" rowspan="${rowNumber}">${item.volunteer.map(item => departmentsName[item])}</td>
                       ${renderInterviewers(item.rate.slice(0, 1))}
                       </tr>
                        ${item.rate.slice(1).map(item => `<tr class="mdc-data-table__row"><td class="mdc-data-table__cell">${departmentsName[item.did]}</td><td class="mdc-data-table__cell">${item.score}</td><td class="mdc-data-table__cell">${item.comment}</td><td class="mdc-data-table__cell">${item.interviewer}</td></tr>`)}`
            })
        }

        exportTable.append(`${thead}<tbody class="mdc-data-table__content">${data.join('')}</tbody>`);
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

    // $("#exchange").on('click', function () {
    //     if (isBasic) {
    //         this.innerHTML = "基本信息"
    //     } else {
    //         this.innerHTML = "面试信息"
    //     }
    //     isBasic = !isBasic
    //     renderTable()
    // })

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

    var bindSubmit = function(){

        $("#submit").click(function () {
            var self = $(this);
            self.addClass('loading');
            //提交修改表单
            var dep = [];
            $("input.room").each(function () {
                var depart = $(this).attr("depart");
                var dId = Number(depart);
                var room = $(this).val();
                if (depart && room) dep.push({departmentId: dId, roomLocation: room});
            });
            $.ajax({
                url: baseURL + "club/upload/location",
                type: "post",
                data: JSON.stringify({
                    info: dep
                }),
                contentType: 'application/json',
                statusCode: {
                    200: function () {
                        alert("修改成功!");
                    },
                    204: function () {
                        alert("修改成功!");
                    },
                    205: function () {
                        alert("修改成功!");
                    }
                }, complete: function () {
                    self.removeClass('loading');
                }
            });

            //上传文件(有文件时上传文件)
            var excelName = $('#file').val();
            var fileTArr = excelName.split(".");
            //切割出后缀文件名
            var filetype = fileTArr[fileTArr.length - 1];
            if (filetype != null && filetype != "") {
                $(function () {
                    let files = $('#file').prop('files');
                    var data = new FormData();
                    data.append('archive', files[0]);

                    if (filetype == "xls" || filetype == "xlsx") {
                        $.ajax({
                            url: baseURL + "club/upload/archive",
                            type: 'post',
                            data: data,
                            //async: false,
                            cache: false,
                            processData: false,
                            contentType: false,
                            success: function (data) {

                                alert("上传文件成功！已成功上传 " + data.count + " 人的信息。");
                            },
                            error: function () {
                                alert("与服务器通讯失败，请稍后再试！");
                            }
                        });
                    } else {
                        alert("请上传正确的Excel文件，只能上传后缀为'xls'的Excel文件！");
                    }
                });
            }
        });
    }


    var setUpload = function(){
        var uploadHtml = `<div class="container">
                            <div class="clubName"></div>
                            <div class="writeInfo">
                                <div class="department">
                                    <span class="smallCircle"></span>
                                    <span class="title">部门</span>
                                </div>
                                <div class="classroom">
                                    <span class="smallCircle"></span>
                                    <span class="title">教室</span>
                                </div>
                            </div>
                          <div>
                            <span id="select" class="select">
                            <span >选择文件</span>
                              <form enctype="multipart/form-data">
                                <input type="file" name="archive" id="file" accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
                                </form>
                            </span>
                          </div>
                            <div id="submit">提交</div>
                          </div>`
        $tabContainer.html(uploadHtml)
        bindSubmit()
    }


    getDepartmentInfo()
    // getDepartmentInterNumber()

    var change_index = function () {
        switch (tab_index) {
            case 1 :
                isBasic = true;
                renderTable()
                console.log("APPLY")
                break;
            case 2 :
                isBasic = false;
                renderTable()
                console.log("INTERVIEW")
                break;
            case 3 :
                setUpload()
                break;
        }
    }

    const tabBar = mdc.tabBar.MDCTabBar.attachTo(document.querySelector('.mdc-tab-bar'));
    const tabs = document.querySelectorAll('.mdc-tab');
    var tab_index = 0;

    tabBar.listen('MDCTabBar:activated', function(event) {
        tab_index = event.detail.index;
        change_index()
    });

    const chipSetEl = document.querySelector('.mdc-chip-set');
    // const chipSet = new MDCChipSet(chipSetEl);
    // input.addEventListener('keydown', function(event) {
    //     if (event.key === 'Enter' || event.keyCode === 13) {
    //         const chipEl = document.createElement('div');
    //         // ... perform operations to properly populate/decorate chip element ...
    //         chipSetEl.appendChild(chipEl);
    //         chipSet.addChip(chipEl);
    //     }
    // });
    // chipSet.listen('MDCChip:removal', function(event) {
    //     chipSetEl.removeChild(event.detail.root);
    // });

});
