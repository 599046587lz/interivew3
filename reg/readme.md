
1.reg 报名数据需传json格式
    headers   [{"key":"Content-Type","value":"application/x-www-form-urlencoded","description":""}]
   short_tel可以不用,其他不能为空
   json数据格式示例：

   { club: '派大星',
     code: '110',
     name: '海绵宝宝',
     studentID: '000000000',
     image: '1.jpg',
     gender: '男',
     college: '蟹皇堡',
     major: '抓水母',
     department: '技术部',
     intro: '/////',
     tel: '0000000',
     qq: '00000000s',
     short_tel: '00000000' }

2.先上传文件，后我会返回文件名

3,每个code，社团代码  

需手动在files/file/文件夹里先创建对应的code文件夹，

例如 code=110

需创建 files/file/110

明天测试upload