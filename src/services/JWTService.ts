import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';

const secret = process.env.SECRET_WORD || '';
export function verifyJWT (token: string) {
    try {
        jwt.verify(token, secret)
        return null
    } catch(e: any){
        console.log(e)
        throw new GraphQLError('User is not authenticated', {
            extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 },
            },
        })
    }
}

export function createJWT(cellPhone: string, password: string) {
    const token = jwt.sign({cellPhone, password}, secret, { expiresIn: "30m"});
    return token
}