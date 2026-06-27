import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/',
    error: '/',
  },
  callbacks: {
    async signIn({ user }) {
      const rawList = process.env.ALLOWED_EMAILS ?? ''
      const allowed = rawList
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean)
      if (allowed.length === 0) return true
      return allowed.includes((user.email ?? '').toLowerCase())
    },
    async session({ session }) {
      return session
    },
  },
})
