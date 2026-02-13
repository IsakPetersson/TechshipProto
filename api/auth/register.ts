import type { VercelRequest, VercelResponse } from '@vercel/node'
import bcrypt from 'bcryptjs'
import { prisma } from '../../lib/prisma.js'
import { setSessionCookie } from '../../lib/session.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed' })
        }

        const { email, name, password, rememberMe } = req.body ?? {}

        if (!email || !name || !password) {
            return res.status(400).json({ error: 'Missing required fields' })
        }

        const normalizedEmail = String(email).trim().toLowerCase()
        const normalizedName = String(name).trim()
        const passwordHash = await bcrypt.hash(String(password), 12)

        const user = await prisma.user.create({
            data: { email: normalizedEmail, name: normalizedName, password: passwordHash },
            select: { id: true, email: true, name: true, createdAt: true }
        })

        setSessionCookie(res, user.id, { rememberMe })

        return res.status(201).json(user)
    } catch (error: any) {
        if (error?.code === 'P2002') {
            return res.status(409).json({ error: 'Email already exists' })
        }
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}
