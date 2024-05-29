import db from '@/db'
import { teams } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import React from 'react'
import TeamCollapse from './TeamCollapse'

function Competions({ t }: { t: any }) {
    return (
        <div className='flex flex-col gap-4'>
            <h1>Teams</h1>
            {t.map((team: any) => (

                <TeamCollapse team={team} />
                // <div key={team.id}>
                //     <p>{team.name}</p>
                //     <p>{team.shortName}</p>
                //     <p>{team.tla}</p>
                //     <p>{team.crest}</p>
                //     <p>{team.addres}</p>
                //     <p>{team.website}</p>
                //     <p>{team.founded}</p>
                //     <p>{team.clubColors}</p>
                //     <p>{team.venue}</p>
                //     <form action={async () => {
                //         "use server"
                //         await db.delete(teams).where(eq(teams.id, team.id))
                //         revalidatePath("/dashboard")
                //     }}>
                //         <button type="submit">DELETE</button>
                //     </form>
                // </div>
            ))}
        </div>
    )
}

export default Competions