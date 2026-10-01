type PPDRoutes = 'root' | 'users' | 'login' | 'register';

export const PPDRoutes: Record<PPDRoutes, string> = {
    root: '/',
    users: '/users',
    login: '/login',
    register: '/register'
} satisfies Record<PPDRoutes, string>;
