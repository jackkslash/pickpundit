import React from 'react'

export default function standings({ params }: { params: { compId: number } }) {
    return (
        <div>standings of {params.compId}</div>
    )
}
