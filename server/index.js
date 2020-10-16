const express = require('express')
//익스프레스 모듈 가져오기
const app = express()
//새로운 익스프레스 앱을 만듬 
const port = 5000
//포트 이름
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

//application/x-www-form0urlencoded
app.use(bodyParser.urlencoded({extended:true}));
//application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
const {User} =  require('./models/User')
const{auth}=require('./middleware/auth')
const config = require('./config/key')  //깃허브에 몽고디비 pw보이면 안되니 이걸로 바꿔줌
mongoose.connect(config.mongoURI,{
    useNewUrlParser:true, useUnifiedTopology:true,useCreateIndex:true,useFindAndModify:false
}).then(() => console.log('mongoDB connected'))
  .catch(err=>console.log(err))

  app.get('/', (req, res) => {
    res.send('Hello World! ')
  })
app.get('/api/hello', (req, res) => {
  res.send('안녕 인프런 ! ')
})

app.post('/register',(req,res) => {
    //회원가입에 필요한 정보들을 클라이언트에서 가져오면
    //그런것들을 데이터베이스에서 넣는다.
    const user = new User(req.body)
    user.save((err,userInfo) => {
        if(err) return res.json({success :false,err})
        return res.status(200).json({
            success: true
        })
    })
})

app.post('/login',(req,res) =>{
    //요청된 이메일을 데이터베이스에 있는지 찾는다
    User.findOne({email:req.body.email},(err,user)=>{
        if(!user){
            return res.json({
                loginSuccess : false,
                message : "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        user.comparePassword(req.body.password,(err,isMatch)=>{
            if(!isMatch)
            return res.json({loginSuccess:false,message:"비밀번호가 틀렸습니다."})
            
            //비밀번호 까지 맞다면 토큰을 생성하기
            user.generateToken((err,user) => {
                if(err) return res.status(400).send(err);
    
                //에러가 없다면 토큰을 저장한다. => 쿠키 또는 세션 또는 로컬 스트리지
                //쿠키에 한다. 쿠카 파서 인스톨 하기
                res.cookie("x_auth",user.token)
                .status(200)
                .json({loginSuccess:true,userId : user._id}) 
    
            })
        })
    })
    //요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인
    

}) 


app.post('/api/users/auth',auth,(req,res)=>{
    //여기까지 왔다는 것은 미들웨어를 통과한거고 authentication 이 true 라는 말 
    res.status(200).json({
        _id : req.user._id,
        isAdmin :req.user.role === 0? false:true, 
        isAuth : true,
        email: req.user.email,
        name :req.uesr.lastname,
        role: req.user.role,
        image:req.user.image
     })

})

app.get('/api/users/logout',auth,(req,res)=>{
    User.findOneAndUpdate({_id:req.user._id},
        {token:""},
        (err,user)=>{
            if(err) return res.json({ success:false,err});
            return res.status(200).send({
                success:true
            })
        })
})

app.get('/api/hello',(req,res)=>{
    res.send('안녕하세용')
})




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})