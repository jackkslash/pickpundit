import { DrizzleAdapter } from "@auth/drizzle-adapter"
import db from "./db"
import google from "next-auth/providers/google"
import NextAuth, { type DefaultSession } from "next-auth"
import { accounts, sessions, users, verificationTokens } from "./db/schema"

declare module "next-auth" {

    interface Session {
        user: {
            username: string

        } & DefaultSession["user"]
    }
}


export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [google],
    adapter: DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
    }),
    pages: {
        newUser: "/me/username",
    },
    callbacks: {
        async session({ session, user }) {
            session.user.id = user.id
            console.log(session, user)
            return session
        },
    },
})