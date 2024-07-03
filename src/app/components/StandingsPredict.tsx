'use client'
import { Reorder } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { standingsPrediction } from '@/app/actions/standings.action'

export default function StandingsPredict({ data }: any) {
    const [teams, setTeams] = useState(data)
    const [promoted, setPromoted] = useState<any[]>([])
    const [playoff, setPlayoff] = useState<any[]>([])
    const [relegate, setRelegated] = useState<any[]>([])
    const testWithData = standingsPrediction.bind(null, teams)

    useEffect(() => {
        setPromoted([teams[0], teams[1]])
        setPlayoff([teams[2], teams[3], teams[4], teams[5]])
        setRelegated([teams[teams.length - 3], teams[teams.length - 2], teams[teams.length - 1]])
    }, [teams])

    return (
        <><form action={testWithData}>
            <Reorder.Group values={data} onReorder={setTeams}>
                {teams.map((team: any, index: any) => (
                    <Reorder.Item key={team.team} value={team} drag={true}>
                        <div key={team.team} className={`
          ${index % 2 === 0 ? 'text-white' : 'text-cyan-400'}
        `}>
                            <div className="text-left">{`${index + 1} ${team.team}`}</div>
                        </div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>
            <button type="submit">Submit League Prediction</button>
        </form>
            <br />
            <div>
                <div>Promoted Teams</div>
                <br />
                {promoted.map((team: any, index: any) => (
                    <div key={team.team}>
                        <div className="text-left">{`${team.team}`}</div>
                    </div>
                ))}
            </div>
            <br />
            <div>
                <div>Playoff Teams</div>
                <br />
                {playoff.map((team: any, index: any) => (
                    <div key={team.team}>
                        <div className="text-left">{`${team.team}`}</div>
                    </div>
                ))}
            </div>
            <br />
            <div>
                <div>Relegated Teams</div>
                <br />
                {relegate.map((team: any, index: any) => (
                    <div key={team.team}>
                        <div className="text-left">{`${team.team}`}</div>
                    </div>
                ))}
            </div>
        </>
    )
}
