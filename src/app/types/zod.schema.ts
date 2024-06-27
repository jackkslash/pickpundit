import { z } from "zod"

export const competitionSchema = z.object({
    id: z.number().min(1),
    formalName: z.string().min(1),
    informalName: z.string().min(1),
    code: z.string().min(1),
    type: z.string().min(1),
    emblem: z.string().min(1),
})

export const teamSchema = z.object({
    id: z.number().min(1),
    name: z.string().min(1),
    shortName: z.string().min(1),
    tla: z.string().min(1),
    crest: z.string().min(1),
    address: z.string().min(1),
    website: z.string().min(1),
    founded: z.string().min(1),
    clubColors: z.string().min(1),
    venue: z.string().min(1),
})

export const groupSchema = z.object({
    id: z.number().min(1),
    competitionId: z.coerce.number().min(1),
    name: z.string().min(1),
})

export const groupTeamSchema = z.object({
    teamId: z.number().min(1),
    groupId: z.coerce.number().min(1),
})

export const teamsCompetitionsSchema = z.object({
    teamId: z.coerce.number().min(1),
    competitionId: z.coerce.number().min(1),
})

export const fixtureSchema = z.object({
    id: z.number().min(1),
    competitionId: z.coerce.number().min(1),
    homeTeamId: z.coerce.number().min(1),
    awayTeamId: z.coerce.number().min(1),
    date: z.coerce.date(),
    venue: z.string().min(1),
    status: z.string().min(1),
    homeTeamScore: z.coerce.number().min(0),
    awayTeamScore: z.coerce.number().min(0),
    matchday: z.coerce.number().min(1),
})

export const predictionFormSchema = z.object({
    id: z.coerce.number().min(1),
    competitionId: z.coerce.number().min(1),
    score: z.coerce.number().min(1),
    team: z.string().min(1),
})