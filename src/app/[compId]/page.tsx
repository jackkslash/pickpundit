import React from 'react'

export default function page({ params }: { params: { compId: number } }) {
    return (
        <div>{params.compId}</div>
    )
}
