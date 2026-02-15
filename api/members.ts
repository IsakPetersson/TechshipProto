import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../lib/prisma.js'
import { requireAuth } from '../lib/session.js'
import { getOrgIdFromHeader, requireOrgMember } from '../lib/org.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        if (req.method !== 'GET') {
            return res.status(405).json({ error: 'Method not allowed' })
        }

        const userId = requireAuth(req, res)
        if (!userId) return

        const organizationId = getOrgIdFromHeader(req)
        if (!organizationId) {
            return res.status(400).json({ error: 'Missing or invalid x-org-id header' })
        }

        const membership = await requireOrgMember(req, res, userId, organizationId)
        if (!membership) return

        // Check if user is owner
        const userMembership = await prisma.organizationMembership.findFirst({
            where: {
                userId,
                organizationId,
                role: 'OWNER'
            }
        })

        if (!userMembership) {
            return res.status(403).json({ error: 'Only organization owners can view members' })
        }

        // Get all members of the organization
        const members = await prisma.organizationMembership.findMany({
            where: { organizationId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        createdAt: true
                    }
                }
            },
            orderBy: { createdAt: 'asc' }
        })

        const formattedMembers = members.map(m => ({
            id: m.id,
            role: m.role,
            joinedAt: m.createdAt,
            user: {
                id: m.user.id,
                name: m.user.name,
                email: m.user.email,
                createdAt: m.user.createdAt
            }
        }))

        return res.status(200).json(formattedMembers)
    } catch (error) {
        console.error('Members API error:', error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}
