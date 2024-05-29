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
            ))}
        </div>
    )
}

export default Competions