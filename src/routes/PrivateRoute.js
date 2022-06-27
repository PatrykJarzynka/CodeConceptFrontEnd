import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectEmail, selectMoney, selectTitle } from "../features/slices/reposSlice";


function PrivateRoute(props) {
    const email = useSelector(selectEmail);
    const money = useSelector(selectMoney);
    const title = useSelector(selectTitle);

    return (!email || !money || !title) ? <Navigate to="/" replace/> : <Outlet/> // jeżeli użytkownik chce dostać się na stronę potwierdzającą transakcje, bez uprzedniego wybrania repozytorium, wprowadzania kwoty lub podania maila, zostanie przekierowany na stornę głowną.

} 

export default PrivateRoute
    