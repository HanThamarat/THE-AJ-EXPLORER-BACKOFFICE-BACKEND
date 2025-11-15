jest.mock('../src/adapters/http/middleware/passport', () => ({}));


jest.mock('passport', () => ({
    authenticate: jest.fn(() => (req: any, res: any, next: any) => {
        req.user = {
            id: 1,
            username: 'administrator',
            email: 'admin@example.com',
            role: 'admin'
        };
        next();
    }),
    use: jest.fn(),
    initialize: jest.fn(() => (req: any, res: any, next: any) => next()),
}));