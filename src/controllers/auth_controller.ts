import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import userModel from '../models/users_model';

export const register = async (req: Request, res: Response) => {
    try {
        const { password, userName, email } = req.body
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await userModel.create({
            email,
            password: hashedPassword,
            userName
        });
        res.status(200).send(user);
    } catch (err) {
        res.status(400).send(err);
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            res.status(400).send('wrong username or password');
            return;
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            res.status(400).send('wrong username or password');
            return;
        }
        if (!process.env.ACCESS_TOKEN_SECRET) {
            res.status(500).send('Server Error');
            return;
        }
        // generate access token
        const accessToken = jwt.sign({ _id: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.JWT_TOKEN_EXPIRATION });
        res.status(200).send({ accessToken, _id: user._id });
    } catch (err) {
        console.log('error: ', err)
        res.status(400).send(err);
    }
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.header('authorization');
    const token = authorization && authorization.split(' ')[1];

    if (!token) {
        res.status(401).send('Access Denied');
        return;
    }
    if (!process.env.ACCESS_TOKEN_SECRET) {
        res.status(500).send('Server Error');
        return;
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
            res.status(401).send('Access Denied');
            return;
        }
        req.params.userId = (payload)._id;
        next();
    });
};