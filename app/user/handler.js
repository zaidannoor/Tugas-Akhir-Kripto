import { createHash } from 'crypto';
import { User } from "../../models";
import generateAccessToken from "../../utils/tokenManager";
import { validateCreateUserSchema, validateLoginUserSchema } from '../../validator/user';
const hash = createHash('md5');

export async function handlerRegisterUser(req, res, next) {
    try {
        const { email, fullName, password } = req.body;
        validateCreateUserSchema({ email, fullName, password });
        const checkEmail = await User.findOne({
            where: {
                email: email,
            },
        });

        if (checkEmail) {
            throw new Error("Email address has already in use");
        }
        const hashPassword = hash.update(password, 'utf-8').digest('hex');
        const user = await User.create({
            email,
            fullName,
            password: hashPassword,
        });

        res.status(200).json({
            status: "success",
            message: "Successfully register user",
            data: user,
        });
    } catch (error) {
        next(error);
    }
}
export async function handlerLoginUser(req, res, next) {
    try {
        const { email, password } = req.body;
        validateLoginUserSchema({ email, password });
        const user = await User.findOne({
            where: {
                email: email,
            },
        });
        if (!user) {
            throw new Error("User not found");
        }
        const hashPassword = hash.update(password, 'utf-8').digest('hex');
        if (hashPassword != user.password) {
            throw new Error("Invalid password");
        }
        const accessToken = generateAccessToken({
            id: user.id,
            email: user.email,
            fullName: user.fullName,
        });
        res.status(200).json({
            status: "success",
            message: "Successfully login user",
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    fullName: user.fullName,
                    accessToken,
                },
            },
        });
    } catch (error) {
        next(error);
    }
}