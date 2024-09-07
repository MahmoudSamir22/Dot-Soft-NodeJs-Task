import jwt from 'jsonwebtoken';

export default (payload: {id: number}) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY!, {
        expiresIn: process.env.JWT_EXPIRATION_TIME
    });
}