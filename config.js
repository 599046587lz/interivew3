/**
 * Created by bangbang93 on 14-9-15.
 */
module.exports = {
    db:{
        user: process.env.MONGO_USER || '',
        password: process.env.MONGO_PASSWORD || '',
        host: process.env.MONGO_HOST || '127.0.0.1:27017',
        db: 'interview'
    },
    cookie_secret: 'redhome2014interview',
    QINIU_ACCESSKEY: 'S8N6tLzEXQFuuspklyKlTf04IoTns2JqsG63vf_R',
    QINIU_SECRETKEY: 'hZnqp7jcCmLQCkUuJ5roHrh6Mn39VuytDZBULF58',
    QINIU_BUCKET: 'interviewer',
    token: '57dbfcf39882410001b0c195',
    mailUser: '1322023401@qq.com',
    mailPassword: 'tyucyclwplkkidef',
    apiKey: '7e9b92e1d01a94a7e304813856a99d25',
    proxy: 'http://szq.jouta.xyz/'
};