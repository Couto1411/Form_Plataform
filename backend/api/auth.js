const {authSecret} = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')

module.exports = app =>{
    const signin = async (req, res) => {
        const sign = { ...req.body }
        if (!sign.email) {
            return res.status(400).send('Informe usuário!')
        }
        if (!sign.senha) {
            return res.status(401).send('Informe senha!')
        }

        const user = await app.db('users')
            .where({ email: sign.email })
            .first()

        if (!user) return res.status(400).send('Usuário não encontrado!')

        const isMatch = bcrypt.compareSync(sign.senha, user.senha)
        if (!isMatch) return res.status(401).send('Senha inválida!')

        const now = Math.floor(Date.now() / 1000)

        const payload = {
            id: user.id,
            nome: user.nome,
            email: user.email,
            admin: user.admin,
            iat: now,
            exp: now + (60 * 60 * 24)
        }

        res.json({
            ...payload,
            token: jwt.encode(payload, authSecret)
        })
    }

    const validateToken = async (req, res) => {
        const sign = { ...req.body }
        const userData = sign || null
        try {
            if(userData) {
                const token = jwt.decode(userData.token, authSecret)
                if(new Date(token.exp * 1000) > new Date()) {
                    return res.send(true)
                }
            }
        } catch(e) {
            // problema com o token
        }

        res.send(false)
    }

    return { signin, validateToken }
}