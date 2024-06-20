'use client'
import { useState } from "react";
import Fixture from "./Fixture";
import Link from "next/link";

export default function Fixtures({ fixtures, role }: { fixtures: any, role?: string }) {
    const [matchday, setMatchday] = useState('1');
    return (
        <div className="flex flex-col items-center justify-center gap-6 ">
            <select onChange={(e) => setMatchday(e.target.value)} className="text-white bg-black" value={matchday}>
                <option value="">All</option>
                <option value="1">1</option>
                <option value="2">2</option>
            </select>
            {
                fixtures
                    .filter((fixture: { homeTeam: string; awayTeam: string; matchday: number }) =>
                        fixture.matchday.toString().includes(matchday.toLowerCase())
                    )
                    .map((f: any) => (
                        <Fixture key={f.id} fixture={f} role={role} />
                    ))
            }
            {matchday !== "" &&
                <Link href={`/predictions?competitionId=${fixtures[0].competitionId}&matchday=${matchday}`}> - Predict Matchday {matchday} Matches - </Link>}
        </div>
    )
}