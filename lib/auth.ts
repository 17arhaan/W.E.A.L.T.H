// Simple authentication utilities
// In a real app, you would use a proper auth solution like NextAuth.js or Clerk

import { cookies } from "next/headers"
import { db } from "./db"

// Session management
export const auth = {
  // Get the current user from the session
  getUser: () => {
    const userId = cookies().get("userId")?.value
    if (!userId) return null

    return db.getUser(userId)
  },

  // Login a user
  login: async (email: string, password: string) => {
    // In a real app, you would verify the password
    // For demo purposes, we'll just check if the user exists
    const user = db.getUserByEmail(email)

    if (user) {
      // Set a cookie to "authenticate" the user
      cookies().set("userId", user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      })

      return user
    }

    return null
  },

  // Logout a user
  logout: () => {
    cookies().delete("userId")
  },

  // Check if a user is authenticated
  isAuthenticated: () => {
    return !!cookies().get("userId")?.value
  },
}

