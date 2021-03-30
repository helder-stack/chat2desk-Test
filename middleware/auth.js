const jwt = require('jsonwebtoken')
const jwtkey = 'asdjkaksd'

function auth(req, res, next){

    //caso o token armazenado na sessão seja válido
    jwt.verify(req.session.token, jwtkey, (error, data)=>{
        if(error){
            //caso não seja, irá retornar para a rota principal
            res.redirect('/')
            
        }else{
            //irá criar um id e um email na requisição
            req.id = data.id
            req.email = data.email 
            next()
        }
    })

}

module.exports = auth