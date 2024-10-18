import { ReactElement } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoute = () : ReactElement => {
    const authToken =localStorage.getItem("auth_token");

    return authToken ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoute