import React from 'react'
import Team from './Team'

function Competions({ t }: { t: any }) {
    return (
        <div className='flex flex-col gap-4'>
            <h1>Teams</h1>
            {t.map((team: any) => (
                <Team team={team} />
            ))}
        </div>
    )
}

export default Competions