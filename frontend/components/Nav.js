import React, { Component } from 'react'
import Link from 'next/link'

const Nav = () => {
    return (
        <div>
            <Link href='/sell'>Sell!</Link>
            <Link href='/index'>Home</Link>    

        </div>    
    )
}
 
export default Nav;