import { DrizzleAdapter } from "@auth/drizzle-adapter"
import NextAuth from "next-auth"
import db from "./db"

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: DrizzleAdapter(db),
    providers: [],
})