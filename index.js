const express = require('express')
//익스프레스 모듈 가져오기
const app = express()
//새로운 익스프레스 앱을 만듬 
const port = 3000
//포트 이름
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://maggiechoi:1234@maggie.hhyva.mongodb.net/maggie?retryWrites=true&w=majority',{
    useNewUrlParser:true, useUnifiedTopology:true,useCreateIndex:true,useFindAndModify:false
}).then(() => console.log('mongoDB connected'))
  .catch(err=>console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})