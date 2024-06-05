'use client'
import React, { useRef } from 'react'

export default function
    ({ SubmitComp }: any) {
    const ref = useRef<HTMLFormElement>(null)

    return (
        <div>
            <form className="flex flex-col gap-2" ref={ref}
                action={async (formData) => {
                    await SubmitComp(formData)
                    ref.current?.reset()
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
