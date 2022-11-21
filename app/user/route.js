const Express = require("express");
const { handlerLoginUser, handlerRegisterUser } = require("./handler");
const router = Express.Router();

router.post('/register', handlerRegisterUser);
router.post('/login', handlerLoginUser);

module.exports = router;