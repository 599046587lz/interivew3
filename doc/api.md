 ## common.js里的接口

###  POST    /common/login

**简要描述：** 

- 用户登陆接口

**请求URL：** 
- ` http://127.0.0.1:3001/common/login `
  

**请求方式：**
- POST 

**参数：** 

| 参数名   | 必选 | 类型   | 说明       |
| :------- | :--- | :----- | ---------- |
| user     | 是   | string | 登录用户名 |
| password | 是   | string | 密码       |


 **返回示例**

``` 
 {
  "interviewer": [],   
  "cid": 1,                              cid:社团Id（int)
  "name": "红色家园",                     name:社团名称（string）
  "maxDep": 3,                           maxDep:应试者最多可以选择的部门(int)                 
  "departments": [                       departments:社团介绍(Array)
    {
      "number": 1,                       number:报名该部门的人数(int)
      "did": 0,                          did:部门ID(int)
      "name": "设计部",                   name:部门名称(string)
      "location": "501"                  location:部门面试地点(string)
    },
    {
      "number": 8,
      "did": 1,
      "name": "技术部",
      "location": "502"
    },
    {
      "number": 0,
      "did": 2,
      "name": "推广部",
      "location": "502"
    },
    {
      "number": 0,
      "did": 3,
      "name": "媒体运营部",
      "location": "502"
    },
    {
      "number": 1,
      "did": 4,
      "name": "人力资源部",
      "location": "502"
    }
  ],                                       attentin:注意事项(string)
  "attention": "<p>1.准确日期请关注家园微信服务号「在杭电」</p><p>2.获取后续面试资讯，可以加入家园新生交流QQ群：893339804</p><p>3.家园工作室地址：学生活动中心南201</p><p>4.请如实填写以上信息</p>"      
}
```







###  POST    /common/uploadFile

**简要描述：** 

- 上传头像文件

**请求URL：** 
- `  http://localhost:3001/common/uploadFile`
  

**请求方式：**

- POST 

**参数：** 

| 参数名 | 必选 | 类型   | 说明     |
| :----- | :--- | :----- | -------- |
| file   | 是   | object | 头像文件 |

 **返回示例**

``` 
无
```

  





###  GET    /common/clubInfo?clubId=1


**简要描述：** 

- 报名界面获取社团信息

**请求URL：** 
- ` http://localhost:3001/common/clubInfo?clubId=1 `
  

**请求方式：**
- GET

**参数：** 

| 参数名 | 必选 | 类型 | 说明   |
| :----- | :--- | :--- | ------ |
| clubId | 是   | int  | 社团ID |

 **返回示例**

``` 
  {
  "cid": 1,                              cid:社团Id（int)
  "name": "红色家园",                     name:社团名称（string）
  "maxDep": 3,                           maxDep:应试者最多可以选择的部门(int)                 
  "departments": [                       departments:社团介绍(Array)
    {
      "number": 1,                       number:报名该部门的人数(int)
      "did": 0,                          did:部门ID(int)
      "name": "设计部",                   name:部门名称(string)
      "location": "501"                  location:部门面试地点(string)
    },
    {
      "number": 11,
      "did": 1,
      "name": "技术部",
      "location": "502"
    },
    {
      "number": 0,
      "did": 2,
      "name": "推广部",
      "location": "502"
    },
    {
      "number": 0,
      "did": 3,
      "name": "媒体运营部",
      "location": "502"
    },
    {
      "number": 3,
      "did": 4,
      "name": "人力资源部",
      "location": "502"
    }
  ],                                       attentin:注意事项(string)
  "attention": "<p>1.准确日期请关注家园微信服务号「在杭电」</p><p>2.获取后续面试资讯，可以加入家园新生交流QQ群：893339804</p><p>3.家园工作室地址：学生活动中心南201</p><p>4.请如实填写以上信息</p>"
}
```

  





## club.js里的接口

###  GET    /club/clubInfo

**简要描述：** 

- 社团信息

**请求URL：** 
- ` http://127.0.0.1:3001/club/clubInfo`
  

**请求方式：**
- GET 

**参数：** 

| 参数名 | 必选 | 类型 | 说明 |
| :----- | :--- | :--- | ---- |
| cid    | 是   | int  | 社团 |

 **返回示例**

``` 
 {
  "interviewer": [],
  "cid": 1,                              cid:社团Id（int)
  "name": "红色家园",                     name:社团名称（string）
  "maxDep": 3,                           maxDep:应试者最多可以选择的部门(int)                 
  "departments": [                       departments:社团介绍(Array)
    {
      "number": 1,                       number:报名该部门的人数(int)
      "did": 0,                          did:部门ID(int)
      "name": "设计部",                   name:部门名称(string)
      "location": "501"                  location:部门面试地点(string)
    },
    {
      "number": 8,
      "did": 1,
      "name": "技术部",
      "location": "502"
    },
    {
      "number": 0,
      "did": 2,
      "name": "推广部",
      "location": "502"
    },
    {
      "number": 0,
      "did": 3,
      "name": "媒体运营部",
      "location": "502"
    },
    {
      "number": 1,
      "did": 4,
      "name": "人力资源部",
      "location": "502"
    }
  ],                                       attentin:注意事项(string)
  "attention": "<p>1.准确日期请关注家园微信服务号「在杭电」</p><p>2.获取后续面试资讯，可以加入家园新生交流QQ群：893339804</p><p>3.家园工作室地址：学生活动中心南201</p><p>4.请如实填写以上信息</p>"
}
```







###  POST    /club/upload/location


**简要描述：** 

- 选择要上传的文件

**请求URL：** 
- ` http://127.0.0.1:3001/club/upload/location`
  

**请求方式：**
- POST 

**参数：** 

| 参数名 | 必选 | 类型   | 说明       |
| :----- | :--- | :----- | ---------- |
| info   | 是   | object | 面试者信息 |
| cid    | 是   | int    | 社团ID     |

 **返回示例**

``` 
 无
```

 





###  POST    /club/upload/archive


**简要描述：** 

- 提交文件

**请求URL：** 
- ` http://127.0.0.1:3001/club/upload/archive `
  

**请求方式：**
- POST 

**参数：** 

| 参数名 | 必选 | 类型   | 说明         |
| :----- | :--- | :----- | ------------ |
| file   | 是   | object | 要上传的文件 |
| cid    | 是   | int    | 社团ID       |

 **返回示例**

``` 
   9                  result：上传的面试人数(int)
```

 





## reg.js里的接口

###  POST    /reg

**简要描述：** 

- 注册

**请求URL：** 
- `  http://127.0.0.1:3001/reg`
  

**请求方式：**
- POST 

**参数：** 

| 参数名    | 必选 | 类型   | 说明           |
| :-------- | :--- | :----- | -------------- |
| clubName  | 否   | string | 报名的社团名称 |
| cid       | 是   | int    | 社团ID         |
| name      | 是   | string | 报名者姓名     |
| sid       | 是   | string | 报名者学号     |
| sex       | 是   | int    | 报名者性别     |
| college   | 是   | string | 报名者学院     |
| major     | 是   | string | 报名者专业     |
| volunteer | 是   | int    | 志愿部门       |
| notion    | 是   | string | 个人简介       |
| phone     | 是   | string | 个人电话长号   |
| q q       | 是   | string | qq号           |
| short_tel | 否   | string | 个人电话短号   |
| pic_url   | 是   | string | 个人头像url    |
| email     | 否   | string | 个人邮箱       |


 **返回示例**

``` 
 无
```

 





## room.js里的接口

###  GET    /room/sign

**简要描述：** 

- 签到

**请求URL：** 
- ` http://127.0.0.1:3001/room/sign `
  

**请求方式：**
- GET 

**参数：** 

| 参数名 | 必选 | 类型 | 说明     |
| :----- | :--- | :--- | -------- |
| cid    | 是   | int  | 社团ID   |
| sid    | 是   | int  | 学生学号 |

 **返回示例**

``` 
  无                     info：该学生若已签到返回签到时间，未签到返回空(object)
```

 





###  GET    /room/finish


**简要描述：** 

- 返回已完成面试人数

**请求URL：** 
- `  http://127.0.0.1:3001/room/finish `
  

**请求方式：**
- GET 

**参数：** 

| 参数名 | 必选 | 类型 | 说明   |
| :----- | :--- | :--- | ------ |
| cid    | 是   | int  | 社团ID |


 **返回示例**

``` 
 无                        info:已经结束面试的人数(int)
```

 





###  GET    /room/signed


**简要描述：** 

- 签到者信息

**请求URL：** 
- `  http://127.0.0.1:3001/room/sighed `
  

**请求方式：**
- GET 

**参数：** 

| 参数名 | 必选 | 类型 | 说明   |
| :----- | :--- | :--- | ------ |
| cid    | 是   | int  | 社团ID |


 **返回示例**

``` 
 无                      info:已签到的面试者的信息(object)
```

 





###  GET    /room/calling

**简要描述：** 

- 叫号

**请求URL：** 
- `  http://127.0.0.1:3001/room/calling`
  

**请求方式：**
- GET 

**参数：** 

| 参数名 | 必选 | 类型 | 说明   |
| :----- | :--- | :--- | ------ |
| cid    | 是   | int  | 社团ID |


 **返回示例**

``` 
 无                        info:下一个被叫到的面试者信息(object)
```

 





## interview里的接口

###  GET    /interview/queue

**简要描述：** 

- 面试者排队

**请求URL：** 
- ` http://127.0.0.1:3001/interview/queue `
  

**请求方式：**
- GET

**参数：** 

| 参数名 | 必选 | 类型 | 说明   |
| :----- | :--- | :--- | ------ |
| cid    | 是   | int  | 社团ID |
| did    | 是   | int  | 部门ID |

 **返回示例**

``` 
 无                         result:排队人数(int)
```

  





###  POST    /interview/skip


**简要描述：** 

- 跳过该面试者

**请求URL：** 
- ` http://127.0.0.1:3001/interview/skip `
  

**请求方式：**
- POST 

**参数：** 

| 参数名 | 必选 | 类型 | 说明   |
| :----- | :--- | :--- | ------ |
| sid    | 是   | int  | 学生ID |
| cid    | 是   | int  | 社团ID |
| did    | 是   | int  | 部门ID |

 **返回示例**

``` 
 result                        result:下一个面试者的信息(object)
```

  





###  GET    /interview/call


**简要描述：** 

- 呼叫下一个面试者

**请求URL：** 
- ` http://127.0.0.1:3001/interview/call`
  

**请求方式：**
- GET

**参数：** 

| 参数名 | 必选 | 类型 | 说明       |
| :----- | :--- | :--- | ---------- |
| sid    | 是   | int  | 面试者学号 |


 **返回示例**

``` 
  无                        result:下一个面试者信息(object)
```







###  POST    /interview/rate

**简要描述：** 

- 面试官评价等级

**请求URL：** 
- ` http://127.0.0.1:3001/interview/rate`
  

**请求方式：**
- POST 

**参数：** 

| 参数名  | 必选 | 类型   | 说明       |
| :------ | :--- | :----- | ---------- |
| sid     | 是   | int    | 面试者学号 |
| score   | 是   | int    | 等级分数   |
| comment | 是   | string | 评语       |

 **返回示例**

``` 
  无
```

  





### POST    /interview/recommend


**简要描述：** 

- 推荐

**请求URL：** 
- ` http://127.0.0.1:3001/interview/recommend`
  

**请求方式：**
- POST 

**参数：** 

| 参数名       | 必选 | 类型   | 说明       |
| :----------- | :--- | :----- | ---------- |
| sid          | 是   | int    | 面试者学号 |
| departmentId | 是   | int    | 推荐部门   |
| score        | 是   | int    | 等级       |
| comment      | 是   | string | 评语       |

 **返回示例**

``` 
 无
```

 **返回参数说明** 

| 参数名 | 类型 | 说明 |
| :----- | :--- | ---- |
| 无     | 无   | 无   |