import { nanoid } from "nanoid";
import styled from "@emotion/styled";

const FancyButton = styled.button({
  padding: "20px 30px 20px 30px",
  borderRadius: "10px",
  border: "none",
  boxShadow: "5px -1px 42px -11px rgba(66, 68, 90, 1)",
  cursor: "pointer",
  "&:hover": { backgroundColor: "rgb(66, 227, 245)", color: "white" },
});

const FancyDiv = styled.div({
  position: "absolute",
  bottom: "100px",
  display: "flex",
  justifyContent: "center",
  width: "100%",
  columnGap: "20px",
});

function Buttons(props) {
  let buttons = [];

  for (let i = 0; i < props.howMany; i++) {
    buttons.push(
      <FancyButton
        type="button"
        onClick={props.onClick}
        data-id={i + 1}
        key={nanoid()}
      >
        {i + 1}
      </FancyButton>
    );
  }

  return <FancyDiv>{buttons}</FancyDiv>;
}

export default Buttons;
