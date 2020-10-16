const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const saltRounds = 10; //salt가 몇글자인지. 
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
  name : {
    type : String,
    maxlength :50
  }  ,
  email :{
      type:String,
      trim : true, //중간 공백 제거
      unique: 1
  } ,
  password : {
      type :String,
      minlength :5
  }
  
  ,
  lastname: {
      type : String,
      maxlength:50
  },
  role : {
      type : Number,
      default : 0
  },
  image : String,
  token :{
      type:String
  },
  tokenExp : {
      type:Number
  }
})

//몽구스 내장 함수 pre 저장전에 무엇을 할것인지.
userSchema.pre('save',function(next){
    var user = this ;
    //비밀번호를 암호화 시킨다.
    if(user.isModified('password')){ //암호에 변경이 있을때만 암호화 해준다.
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)
    
            bcrypt.hash(user.password,salt,function(err,hash){ //fucntion 에 있는 hash 는 암호화된 비번
                if(err) return next(err)
                user.password = hash
                next()
                })
            })
    } else {
        next()
    }
    
    });

userSchema.methods.comparePassword = function(plainPassword,cb){
    //plainpW 12345 암호화된 비번 ㅁㄹ자두ㅏㅣㅜ 
    bcrypt.compare(plainPassword,this.password,function(err,isMatch){
        if(err) return cb(err)
        cb(null,isMatch)
    })
}

userSchema.methods.generateToken = function(cb){
    //jsonwebtoken 을 사용하여 토큰생성
    var user = this;
    var token = jwt.sign(user._id.toHexString() ,'secretToken')
    //user._id+ 'secretToken' = token
    user.token =token;
    user.save(function(err,user){
        if(err) return cb(err)
        cb(null,user)
    })
}
userSchema.statics.findByToken =function(token,cb){
    var user = this;
    //토큰을 decode 한다.
    jwt.verify(token,'secretToken',function(err,decoded){
        //유저 아이디를 이용해서 유저를 찾은 다음에
        //클라이언트에서 가져온 token 과 db에 보관된 토큰이 일치하는지 확인
        user.findOne({"_id": decoded,"token": token},function(err,user){
            if(err) return cb(err);
            cb(null,user)
        })

    })

    
}

const User=  mongoose.model('User',userSchema)

//이모듈을 다른곳에서도 쓰고 싶으면 export 해준다.
//{} 이것의 의미는 무엇일까요..?

module.exports = {User}