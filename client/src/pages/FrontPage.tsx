import React from 'react'
import { Link } from 'react-router-dom'

const FrontPage = () => {
    return (
        <div>
            <h1>App name</h1>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
        </div>
    )
}

export default FrontPage