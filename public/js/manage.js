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
  var exportTable = $("#export");
  var $tableContainer = $('.tableContainer')
  var $uploadContainer = $('.uploadContainer')
  var $addFilter = $('#addFilter')
  var filterTemplate = `<div class="mdc-chip" role="row">
                            <div class="mdc-chip__ripple"></div>
                            <span role="gridcell">
                            <span role="button" tabindex="0" class="mdc-chip__text">_filter</span>
                        </span>
                            <span role="gridcell">
                            <i class="material-icons mdc-chip__icon mdc-chip__icon--trailing" tabindex="-1"
                               role="button">cancel</i>
                        </span>
                        </div>`
  var $mdcChipSet = $('.mdc-chip-set')
  const tabBar = mdc.tabBar.MDCTabBar.attachTo(document.querySelector('.mdc-tab-bar'));

  var selectNameChange = {}
  var tab_index = 0;
  var departmentsName = []
  var intervieweesData = []
  var renderData = []
  var searchValue = {}
  var thead = ""
  var isBasic = true

  var getDepartmentInfo = function () {
    var departmentsHtml = ""
    $.ajax({
      url: baseURL + 'club/clubinfo',
      type: 'get',
      statusCode: {
        200: function (data) {
          var departmentsInfo = data.departments
          if (departmentsInfo) {
            departmentsHtml += "<a class='item department active'>所有部门</a>"
            departmentsInfo.forEach(item => {
              departmentsName[item.did] = item.name
              departmentsHtml += `<a class='item department'>${item.name}</a>`
            })
          }
          $("#departments").prepend(departmentsHtml)
          getIntervieweesData()
          $("#download").attr('href', `./common/download?cid=${data.cid}`)
        },
        403: function () {
          relogin()
        }
      }
    })
  }
  //
  // var judgeDepart = function (data) {
  //   for (let i in departmentsName) {
  //     if (data.indexOf(departmentsName[i]) !== -1) {
  //       return Number(i)
  //     }
  //   }
  //   if (data.indexOf("所有部门") !== -1) {
  //     return -1
  //   }
  //   return undefined
  // }
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

  var getIntervieweesData = function () {
    var obj = {
      url: baseURL + 'club/export',
      type: 'post',
      contentType:"application/json",
      success: function (data) {
        intervieweesData = data
        renderData = intervieweesData
        renderTable()
      }
    }
    obj.data = {}
    if (Object.keys(searchValue).length !== 0) {
      obj.data.search = searchValue
    }
    // if (Object.keys(searchValue).length === 0) {
    //   obj.success = function (data) {
    //     intervieweesData = data
    //     renderData = intervieweesData
    //     renderTable()
    //     // getDepartmentInterNumber()
    //   }
    // }
    obj.data = JSON.stringify(obj.data)
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
    $uploadContainer.removeClass('appear')
    $tableContainer.removeClass('disappear')
    exportTable.html("")
    var data = renderData
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

  $('.back').on('click', (function () {
    window.history.back();
  }));

  $("#submit").on('click',function () {
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
      success: function(){
        snackbar.success('修改成功！')
      },
      complete: function () {
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

        if (filetype === "xls" || filetype === "xlsx") {
          $.ajax({
            url: baseURL + "club/upload/archive",
            type: 'post',
            data: data,
            //async: false,
            cache: false,
            processData: false,
            contentType: false,
            success: function (data) {
              snackbar.success("上传文件成功！已成功上传 " + data.count + " 人的信息。");
            },
            error: function () {
              snackbar.err("与服务器通讯失败，请稍后再试！");
            }
          });
        } else {
          snackbar.err("请上传正确的Excel文件，只能上传后缀为'xls'的Excel文件！");
        }
      });
    }
  });

  getDepartmentInfo()

  var change_index = function () {
    switch (tab_index) {
      case 1 :
        isBasic = true;
        renderTable()
        break;
      case 2 :
        isBasic = false;
        renderTable()
        break;
      case 3 :
        $uploadContainer.addClass('appear')
        $tableContainer.addClass('disappear')
        break;
    }
  }

  // const tabs = document.querySelectorAll('.mdc-tab');

  tabBar.listen('MDCTabBar:activated', function (event) {
    tab_index = event.detail.index;
    change_index()
  });

  $addFilter.on('click',function () {
    dialog.open()
  })

  dialog.init('input the filter',function () {
    var searchString = dialog.text.value;
    var field = dialog.select.value;
    var showField =  dialog.select.selectedText_.innerHTML
    var showString = searchString
    if(showField === '报名部门'){
      searchString = departmentsName.indexOf(searchString)
      if(searchString === -1){
        snackbar.err('部门不存在！')
        dialog.reset()
        return
      }
    }
    if(!searchValue[field]){
      searchValue[field] = [searchString];
    } else {
      searchValue[field].push(searchString);
    }
    if(!selectNameChange[showField]){
      selectNameChange[showField] = field
    }
    getIntervieweesData()
    $mdcChipSet.append(filterTemplate.replace('_filter',`${showField}=${showString}`))
    dialog.reset()
  },function () {
    dialog.reset()
  })

  $mdcChipSet.on('click',function (e) {
    if(e.target.classList.contains('material-icons')){
      var $mdcChip = $(e.target).parents('.mdc-chip')
      var conditions = $mdcChip.find('.mdc-chip__text').text().match(/(.*)=(.*)/)
      var showField = conditions[1]
      var condition = conditions[2]
      var searchField = searchValue[selectNameChange[showField]]
      searchField.splice(searchField.indexOf(condition),1)
      $mdcChip.remove()
      getIntervieweesData()
    }
  })
});
