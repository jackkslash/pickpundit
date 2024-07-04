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
            {fixture.userHomePrediction
                ? <p>Home Team Prediction: {fixture.userHomePrediction}</p>
                : <div>
                    <input type="text" placeholder={"Home Team Prediction"} className='bg-black text-white outline-dashed outline-white' name={`${fixture.id}-${fixture.competitionsId}-predictedHomeScore`} />
                    <br />
                </div>}
            {fixture.userAwayPrediction
                ? <p>Away Team Prediction: {fixture.userAwayPrediction}</p>
                : <div>
                    <input type="text" placeholder={"Away Team Prediction"} className='bg-black text-white outline-dashed outline-white' name={`${fixture.id}-${fixture.competitionsId}-predictedAwayScore`} />
                    <br />
                </div>}


        </div>
    )
}

