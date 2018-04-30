const jwt = require('jsonwebtoken');

// VERIFICAR TOKEN
let verifyToken = (req, res, next) => {
    let token = req.get('token'); // get token header

    jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Invalid token'
                }
            })
        }

        req.user = decoded.user;
        next()
    });
}

//ROL DE ADMINISTRADOR

let isAdmin = (req, res, next) => {
    let user = req.user;

    if (user.role == 'ADMIN_ROLE') {
        next();
        return;
    }

    return res.status(401).json({
        ok: false,
        err: {
            message: 'You are not an administrator'
        }
    })
}

module.exports = {
    verifyToken,
    isAdmin
};