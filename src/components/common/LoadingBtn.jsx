import { useState } from "react";
import Button from "react-bootstrap/Button";
import PopUp from "./PopUp";

function LoadingButton({ action, data, buttonText, ...props }) {
  const [isLoading, setLoading] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await action();
      setResponseMessage(response.message);
      setShowPopUp(true);
    } catch (error) {
      console.error("Wystąpił błąd:", error);
      setResponseMessage("Wystąpił błąd podczas komunikacji z serwerem.");
      setShowPopUp(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant='primary'
        disabled={isLoading}
        onClick={!isLoading ? handleClick : null}
        {...props}>
        {isLoading ? "Loading…" : buttonText}
      </Button>
      <PopUp
        show={showPopUp}
        setShow={setShowPopUp}
        title={"Powiadomienie"}
        message={responseMessage}></PopUp>
    </>
  );
}

export default LoadingButton;
