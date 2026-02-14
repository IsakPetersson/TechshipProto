import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../lib/session.js";
import { getOrgIdFromHeader, requireOrgMember } from "../lib/org.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        const userId = requireAuth(req, res);
        if (!userId) return;

        const organizationId = getOrgIdFromHeader(req);
        if (!organizationId) {
            return res.status(400).json({ error: "Missing or invalid x-org-id header" });
        }

        const membership = await requireOrgMember(req, res, userId, organizationId);
        if (!membership) return;

        if (req.method === "GET") {
            const accounts = await prisma.account.findMany({
                where: { organizationId },
                include: {
                    transactions: true,
                    organization: true,
                },
                orderBy: { createdAt: "desc" },
            });

            return res.status(200).json(accounts);
        }

        if (req.method === "POST") {
            const { name } = req.body ?? {};
            if (!name || typeof name !== "string") {
                return res.status(400).json({ error: "Name is required" });
            }

            // Force organizationId from header/context (ignore any body org id)
            const account = await prisma.account.create({
                data: { name, organizationId },
            });

            return res.status(201).json(account);
        }

        return res.status(405).json({ error: "Method not allowed" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
