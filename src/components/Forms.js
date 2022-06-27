import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { saveData } from "../features/slices/reposSlice";
import styled from "@emotion/styled";

// ---------------------------------STYLE---------------------------------------//

const FancyDiv = styled.div({
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  alignItems: "center",
  height: "100vh"
});

const FancyHeader = styled.h1({
  position: "absolute",
  top: 40,
  marginTop: 0,
  paddingTop: "20px",
  marginLeft: "10px",
  textShadow: "4px 4px 6px rgba(66, 68, 90, 1);",
})

const FancySpan = styled.span({
  color: "white",
  textShadow: "4px 4px 6px rgba(66, 68, 90, 1);",
});

const FancyForm = styled.form({
  display: "flex",
  flexDirection: "column",
  rowGap: "30px"
})

const FancyInput = styled.input({
  padding: "10px 8px 10px 8px",
  borderRadius: "5px",
  border: "none",
  "&:focus": { outlineStyle:"solid", outlineColor: "red" },
});

const FancyButton = styled.button({
  paddingTop: "20px",
  paddingBottom: "20px",
  borderRadius: "5px",
  cursor: "pointer",
  border:"none",
  "&:hover": { backgroundColor: "rgb(66, 227, 245)", color: "white" },
});

//------------------------------------ KOMPONENT -----------------------------//

function Forms(props) {
  const [email, setEmail] = useState("");   // stan emaila
  const [money, setMoney] = useState(0);    //stan pieniędzy

  const params = useParams();   //odczyt konkretnej nazwy repo z linku
  let navigate = useNavigate(); //nawigacja po stronie
  const dispatch = useDispatch(); //obsługa akcji z reduxa

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleMoneyChange = (e) => {
    setMoney(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(saveData({ email: email, money: money, title: params.title }));
    navigate("/confirm");
  };

  return (
    <FancyDiv>
      <FancyHeader>
        Nazwa repozytorium: <FancySpan>{params.title}</FancySpan>
      </FancyHeader>
      <FancyForm onSubmit={handleSubmit}>
        <FancyInput
          placeholder="Email"
          type="email"
          onChange={handleEmailChange}
        ></FancyInput>
        <FancyInput
          placeholder="PLN"
          type="number"
          min={0.1}
          step={0.01}
          max={2500}
          onChange={handleMoneyChange}
        ></FancyInput>
        <FancyButton type="submit">Confirm</FancyButton>
      </FancyForm>
    </FancyDiv>
  );
}

export default Forms;
