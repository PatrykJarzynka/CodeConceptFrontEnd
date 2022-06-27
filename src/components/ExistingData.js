import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import styled from "@emotion/styled";

// ---------------------------------STYLE---------------------------------------//

const FancyButtonWrapper = styled.div({
  marginTop: "30px",
  display: "flex",
  flexDirection: "column",
  rowGap: "20px",
  alignItems: "center"
})

const FancyButton = styled.button(props=>({
  padding: "10px",
  borderRadius: "5px",
  cursor:"pointer",
  border:"none",
  "&:hover":{ backgroundColor: "rgb(66, 227, 245)", color: "white" },
  position: props.name === "return" ? "absolute" : "static",
  bottom: 0,
  marginBottom: props.name === "return" ? "50px" : 0
}))

const FancyInput = styled.input({
  padding: "10px 8px 10px 8px",
  borderRadius: "5px",
  border: "none",
  "&:focus": { outlineStyle:"solid", outlineColor: "red" },
});

const FancyDiv = styled.div({
  display:"flex",
  justifyContent:"center",
  columnGap: "10px"
})

const FancyContainer = styled.div({
  marginTop: "auto",
  marginBottom: "auto"
})

const FancyInfo = styled.p({
  fontWeight: 700,
  marginTop: "30px",
})

const FancyValue = styled.span({
  color: "white"
})

//------------------------------------ KOMPONENT -----------------------------//

function ExistingData({ moneyInBase, userId }) {
  const [changedValue, setChange] = useState(null); // stan, który przechowuje informacje o zmienionej kwocie na backendzie
  const [newValue, setValue] = useState(null);      // stan przechowujący informacje o nowej kwocie do zmiany
  const [edit, setEdit] = useState(false);    // stan decydujacy czy wyświetlony ma zostać input do wprowadzania zmiany kwoty 

  let navigate = useNavigate();   //nawigacja

  const handleEdit = () => {
    setEdit(true);
  };

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleClick = async () => {
    await api.patch("/patchData", { money: newValue, _id: userId });    // aktualizacja danych na bakcu
    const data = await api.get("/getData");                             // pobranie zaktualizowanych danych
    const user = data.data.find((element) => element._id === userId);   // znalezienie konkretnego patrona 
    setChange(user.money);                                              // aktualizacja stanu wyświetlanych pieniędzy na stronie
  };

  const handleBack = () => {    // powrót na stronę główną
    navigate("/");
  };

  return (
    <FancyContainer>
      <FancyInfo>Podany email zainwestował już pieniądze w te repozytorium.</FancyInfo>
      <FancyInfo>
        Aktualna wpłacona kwota: <FancyValue>{" "}
        {changedValue !== null ? changedValue : moneyInBase} PLN</FancyValue>
      </FancyInfo>
      <FancyButtonWrapper>
        <FancyButton type="button" onClick={handleEdit}>
        Edytuj kwote
      </FancyButton>
       {edit ? (
        <FancyDiv>
          <FancyInput
            type="number"
            min={0.1}
            max={2500}
            step={0.1}
            onChange={handleInput}
          ></FancyInput>
          <FancyButton type="button" onClick={handleClick}>
            {" "}
            OK{" "}
          </FancyButton>
        </FancyDiv>
      ) : null}
      <FancyButton name="return" type="button" onClick={handleBack}>
        Powrót na stronę główną
      </FancyButton>
      </FancyButtonWrapper>
     
    </FancyContainer>
  );
}

export default ExistingData;
