import React from 'react'
import Link from 'next/link'

const Home = props => {
    return (
        <div>
            <p>Hello!</p>
            <Link href='/sell'>Sell!</Link>
        </div>
    )
}

export default Home