import type { VercelRequest, VercelResponse } from '@vercel/node'
import bcrypt from 'bcryptjs'
import { prisma } from '../../lib/prisma.js'
import { setSessionCookie } from '../../lib/session.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed' })
        }

        const { email, password, rememberMe } = req.body ?? {}

        if (!email || !password) {
            return res.status(400).json({ error: 'Missing required fields' })
        }

        const normalizedEmail = String(email).trim().toLowerCase()

        const user = await prisma.user.findUnique({
            where: { email: normalizedEmail }
        })

        if (!user) return res.status(401).json({ error: 'Invalid credentials' })

        const ok = await bcrypt.compare(String(password), user.password)
        if (!ok) return res.status(401).json({ error: 'Invalid credentials' })

        setSessionCookie(res, user.id, { rememberMe })


        // return safe user
        return res.status(200).json({
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}
