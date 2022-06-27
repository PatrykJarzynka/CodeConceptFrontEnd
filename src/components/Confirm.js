import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  selectEmail,
  selectMoney,
  selectTitle,
} from "../features/slices/reposSlice";
import api from "../services/api";
import ExistingData from "./ExistingData";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";

// ---------------------------------STYLE---------------------------------------//

const FancyDiv = styled.div({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
})

const FancyHeader = styled.h1({
  display: "flex",
  justifyContent: "center",
  textShadow: "4px 4px 6px rgba(66, 68, 90, 1);",
  margin: 0,
  paddingTop: "30px"
})

const FancyInfo = styled.div({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%);",
  fontWeight: 700
})

const FancyForm = styled.form({
  position: "absolute",
  top: "80%",
  left: "50%",
  transform: "translate(-50%, -50%);",
  
})

const FancyData = styled.span({
  color: "white"
})

const FancyButton = styled.button(props => ({
  marginLeft: "20px",
  fontWeight: 700,
  paddingTop: "10px",
  paddingBottom: "10px",
  borderRadius: "5px",
  
  cursor:"pointer",
  border:"none",
  "&:hover":{ backgroundColor: "rgb(66, 227, 245)", color: "white" },
  "&:disabled:hover":{ pointerEvents: "none"}
}));

//------------------------------------ KOMPONENT -----------------------------//

function Confirm(props) {
  const email = useSelector(selectEmail); // selektor emaila
  const money = useSelector(selectMoney);   //selektor pieniędzy
  const title = useSelector(selectTitle);   //selektor nazwy repo

  const [userId, setId] = useState(null);     //stan id użytkownika
  const [moneyInBase, setMoney] = useState(null)    //stan pieniędzy na backu
  const [isExisting, setExisting] = useState(false);    //stan określający czy dany użytkownik wpłacił uprzednio jakąś kwote na konkretne repo czy też nie

  const navigate = useNavigate(); // nawigacja

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post("/sendData", { email: email, money: money, title: title });  // wysłanie danych na backend
    navigate("/") // powrót na stronę główną
  };

  const checkData = async () => {         // funkcja sprawdzajaca czy dany użytkownik wpłacił uprzednio pieniądze na konkretne repo
    const data = await api.get("/getData");   // pobranie danych z backu
    data.data.map((element) => {                  // mapowanie danych z backu
      if (element.email === email && element.title === title) {   // jeżeli użytkownik, który chce zainwestować jakąś kwote jest już w bazie danych z przypisanym do niego tytułem repo, równym tytuowi na który chce wpłacić, ustawiany jest stan że taki uzytkownik już istnieje
        setExisting(true);
        setId(element._id)    // ustawienie id konkretnego użytkownika
        setMoney(element.money)  // ustawienie pieniędzy, które są aktualnie wpłacone na backu
      }
    });
  };


  useEffect(() => { // przy pierwszym wejściu na stronę, sprawdzane jest czy użytkownik istnieje już w bazie danych
    checkData();
  }, []);

  const setButton = (e) => { // funkcja obsługująca wyłączanie i włączanie przycisku w zależności od checkboxa
    const button = document.querySelector(".confirmButton");
    if (e.target.checked) {
      button.removeAttribute("disabled");
    } else {
      button.setAttribute("disabled", true);
    }
  };

  return (
    <FancyDiv>
      {isExisting ? ( // jeżeli użytkownik istnieje w bazie danych i ma przypisany tytuł, w który chce zainwestować, pojawia się nowy komponent
        <ExistingData isExisting={setExisting} moneyInBase={moneyInBase} userId={userId} />
      ) : ( //jeżeli nie, pojawia się podsumownie
        <div>
          <FancyHeader>PODSUMOWANIE:</FancyHeader>
          <FancyInfo>
          <p>Tytuł repozytorium: <FancyData>{title}</FancyData></p>
          <p>Email: <FancyData>{email}</FancyData></p>
          <p>Ilość pieniędzy: <FancyData>{money} PLN</FancyData></p>
          </FancyInfo>
          <FancyForm onSubmit={handleSubmit}>
            <input type="checkbox" name="confirm" onClick={setButton}></input>
            <label htmlFor="confirm">
              Potwierdzam iż powyższe dane są prawidłowe
            </label>
            <FancyButton disabled type="submit" className="confirmButton">
              Confirm
            </FancyButton>
          </FancyForm>
        </div>
      )}
    </FancyDiv>
  );
}

export default Confirm;
