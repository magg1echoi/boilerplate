const express = require('express')
//익스프레스 모듈 가져오기
const app = express()
//새로운 익스프레스 앱을 만듬 
const port = 3000
//포트 이름
const bodyParser = require('body-parser')


//application/x-www-form0urlencoded
app.use(bodyParser.urlencoded({extended:true}));
//application/json
app.use(bodyParser.json());

const mongoose = require('mongoose');
const User = require('./models/User');
const config = require('./config/key')  //깃허브에 몽고디비 pw보이면 안되니 이걸로 바꿔줌
mongoose.connect(config.mongoURI,{
    useNewUrlParser:true, useUnifiedTopology:true,useCreateIndex:true,useFindAndModify:false
}).then(() => console.log('mongoDB connected'))
  .catch(err=>console.log(err))


app.get('/', (req, res) => {
  res.send('안녕 인프런 ! ')
})

app.post('/register',(req,res)=>{
    //회원가입에 필요한 정보들을 클라이언트에서 가져오면
    //그런것들을 데이터베이스에서 넣는다.
    const user = new User(req.body)
    user.save((err,doc) => {
        if(err) return res.json({success :false,err})
        return res.status(200).json({
            success: true
        })
    })

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})