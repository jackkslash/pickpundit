import db from '@/db'
import { groups } from '@/db/schema'
import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import React from 'react'

export default async function Groups({ id, groupList }: { id: any, groupList: any }) {
    console.log(groupList)
    return (
        <div>
            {groupList.map((g: any) =>
                <div>
                    <p>Group: {g.name}</p>
                    <p>Comp: {g.competitionId}</p>
                    <br />
                    <form action={async () => {
                        "use server"
                        await db.delete(groups).where(and(
                            eq(groups.id, g.id),
                            eq(groups.competitionId, id)
                        )
                        )
                        revalidatePath("/")
                    }}>
                        <button type="submit">DELETE</button>
                    </form>
                    <br />

                </div>)}
            <form action={async (formData) => {
                "use server"
                const name = formData.get("group") as string
                await db.insert(groups).values({
                    competitionId: id,
                    name: name
                })
                revalidatePath("/")
            }}>
                <label htmlFor="group" />
                <input className='text-black' type="text" name='group' />
                <button type="submit">Add</button>
            </form>
        </div>
    )
}
