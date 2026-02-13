import type { VercelResponse, VercelRequest } from '@vercel/node'
import jwt from 'jsonwebtoken'
import { parse, serialize } from 'cookie'

const COOKIE_NAME = 'session'

function getJwtSecret() {
    const secret = process.env.JWT_SECRET
    if (!secret) throw new Error('JWT_SECRET is not set')
    return secret
}

export function setSessionCookie(
    res: VercelResponse,
    userId: number,
    opts?: { rememberMe?: boolean }
) {
    const rememberMe = !!opts?.rememberMe
    const maxAgeSeconds = rememberMe
        ? 60 * 60 * 24 * 30
        : 60 * 60 * 24 * 1

    const token = jwt.sign({ sub: String(userId) }, getJwtSecret(), {
        expiresIn: maxAgeSeconds
    })

    const cookie = serialize(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: maxAgeSeconds
    })

    res.setHeader('Set-Cookie', cookie)
}

export function clearSessionCookie(res: VercelResponse) {
    const cookie = serialize(COOKIE_NAME, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0
    })
    res.setHeader('Set-Cookie', cookie)
}

export function getUserIdFromRequest(req: VercelRequest): number | null {
    const header = req.headers.cookie
    if (!header) return null

    const cookies = parse(header)
    const token = cookies[COOKIE_NAME]
    if (!token) return null

    try {
        const payload = jwt.verify(token, getJwtSecret()) as { sub?: string }
        const id = payload?.sub ? Number(payload.sub) : NaN
        return Number.isFinite(id) ? id : null
    } catch {
        return null
    }
}

export function requireAuth(req: VercelRequest, res: VercelResponse): number | null {
    const userId = getUserIdFromRequest(req)
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return null
    }
    return userId
}
