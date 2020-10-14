const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name : {
    type : String,
    maxlength :50
  }  ,
  email :{
      type:String,
      trim : true, //중간 공백 제거
      unique: 1
  },
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

const User=  mongoose.model('User',userSchema)

//이모듈을 다른곳에서도 쓰고 싶으면 export 해준다.
module.exports = {User}