import React, { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"

const Root = () => {
    const navigate = useNavigate()
    useEffect(() => { navigate("/questions") }, [])
    return <><Outlet /></>
}

export default Root;