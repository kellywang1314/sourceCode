const express = require('express')
const path = require('path')
let app = express()
app.use(express.static(__dirname + '/public/'))
app.get('/history',function(req,res){
    res.sendFile(__dirname + '/public/' + 'history.html')
})

app.listen(8082,function(){
    let uri = 'http://localhost:8082'
    console.log('Listening at ' + uri + '\n')
})