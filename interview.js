/*
 Navicat Premium Data Transfer

 Source Server         : mongo
 Source Server Type    : MongoDB
 Source Server Version : 40003
 Source Host           : localhost:27017
 Source Schema         : interview

 Target Server Type    : MongoDB
 Target Server Version : 40003
 File Encoding         : 65001

 Date: 19/01/2020 22:32:34
*/


// ----------------------------
// Collection structure for clubs
// ----------------------------
db.getCollection("clubs").drop();
db.createCollection("clubs");         //创建一个club集合

// ----------------------------
// Documents of clubs
// ----------------------------
session = db.getMongo().startSession();
session.startTransaction();
db = session.getDatabase("interview");
db.getCollection("clubs").insert([ {
    _id: ObjectId("599fb90606df1710947c3e95"),
    interviewer: [ ],
    cid: NumberInt("1"),
    name: "红色家园",
    password: "202cb962ac59075b964b07152d234b70",
    maxDep: NumberInt("3"),
    departments: [
        {
            number: NumberInt("18"),
            _id: ObjectId("599fb90606df1710947c3e9b"),
            did: NumberInt("0"),
            name: "设计部",
            location: "501"
        },
        {
            number: NumberInt("31"),
            _id: ObjectId("599fb90606df1710947c3e9a"),
            did: NumberInt("1"),
            name: "技术部",
            location: "502"
        },
        {
            number: NumberInt("5"),
            _id: ObjectId("599fb90606df1710947c3e99"),
            did: NumberInt("2"),
            name: "推广部",
            location: "502"
        },
        {
            number: NumberInt("11"),
            _id: ObjectId("599fb90606df1710947c3e98"),
            did: NumberInt("3"),
            name: "媒体运营部",
            location: "502"
        },
        {
            number: NumberInt("7"),
            _id: ObjectId("599fb90606df1710947c3e96"),
            did: NumberInt("4"),
            name: "人力资源部",
            location: "502"
        }
    ],
    attention: "<p>1.准确日期请关注家园微信服务号「在杭电」</p><p>2.获取后续面试资讯，可以加入家园新生交流QQ群：893339804</p><p>3.家园工作室地址：学生活动中心南201</p><p>4.请如实填写以上信息</p>",
    __v: NumberInt("0")
} ]);
db.getCollection("clubs").insert([ {
    _id: ObjectId("5d44f63a0aaaae82880256cd"),
    interviewer: [ ],
    cid: 5,
    name: "杭电之声",
    password: "202cb962ac59075b964b07152d234b70",
    maxDep: 0,
    attention: "<p>1..准确日期请关注杭电之声微信公众号：hduradio（杭电之声广播台）</p><p>2..获取后续面试资讯，可以加入杭电之声新生交流QQ群：707337941</p><p>3.杭电之声工作室地址：学生活动中心南203</p><p>4.请如实填写以上信息</p>",
    departments: [
        {
            number: 7,
            did: 0,
            name: "节目部-娱乐热点",
            _id: "599fb92d06df1710947c3ed4"
        },
        {
            number: 6,
            did: 1,
            name: "节目部-时事新闻",
            _id: "599fb92d06df1710947c3ed3"
        },
        {
            number: 12,
            did: 2,
            name: "节目部-潮流音乐",
            _id: "599fb92d06df1710947c3ed2"
        },
        {
            number: 11,
            did: 3,
            name: "节目部-欧美影剧&英语口语",
            _id: "599fb92d06df1710947c3ed1"
        },
        {
            number: 15,
            did: 4,
            name: "节目部-生活资讯&校园动态",
            _id: "599fb92d06df1710947c3ed0"
        },
        {
            number: 1,
            did: 5,
            name: "节目部-体育赛事",
            _id: "599fb92d06df1710947c3ecf"
        },
        {
            number: 18,
            did: 6,
            name: "节目部-情感调频&治愈声线",
            _id: "599fb92d06df1710947c3ece"
        },
        {
            number: 19,
            did: 7,
            name: "节目部-文字&书籍",
            _id: "599fb92d06df1710947c3ecd"
        },
        {
            number: 17,
            did: 8,
            name: "节目部-旅行&心情&人生",
            _id: "599fb92d06df1710947c3ecc"
        },
        {
            number: 10,
            did: 9,
            name: "节目部-广播剧",
            _id: "599fb92d06df1710947c3ecb"
        },
        {
            number: 3,
            did: 10,
            name: "编辑部-歌曲&心情(乐评",
            _id: "599fb92d06df1710947c3eca"
        },
        {
            number: 1,
            did: 11,
            name: "编辑部-评书&微信",
            _id: "599fb92d06df1710947c3ec9"
        },
        {
            number: 3,
            did: 12,
            name: "编辑部-书籍&诗歌(书评",
            _id: "599fb92d06df1710947c3ec8"
        },
        {
            number: 1,
            did: 13,
            name: "编辑部-小说&故事(广播剧",
            _id: "599fb92d06df1710947c3ec7"
        },
        {
            number: 3,
            did: 14,
            name: "编辑部-人文&情怀",
            _id: "599fb92d06df1710947c3ec6"
        },
        {
            number: 2,
            did: 15,
            name: "编辑部-电影&感悟(影评",
            _id: "599fb92d06df1710947c3ec5"
        },
        {
            number: 0,
            did: 16,
            name: "编辑部-旅行&文艺(游记",
            _id: "599fb92d06df1710947c3ec4"
        },
        {
            number: 1,
            did: 17,
            name: "外联部-赞助洽谈",
            _id: "599fb92d06df1710947c3ec3"
        },
        {
            number: 1,
            did: 18,
            name: "外联部-公关",
            _id: "599fb92d06df1710947c3ec2"
        },
        {
            number: 6,
            did: 19,
            name: "办公室-工作企划",
            _id: "599fb92d06df1710947c3ec1"
        },
        {
            number: 8,
            did: 20,
            name: "办公室-人员编排",
            _id: "599fb92d06df1710947c3ec0"
        },
        {
            number: 4,
            did: 21,
            name: "办公室-档案规",
            _id: "599fb92d06df1710947c3ebf"
        },
        {
            number: 3,
            did: 22,
            name: "办公室-财务管理",
            _id: "599fb92d06df1710947c3ebe"
        },
        {
            number: 14,
            did: 23,
            name: "主持队-高端大气官方",
            _id: "599fb92d06df1710947c3ebd"
        },
        {
            number: 9,
            did: 24,
            name: "主持队-诙谐幽默机智",
            _id: "599fb92d06df1710947c3ebc"
        },
        {
            number: 23,
            did: 25,
            name: "主持队-活泼亲和百搭",
            _id: "599fb92d06df1710947c3ebb"
        },
        {
            number: 3,
            did: 26,
            name: "技术部-节目导播",
            _id: "599fb92d06df1710947c3eba"
        },
        {
            number: 4,
            did: 27,
            name: "技术部-舞台控制",
            _id: "599fb92d06df1710947c3eb9"
        },
        {
            number: 4,
            did: 28,
            name: "技术部-音频处理",
            _id: "599fb92d06df1710947c3eb8"
        },
        {
            number: 4,
            did: 29,
            name: "技术部-广播剧后期制作",
            _id: "599fb92d06df1710947c3eb7"
        },
        {
            number: 2,
            did: 30,
            name: "宣传部-网宣",
            _id: "599fb92d06df1710947c3eb6"
        },
        {
            number: 3,
            did: 31,
            name: "宣传部-美工",
            _id: "599fb92d06df1710947c3eb5"
        },
        {
            number: 5,
            did: 32,
            name: "宣传部-摄影",
            _id: "599fb92d06df1710947c3eb4"
        },
        {
            number: 6,
            did: 33,
            name: "视频制作部-策划&编剧",
            _id: "599fb92d06df1710947c3eb3"
        },
        {
            number: 8,
            did: 34,
            name: "视频制作部-摄影摄像",
            _id: "599fb92d06df1710947c3eb2"
        },
        {
            number: 11,
            did: 35,
            name: "视频制作部-后期剪辑",
            _id: "599fb92d06df1710947c3eb1"
        }
    ],
    __v: 0
} ]);
db.getCollection("clubs").insert([ {
    _id: ObjectId("5d6514633628cad1266a2633"),
    interviewer: [ ],
    cid: 6,
    name: "焦点摄影",
    departments: [
        {
            did: 0,
            name: "Ps"
        },
        {
            did: 1,
            name: "Lr"
        },
        {
            did: 2,
            name: "Ae"
        },
        {
            did: 3,
            name: "Pr"
        },
        {
            did: 4,
            name: "视频制作"
        },
        {
            did: 5,
            name: "程序设计"
        },
        {
            did: 6,
            name: "对微信推送感兴趣"
        },
        {
            did: 7,
            name: "文笔好"
        },
        {
            did: 8,
            name: "组织策划"
        },
        {
            did: 9,
            name: "力气大/能吃苦"
        },
        {
            did: 10,
            name: "虚心学习"
        },
        {
            did: 11,
            name: "水群"
        },
        {
            did: 12,
            name: "擅长处理应急事件"
        },
        {
            did: 13,
            name: "会做旅行/美食攻略各种攻略"
        },
        {
            did: 14,
            name: "会画画(sai/手绘"
        },
        {
            did: 15,
            name: "会写日记/手账"
        },
        {
            did: 16,
            name: "热爱摄影/擅长摄影"
        },
        {
            did: 17,
            name: "关心学校活动"
        }
    ],
    password: "123",
    maxDep: 99,
    attention: "<p>1.焦点摄影工作室地址:学生活动中心南楼205</p><p>2.焦点摄影新生交流QQ群:827181405</p><p>3. 如果有满意的作品(内容不限)请发送到jiaodiansheying@qq.com,面试的时候会加分哦</p>"
} ]);
session.commitTransaction(); session.endSession();

// ----------------------------
// Collection structure for interviewees
// ----------------------------
db.getCollection("interviewees").drop();
db.createCollection("interviewees");

// ----------------------------
// Documents of interviewees
// ----------------------------
session = db.getMongo().startSession();
session.startTransaction();
db = session.getDatabase("interview");
db.getCollection("interviewees").insert([ {
    _id: ObjectId("5da6f8bd6e3fda12af10f7b5"),
    name: "蛋白",
    sex: NumberInt("0"),
    volunteer: [
        NumberInt("1")
    ],
    notion: "214141",
    done: [
        NumberInt("1")
    ],
    busy: false,
    ifsign: true,
    ifcall: true,
    email: "21312415959@qq.com",
    rate: [
        {
            _id: ObjectId("5da6fa126e3fda12af10f7bd"),
            did: NumberInt("1"),
            score: NumberInt("4"),
            comment: "蛋白",
            interviewer: "11"
        }
    ],
    sid: NumberInt("214"),
    major: "医信",
    phone: "12314214121",
    "short_tel": "2134125",
    qq: "21414125",
    cid: NumberInt("1"),
    __v: NumberInt("1"),
    signTime: ISODate("2019-10-16T11:08:02.682Z"),
    calldid: "1"
} ]);
db.getCollection("interviewees").insert([ {
    _id: ObjectId("5da6f8bd6e3fda12af10f7b6"),
    name: "大师",
    sex: NumberInt("1"),
    volunteer: [
        NumberInt("0")
    ],
    notion: "1656",
    done: [ ],
    busy: false,
    ifsign: false,
    ifcall: false,
    email: "161846158@qq.com",
    rate: [ ],
    sid: NumberInt("5434"),
    major: "对吧",
    phone: "16565435162",
    "short_tel": "1626464",
    qq: "265464864",
    cid: NumberInt("1"),
    __v: NumberInt("0")
} ]);
db.getCollection("interviewees").insert([ {
    _id: ObjectId("5da6f8bd6e3fda12af10f7b4"),
    name: "安师傅",
    sex: NumberInt("0"),
    volunteer: [
        NumberInt("1")
    ],
    notion: "16465",
    done: [ ],
    busy: false,
    ifsign: false,
    ifcall: false,
    email: "694126@qq.com",
    rate: [ ],
    sid: NumberInt("658"),
    major: "打死",
    phone: "2141",
    "short_tel": "136531",
    qq: "514253",
    cid: NumberInt("1"),
    __v: NumberInt("0")
} ]);
db.getCollection("interviewees").insert([ {
    _id: ObjectId("5da6f8bd6e3fda12af10f7b7"),
    name: "发烧党",
    sex: NumberInt("1"),
    volunteer: [
        NumberInt("1")
    ],
    notion: "54*45",
    done: [ ],
    busy: false,
    ifsign: false,
    ifcall: false,
    email: "318601637@qq.com",
    rate: [ ],
    sid: NumberInt("346"),
    major: "打死",
    phone: "453213",
    "short_tel": "434512",
    qq: "4512312",
    cid: NumberInt("1"),
    __v: NumberInt("0")
} ]);
db.getCollection("interviewees").insert([ {
    _id: ObjectId("5da6f8bd6e3fda12af10f7b8"),
    name: "发烧党",
    sex: NumberInt("0"),
    volunteer: [
        NumberInt("1")
    ],
    notion: "645-2",
    done: [ ],
    busy: false,
    ifsign: false,
    ifcall: false,
    email: "21639619@qq.com",
    rate: [ ],
    sid: NumberInt("1424"),
    major: "21让",
    phone: "45644",
    "short_tel": "65464",
    qq: "84653235412",
    cid: NumberInt("1"),
    __v: NumberInt("0")
} ]);
db.getCollection("interviewees").insert([ {
    _id: ObjectId("5da6f8be6e3fda12af10f7b9"),
    name: "发发",
    sex: NumberInt("1"),
    volunteer: [
        NumberInt("1")
    ],
    notion: "54*3268",
    done: [ ],
    busy: false,
    ifsign: false,
    ifcall: false,
    email: "251848519@qq.com",
    rate: [ ],
    sid: NumberInt("5676"),
    major: "154543",
    phone: "45*7853",
    "short_tel": "45645645*45",
    qq: "45645645",
    cid: NumberInt("1"),
    __v: NumberInt("0")
} ]);
db.getCollection("interviewees").insert([ {
    _id: ObjectId("5da6f8be6e3fda12af10f7ba"),
    name: "阿萨德",
    sex: NumberInt("1"),
    volunteer: [
        NumberInt("3")
    ],
    notion: "2163451",
    done: [ ],
    busy: false,
    ifsign: false,
    ifcall: false,
    email: "786453@qq.com",
    rate: [ ],
    sid: NumberInt("111"),
    major: "打分",
    phone: "456321478645",
    "short_tel": "7864531864",
    qq: "7864531",
    cid: NumberInt("1"),
    __v: NumberInt("0")
} ]);
db.getCollection("interviewees").insert([ {
    _id: ObjectId("5da6f8be6e3fda12af10f7bb"),
    name: "妹妹",
    sex: NumberInt("0"),
    volunteer: [
        NumberInt("4")
    ],
    notion: "4567",
    done: [ ],
    busy: false,
    ifsign: false,
    ifcall: false,
    email: "345134512@qq.com",
    rate: [ ],
    sid: NumberInt("333"),
    major: "打算",
    phone: "454676898",
    "short_tel": "4531312123",
    qq: "346546",
    cid: NumberInt("1"),
    __v: NumberInt("0")
} ]);
db.getCollection("interviewees").insert([ {
    _id: ObjectId("5da6f8be6e3fda12af10f7bc"),
    name: "弟弟",
    sex: NumberInt("0"),
    volunteer: [
        NumberInt("2")
    ],
    notion: "213456",
    done: [ ],
    busy: false,
    ifsign: false,
    ifcall: false,
    email: "1243236786@qq.com",
    rate: [ ],
    sid: NumberInt("222"),
    major: "发说说的挂号费",
    phone: "234567",
    "short_tel": "34546587980",
    qq: "34256789",
    cid: NumberInt("1"),
    __v: NumberInt("0")
} ]);
session.commitTransaction(); session.endSession();

// ----------------------------
// Collection structure for sessions
// ----------------------------
db.getCollection("sessions").drop();
db.createCollection("sessions");
db.getCollection("sessions").createIndex({
    expires: NumberInt("1")
}, {
    name: "expires_1"
});

// ----------------------------
// Documents of sessions
// ----------------------------
session = db.getMongo().startSession();
session.startTransaction();
db = session.getDatabase("interview");
db.getCollection("sessions").insert([ {
    _id: "m87biBUXo8GSA1bbJY68ZsLhLdz41DQp",
    session: "{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"club\":\"红色家园\",\"cid\":1}",
    expires: ISODate("2020-02-02T14:04:48.784Z")
} ]);
session.commitTransaction(); session.endSession();
