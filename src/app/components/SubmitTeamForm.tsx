'use client'

import React from 'react'

export default function
    ({ SubmitTeam }: any) {

    return (
        <div>
            <form className="flex flex-col gap-2"
                action={async (formData) => {
                    await SubmitTeam(formData)
                }}
            >
                <label htmlFor="name">Name</label>
                <input className="text-black" type="text" name="name" />
                <label htmlFor="shortName">Short Name</label>
                <input className="text-black" type="text" name="shortName" />
                <label htmlFor="tla">TLA</label>
                <input className="text-black" type="text" name="tla" />
                <label htmlFor="crest">Crest</label>
                <input className="text-black" type="text" name="crest" />
                <label htmlFor="addres">Address</label>
                <input className="text-black" type="text" name="address" />
                <label htmlFor="website">Website</label>
                <input className="text-black" type="text" name="website" />
                <label htmlFor="founded">Founded</label>
                <input className="text-black" type="text" name="founded" />
                <label htmlFor="clubColors">Club Colors</label>
                <input className="text-black" type="text" name="clubColors" />
                <label htmlFor="venue">Venue</label>
                <input className="text-black" type="text" name="venue" />
                <br />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}
