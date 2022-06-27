import api from "../services/api";
import { useEffect, useState } from "react";
import Buttons from "./Buttons";
import { nanoid } from "nanoid";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";

// ---------------------------------STYLE---------------------------------------//

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

//------------------------------------ KOMPONENT -----------------------------//

let elements = null; // wszystkie pobrane nazwy repozytoriów

function ReposList(props) {
  const MAX_ELEMENTS = 10; // maksymalna liczba elementów na stronie

  let maxElements = []; // tablica trzymająca nazwy repozytoriów, skrócona do ilości elementów na stronę, równej MAX_ELEMENTS

  const [reposNames, setReposNames] = useState(null); // wyświetlane repozytoria
  const [numberOfButtons, setButtons] = useState(null); // stan przechowujący liczbe przycisków do paginacji

  const handlePagination = (event) => {
    let page = event.target.dataset.id; // rozpoznanie konkretnego przycisku po jego id
    setNewElements((page - 1) * 10); // paginacja
    setReposNames(maxElements);   // aktualizacja stanu reposNames
  };

  useEffect(() => {
    const getReposNames = async () => {     // funkcja pobierająca dane z API przy stworzeniu komponentu
      const reposAndUsers = await api.get("/");       
      const { reposNames, data } = reposAndUsers.data;
      elements = reposNames.map((element) => {                            // mapowanie wyników pobranych danych
        const foundUser = data.filter((user) => user.title === element);    // sprawdzenie czy repozytorium o danej nazwie znajduje się już w bazie patronów
        const userInfo = foundUser.map((element) => (                       // jeżeli tak, do zmiennej userInfo trafiają informacje odnośnie danego patrona
          <FancyPatronContainter key={nanoid()}>
            <FancyTitle>Patron:</FancyTitle>
            <p>Email: <FancyPatronInfo>{element.email}</FancyPatronInfo></p>
            <p>Kwota: <FancyPatronInfo>{element.money} PLN</FancyPatronInfo></p>
          </FancyPatronContainter>
        ));
        if (foundUser) {                // jeżeli patron został znaleziony, zwracana jest element listy wzbogacony o informacje o patronie
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
        } else {                // jeżeli nie, zwracany jest zwyczajny element listy
          return (
            <li key={nanoid()}>
              {<MyLink to={`/${element}`}>{element}</MyLink>}
            </li>
          );
        }
      });
    };
    getReposNames().then((response) => {
      setNewElements(0);                // przy pierwszym stworzeniu komponentu wyświetlane są elementy z pierwszej strony
      setReposNames(maxElements);
      setButtons(elements.length / MAX_ELEMENTS); // obsługa ilości przycisków wyświetlanych na ekranie w zależności od ilości elementów zwracanych na backu oraz maksymalnej ilości, która może się pojawić na ekranie
    });
  }, []);

  const setNewElements = (page) => {      // obsługa paginacji
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
