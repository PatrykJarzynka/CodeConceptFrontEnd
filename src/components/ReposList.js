import api from "../services/api";
import { useEffect, useState } from "react";
import Buttons from "./Buttons";
import { nanoid } from "nanoid";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";

document.body.style = 'background:  linear-gradient(135deg, rgba(219,8,8,1) 0%, rgba(0,255,214,1) 100%) no-repeat fixed'

const FancyDiv = styled.div({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const newComponent = (Component) => {
  return function NewComponent(props) {
    return (
      <Component
        {...props}
        style={{
          textDecoration: "none",
          color: "white",
          fontWeight: 600,
          textShadow: "2px 3px 14px rgba(66, 68, 90, 1)",
        }}
      ></Component>
    );
  };
};

const FancyList = styled.ol({
  display: "flex",
  padding: 0,
  width: "100%",
  justifyContent: "space-evenly",
  marginTop: "40px"
});

const FancyInfo = styled.p({
  color: "white",
  textShadow: "2px 3px 14px rgba(66, 68, 90, 1)",
});

const FancyPatronContainter = styled.div({
  marginTop: "10px",
  borderBottom: "dotted 3px"
})

const FancyTitle = styled.p({
  fontWeight: 700
})

const FancyPatronInfo = styled.span({
  color: "white",
  fontWeight: 700
})
const MyLink = newComponent(Link);

let elements = null; // elementy listy

function ReposList(props) {
  const MAX_ELEMENTS = 10; // maksymalna liczba elementów na stronie

  let maxElements = []; // tablica elementów do wyświetlenia o długości MAX_ELEMENTS

  const [reposNames, setReposNames] = useState(null); // wyświetlane repozytoria
  const [numberOfButtons, setButtons] = useState(null); // stan przechowujący liczbe przycisków do paginacji

  const handlePagination = (event) => {
    let page = event.target.dataset.id;
    // obsługa paginacji
    setNewElements((page - 1) * 10);
    setReposNames(maxElements);
  };

  useEffect(() => {
    const getReposNames = async () => {
      // pobranie danych z github api
      const reposAndUsers = await api.get("/");
      const { reposNames, data } = reposAndUsers.data;
      elements = reposNames.map((element) => {
        const foundUser = data.filter((user) => user.title === element);
        const userInfo = foundUser.map((element) => (
          <FancyPatronContainter key={nanoid()}>
            <FancyTitle>Patron:</FancyTitle>
            <p>Email: <FancyPatronInfo>{element.email}</FancyPatronInfo></p>
            <p>Kwota: <FancyPatronInfo>{element.money} PLN</FancyPatronInfo></p>
          </FancyPatronContainter>
        ));
        if (foundUser) {
          return (
            <li key={nanoid()}>
              {
                <div>
                  {" "}
                  <MyLink to={`/${element}`}>{element}</MyLink>
                  {userInfo}
                </div>
              }
            </li>
          );
        } else {
          return (
            <li key={nanoid()}>
              {<MyLink to={`/${element}`}>{element}</MyLink>}
            </li>
          );
        }
      });
    };
    // wyświetlenie danych po wejściu na strone
    getReposNames().then((response) => {
      setNewElements(0);
      setReposNames(maxElements);
      setButtons(elements.length / MAX_ELEMENTS);
    });
  }, []);

  const setNewElements = (page) => {
    // paginacja
    let i = 0;
    for (i = page; i < page + MAX_ELEMENTS; i++) {
      maxElements.push(elements[i]); // wybieranie poszczególnych elementów do wyświetlenia
    }
  };

  return (
    <FancyDiv>
      <h1>ZAINWESTUJ W REPO!</h1>
      <FancyInfo>Wybierz repozytorium w które chciałbys zainwestować</FancyInfo>
      <FancyList>{reposNames}</FancyList>
      <Buttons
        onClick={(event) => handlePagination(event)}
        howMany={numberOfButtons}
      ></Buttons>
    </FancyDiv>
  );
}

export default ReposList;
