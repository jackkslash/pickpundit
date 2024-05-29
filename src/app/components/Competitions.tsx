import React from 'react'
import CompCollaps from './CompCollapse'

function Competions({ comps }: { comps: any }) {
    return (
        <div className='flex flex-col gap-4'>
            <h1>Competitions</h1>
            {comps.map((competition: any) => (
                <div className='flex gap-2'>
                    <CompCollaps competition={competition} />
                </div>
            ))}
        </div>
    )
}

export default Competions