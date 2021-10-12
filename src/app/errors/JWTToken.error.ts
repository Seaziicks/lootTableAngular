export class JWTTokenError extends Error {

    static TOKEN_NON_TROUVE = 'Token JWT non trouvé';

    constructor(message: string) {
        super(message);
        this.message = message;
        this.name = 'JWTTokenError';
    }

}
