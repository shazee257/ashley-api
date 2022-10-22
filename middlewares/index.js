const { verify } = require('jsonwebtoken');

exports.loggedIn = (req, res, next) => {
    decodeToken(req)
        .then((data) => {
            req.user = data.user;
            next();
        }).catch((ex) => {
            console.error(ex);
            res.send({
                status: 403,
                success: false,
                message: "You're not authorized!, JWT error",
            });
        });
}

function decodeToken(req) {
    return new Promise((resolve, reject) => {
        let { token } = req.headers;
        verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err === null) {
                resolve(decoded);
            } else {
                reject(err);
            }
        });
    });
}