import React from "react";
import { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";

const ReposList = lazy(()=> import('./components/ReposList'));
const Forms = lazy(()=> import('./components/Forms'));
const Confirm = lazy(()=> import('./components/Confirm'));
const PrivateRoute = lazy(()=> import('./routes/PrivateRoute'));

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<Suspense fallback={<div>Loading...</div>}><ReposList /></Suspense>}></Route>
        <Route path=":title" element={<Suspense fallback={<div>Loading...</div>}><Forms /></Suspense>}></Route>
        <Route element={<PrivateRoute />}>
          <Route path="confirm" element={<Suspense fallback={<div>Loading...</div>}><Confirm/></Suspense>} />
        </Route>
      </Routes>
    </Provider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
