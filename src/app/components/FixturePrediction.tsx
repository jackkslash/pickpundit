import React from 'react'

export default function FixturePrediction({ fixture }: { fixture: any }) {
    return (
        <div>
            <p>Date: {fixture.date.toLocaleDateString()}</p>
            <p>Kickoff :{fixture.date.toLocaleTimeString()}</p>
            <p>Home Team: {fixture.homeTeam}</p>
            <p>Away Team: {fixture.awayTeam}</p>
            <p>Home Team Score: {fixture.homeTeamScore}</p>
            <p>Away Team Score: {fixture.awayTeamScore}</p>
            <input type="text" placeholder={"Home Team Prediction"} className='bg-black text-white outline-dashed outline-white' name={`${fixture.id}-${fixture.competitionsId}-predictedHomeScore`} />
            <br />
            <input type="text" placeholder={"Away Team Prediction"} className='bg-black text-white outline-dashed outline-white' name={`${fixture.id}-${fixture.competitionsId}-predictedAwayScore`} />
            <br />
        </div>
    )
}

