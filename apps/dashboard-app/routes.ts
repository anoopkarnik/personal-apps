export const publicRoutes = [
    "/","/auth/new-verification"
]

export const authRoutes =[
    "/auth/login","/auth/register","/auth/error","/auth/forgot-password","/auth/reset-password",'/api/auth/callback/notion',
    '/api/flow','/api/cron/wait'
]

export const apiAuthPrefix = "/api/auth"

export const DEFAULT_LOGIN_REDIRECT = "/"