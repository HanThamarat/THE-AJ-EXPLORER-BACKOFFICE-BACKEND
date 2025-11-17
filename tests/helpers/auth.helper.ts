import jwt from 'jsonwebtoken';

export async function getAuthToken(): Promise<string> {
    try {
        const token = await jwt.sign(
            { 
                id: 1, 
                username: 'test',
                email: 'test' 
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1h' }
        );

        return token;
    } catch (error: any) {
        console.error('Auth error:', error.message);
        throw error;
    }
}