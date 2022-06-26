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

function Confirm(props) {
  const email = useSelector(selectEmail);
  const money = useSelector(selectMoney);
  const title = useSelector(selectTitle);

  const [userId, setId] = useState(null);
  const [moneyInBase, setMoney] = useState(null)
  const [isExisting, setExisting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post("/sendData", { email: email, money: money, title: title });
    navigate("/")
  };

  const checkData = async () => {
    const data = await api.get("/getData");
    data.data.map((element) => {
      if (element.email === email && element.title === title) {
        setExisting(true);
        setId(element._id)
        setMoney(element.money)
      }
    });
  };


  useEffect(() => {
    checkData();
  }, []);

  const setButton = (e) => {
    const button = document.querySelector(".confirmButton");
    if (e.target.checked) {
      button.removeAttribute("disabled");
    } else {
      button.setAttribute("disabled", true);
    }
  };

  return (
    <FancyDiv>
      {isExisting ? (
        <ExistingData isExisting={setExisting} moneyInBase={moneyInBase} userId={userId} />
      ) : (
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
