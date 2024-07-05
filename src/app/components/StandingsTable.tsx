import React from 'react'

export default function StandingsTable({ data }: any) {
    console.log("data", data)
    return (
        <table className="w-full table-auto">
            <colgroup>
                <col className="w-1/3" />
                <col className="w-1/12" />
            </colgroup>
            <thead>
                <tr className=" text-left">
                    <th>Team</th>
                    <th>P</th>
                    <th>W</th>
                    <th>D</th>
                    <th>L</th>
                    <th>F</th>
                    <th>A</th>
                    <th>Pts</th>
                </tr>
            </thead>
            <tbody>
                {data.map((team: any, index: any) => (
                    <tr key={team.team} className={`
              ${index % 2 === 0 ? 'text-white' : 'text-cyan-400'}
            `}>
                        <td className="text-left">{`${team.position} ${team.team}`}</td>
                        <td>{team.played}</td>
                        <td>{team.won}</td>
                        <td>{team.drawn}</td>
                        <td>{team.lost}</td>
                        <td>{team.goalsFor}</td>
                        <td>{team.goalsAgainst}</td>
                        <td>{team.points}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
