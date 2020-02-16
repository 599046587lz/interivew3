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
200:
  {
  	cid:社团Id(int),
  	name:社团名称(string),
    maxDep:应试者最多可以选择的部门(int),                 
    departments:社团介绍(Array)[{
    	number:报名该部门的人数(int),
      did:部门ID(int),
      name:部门名称(string),
      location:部门面试地点(string),
    }],
    attention:注意事项(string)
  }
403:
  {
    error：用户名或密码错误
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
200:
  {
     url: 头像文件url
     key: 头像文件名
}
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
  200:
  {
  	cid:社团Id(int),
  	name:社团名称(string),
    maxDep:应试者最多可以选择的部门(int),                 
    departments:社团介绍(Array)[{
    	number:报名该部门的人数(int),
      did:部门ID(int),
      name:部门名称(string),
      location:部门面试地点(string),
    }],
    attention:注意事项(string)
  }
403:
  {
    error:社团未注册
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

无

 **返回示例**

``` 
  200:
  {
  	cid:社团Id(int),
  	name:社团名称(string),
    maxDep:应试者最多可以选择的部门(int),                 
    departments:社团介绍(Array)[{
    	number:报名该部门的人数(int),
      did:部门ID(int),
      name:部门名称(string),
      location:部门面试地点(string),
    }],
    attention:注意事项(string)
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

| 参数名 | 必选 | 类型  | 说明       |
| :----- | :--- | :---- | ---------- |
| info   | 是   | Array | 面试者信息 |

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

 **返回示例**

``` 
 200:
  {
  	 data:上传的面试人数(int)
  }
 403:
  {
     error:上传文件不合法
  }
```

 

### POST   /club/setIdentify

**简要描述：** 

- 面试官登陆

**请求URL：** 
- ` http://127.0.0.1:3001/club/setIdentify `
  

**请求方式：**
- POST

**参数：** 

无


 **返回示例**

``` 
无
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
| sid    | 是   | Int  | 学生学号 |

 **返回示例**

``` 
 200:
  {
  	 data: 签到时间(string)
  }
 403:
  {
     error: 该学生未报名
  }
```

 

###  GET    /room/finish


**简要描述：** 

- 返回已完成面试人数

**请求URL：** 
- `  http://127.0.0.1:3001/room/finish `
  

**请求方式：**
- GET 

**参数：** 

无


 **返回示例**

``` 
 200:
  {
  	 data: 已经结束面试的人数(int)
  }             
```

 

###  GET    /room/signed


**简要描述：** 

- 签到者信息

**请求URL：** 
- `  http://127.0.0.1:3001/room/sighed `
  

**请求方式：**
- GET 

**参数：** 

无


 **返回示例**

``` 
200:
  [{
    name: 面试者姓名(string),
    sex: 面试者性别(int),
    volunteer: 志愿部门(Array),
    notion: 个人简介(string),
    done": 已完成面试的部门(Array),
    busy: 是否正在面试(boolean),
    ifsign: 是否签到(boolean),
    ifcall: 是否被叫号(boolean),
    ifconfirm: 0跳过1确认2等待(int),
    email": 面试者邮箱(string),
    rate": 评价(Array)[{
        did: 部门ID(int),
        score: 面试者分数(int),
        comment: 面试评价(string),
        interviewer: 面试官(string),
    }],
    sid: 面试者学号(int),
    major: 面试者专业(string),
    phone: 面试者长号(string),
    short_tel: 面试者短号(string),
    qq: 面试者qq(string),
    cid: 面试社团(int),
    signTime: 签到时间(string),
    regTime: 注册时间(string)
  }]
```

 

###  GET    /room/calling

**简要描述：** 

- 叫号

**请求URL：** 
- `  http://127.0.0.1:3001/room/calling`
  

**请求方式：**
- GET 

**参数：** 

无


 **返回示例**

``` 
 200:
  [{
    name: 面试者姓名(string),
    sex: 面试者性别(int),
    volunteer: 志愿部门(Array),
    notion: 个人简介(string),
    done": 已完成面试的部门(Array),
    busy: 是否正在面试(boolean),
    ifsign: 是否签到(boolean),
    ifcall: 是否被叫号(boolean),
    ifconfirm: 0跳过1确认2等待(int),
    email": 面试者邮箱(string),
    rate": 评价(Array)[{
        did: 部门ID(int),
        score: 面试者分数(int),
        comment: 面试评价(string),
        interviewer: 面试官(string),
    }],
    sid: 面试者学号(int),
    major: 面试者专业(string),
    phone: 面试者长号(string),
    short_tel: 面试者短号(string),
    qq: 面试者qq(string),
    cid: 面试社团(int),
    signTime: 签到时间(string),
    regTime: 注册时间(string)
  }]
```



### POST    /room/confirm

**简要描述：** 

- 叫到号的同学确认ok/skip

**请求URL：** 
- ` http://127.0.0.1:3001/room/confirm `
  

**请求方式：**
- POST 

**参数：** 

| 参数名  | 必选 | 类型    | 说明    |
| :------ | :--- | :------ | ------- |
| sid     | 是   | int     | 学生ID  |
| confirm | 是   | boolean | ok/skip |

 **返回示例**

``` 
 无
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

| 参数名   | 必选 | 类型   | 说明   |
| :------- | :--- | :----- | ------ |
| username | 是   | string | 用户名 |

 **返回示例**

``` 
200:
  {
  	 data:  排队人数(int)
  }     
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
| sid    | 是   | Int  | 用户名 |

 **返回示例**

``` 
200:
  [{
    name: 面试者姓名(string),
    sex: 面试者性别(int),
    volunteer: 志愿部门(Array),
    notion: 个人简介(string),
    done": 已完成面试的部门(Array),
    busy: 是否正在面试(boolean),
    ifsign: 是否签到(boolean),
    ifcall: 是否被叫号(boolean),
    ifconfirm: 0跳过1确认2等待(int),
    email": 面试者邮箱(string),
    rate": 评价(Array)[{
        did: 部门ID(int),
        score: 面试者分数(int),
        comment: 面试评价(string),
        interviewer: 面试官(string),
    }],
    sid: 面试者学号(int),
    major: 面试者专业(string),
    phone: 面试者长号(string),
    short_tel: 面试者短号(string),
    qq: 面试者qq(string),
    cid: 面试社团(int),
    signTime: 签到时间(string),
    regTime: 注册时间(string)
  }]
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
  200:
  [{
    name: 面试者姓名(string),
    sex: 面试者性别(int),
    volunteer: 志愿部门(Array),
    notion: 个人简介(string),
    done": 已完成面试的部门(Array),
    busy: 是否正在面试(boolean),
    ifsign: 是否签到(boolean),
    ifcall: 是否被叫号(boolean),
    ifconfirm: 0跳过1确认2等待(int),
    email": 面试者邮箱(string),
    rate": 评价(Array)[{
        did: 部门ID(int),
        score: 面试者分数(int),
        comment: 面试评价(string),
        interviewer: 面试官(string),
    }],
    sid: 面试者学号(int),
    major: 面试者专业(string),
    phone: 面试者长号(string),
    short_tel: 面试者短号(string),
    qq: 面试者qq(string),
    cid: 面试社团(int),
    signTime: 签到时间(string),
    regTime: 注册时间(string)
  }]
 403:
  {
     error: 该学生未报名
  }
 500:
  {
     error: 该同学已进行过面试
  }
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



### GET    /interview/start 

**简要描述：** 

- 确认面试是否开始

**请求URL：** 
- ` http://127.0.0.1:3001/interview/start `
  

**请求方式：**
- GET

**参数：** 

无


 **返回示例**

``` 
 200(选择ok)：
 {
    name: 面试者姓名(string),
    sex: 面试者性别(int),
    volunteer: 志愿部门(Array),
    notion: 个人简介(string),
    done": 已完成面试的部门(Array),
    busy: 是否正在面试(boolean),
    ifsign: 是否签到(boolean),
    ifcall: 是否被叫号(boolean),
    ifconfirm: 0跳过1确认2等待(int),
    email": 面试者邮箱(string),
    rate": 评价(Array)[{
        did: 部门ID(int),
        score: 面试者分数(int),
        comment: 面试评价(string),
        interviewer: 面试官(string),
    }],
    sid: 面试者学号(int),
    major: 面试者专业(string),
    phone: 面试者长号(string),
    short_tel: 面试者短号(string),
    qq: 面试者qq(string),
    cid: 面试社团(int),
    signTime: 签到时间(string),
    regTime: 注册时间(string)
  }

  403(选择skip):
  {
      data：该学生跳过
  }
  202(确认等待中):
  {
       data：等待确认中
  }
```