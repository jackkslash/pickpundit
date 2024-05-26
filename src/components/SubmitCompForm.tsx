
import db from '@/db';
import { competitions } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import React from 'react'

export default function
    () {
    return (
        <div>
            <form className="flex flex-col gap-2"
                action={async (formData: FormData) => {
                    "use server"
                    const leagueData = {
                        formalName: formData.get("formalName") as string,
                        informalName: formData.get("informalName") as string,
                        code: formData.get("code") as string,
                        type: formData.get("type") as string,
                        emblem: formData.get("emblem") as string,
                    }

                    await db.insert(competitions).values(
                        leagueData
                    )

                    revalidatePath("/dashboard")
                }}
            >
                <label htmlFor="formalName">Formal Name</label>
                <input className="text-black" type="text" name="formalName" />
                <label htmlFor="informalName">Informal Name</label>
                <input className="text-black" type="text" name="informalName" />
                <label htmlFor="code">Code</label>
                <input className="text-black" type="text" name="code" />
                <label htmlFor="type">Type</label>
                <input className="text-black" type="text" name="type" />
                <label htmlFor="emblem">Emblem</label>
                <input className="text-black" type="text" name="emblem" />
                <br />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}
