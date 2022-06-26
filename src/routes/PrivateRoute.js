import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectEmail, selectMoney, selectTitle } from "../features/slices/reposSlice";


function PrivateRoute(props) {
    const email = useSelector(selectEmail);
    const money = useSelector(selectMoney);
    const title = useSelector(selectTitle);

    return (!email || !money || !title) ? <Navigate to="/" replace/> : <Outlet/>

} 

export default PrivateRoute
    