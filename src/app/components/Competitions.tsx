import db from '@/db'
import { competitions } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import React from 'react'

function Competions({ comps }: { comps: any }) {
    return (
        <div className='flex flex-col gap-4'>
            <h1>Competitions</h1>
            {comps.map((competition: any) => (
                <div key={competition.id}>
                    <p>{competition.formalName}</p>
                    <p>{competition.informalName}</p>
                    <p>{competition.code}</p>
                    <p>{competition.type}</p>
                    <br />
                    <form action={async () => {
                        "use server"
                        await db.delete(competitions).where(eq(competitions.id, competition.id))
                        revalidatePath("/dashboard")
                    }}>
                        <button type="submit">DELETE</button>
                    </form>
                    <br />
                    <Link href={`/dashboard/comps/` + competition.id + `?formalName=` + competition.formalName}>Add teams</Link>
                </div>
            ))}
        </div>
    )
}

export default Competions