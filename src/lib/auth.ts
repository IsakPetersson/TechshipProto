export type SafeUser = {
    id: number
    email: string
    name: string
    createdAt: string
}

async function jsonOrThrow(res: Response) {
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error((data as any)?.error || `Request failed (${res.status})`)
    return data
}

export async function login(email: string, password: string, rememberMe: boolean): Promise<SafeUser> {
    const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, rememberMe })
    })
    return jsonOrThrow(res)
}

export async function register(email: string, name: string, password: string, rememberMe: boolean): Promise<SafeUser> {
    const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, name, password, rememberMe })
    })
    return jsonOrThrow(res)
}