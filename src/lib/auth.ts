const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"

export function verifyAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD
}

export function generateAuthToken(password: string): string | null {
  if (!verifyAdminPassword(password)) {
    return null
  }
  return Buffer.from(password).toString("base64")
}

export function verifyAuthToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8")
    return verifyAdminPassword(decoded)
  } catch {
    return false
  }
}
