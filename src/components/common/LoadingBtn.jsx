import { useEffect, useState } from "react";
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
      //setTimeout(() => window.location.reload(), 2000);
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
        className='loading-btn'
        variant='primary'
        disabled={isLoading}
        onClick={!isLoading ? handleClick : null}
        {...props}>
        {isLoading ? "Ładowanie" : buttonText}
      </Button>
      <PopUp
        show={showPopUp}
        setShow={setShowPopUp}
        title={"Powiadomienie"}
        message={responseMessage}
        reload={true}></PopUp>
    </>
  );
}

export default LoadingButton;
