import { relations } from "drizzle-orm"
import {
    timestamp,
    pgTable,
    text,
    primaryKey,
    integer,
    serial,
    boolean,
} from "drizzle-orm/pg-core"
import { AdapterAccountType } from "next-auth/adapters"

export const users = pgTable("user", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").notNull(),
    username: text("username"),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    role: text("role").notNull().default("user"),
})

export const accounts = pgTable(
    "account",
    {
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        type: text("type").$type<AdapterAccountType>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
    })
)

export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
    "verificationToken",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (vt) => ({
        compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
    })
)

export const competitions = pgTable("competition", {
    id: serial("id").primaryKey(),
    formalName: text("formalName").notNull(),
    informalName: text("informalName"),
    code: text("code").notNull(),
    type: text("type").notNull(),
    emblem: text("emblem"),
    active: boolean("active").notNull().default(false),
})

export const teams = pgTable("team", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    shortName: text("shortName"),
    tla: text("tla"),
    crest: text("crest"),
    address: text("address"),
    website: text("website"),
    founded: timestamp("founded", { mode: "string" }),
    clubColors: text("clubColors"),
    venue: text("venue")
})

export const teamsCompetitions = pgTable("teamsCompetition", {
    teamId: integer("teamId")
        .notNull()
        .references(() => teams.id, { onDelete: "cascade" }),
    competitionId: integer("competitionId")
        .notNull()
        .references(() => competitions.id, { onDelete: "cascade" }),
})


export const groups = pgTable("group", {
    id: serial("id").primaryKey(),
    competitionId: integer("competitionId")
        .notNull()
        .references(() => competitions.id, { onDelete: "cascade" }),
    name: text("name").notNull()
})

export const groupTeams = pgTable("groupTeam", {
    groupId: integer("groupId")
        .notNull()
        .references(() => groups.id, { onDelete: "cascade" }),
    teamId: integer("teamId")
        .notNull()
        .references(() => teams.id, { onDelete: "cascade" }),
})

export const fixtures = pgTable("fixture", {
    id: serial("id").primaryKey(),
    competitionId: integer("competitionId").notNull().references(() => competitions.id, { onDelete: "cascade" }),
    homeTeamId: integer("homeTeamId").notNull().references(() => teams.id, { onDelete: "cascade" }),
    awayTeamId: integer("awayTeamId").notNull().references(() => teams.id, { onDelete: "cascade" }),
    date: timestamp("date", { mode: "date" }).notNull(),
    venue: text("venue").notNull(),
    status: text("status").notNull().default("scheduled"),
    homeTeamScore: integer("homeTeamScore").default(0).notNull(),
    awayTeamScore: integer("awayTeamScore").default(0).notNull(),
    matchday: integer("matchday"),
    round: text("round")
});
