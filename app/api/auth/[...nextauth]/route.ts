import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import type { NextAuthOptions } from 'next-auth'

const ALLOWED_GITHUB_USERNAME = 'yemoetun'

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      return (profile as any)?.login === ALLOWED_GITHUB_USERNAME
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
