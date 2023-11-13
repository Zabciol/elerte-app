import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import PopUp from "./PopUp";
import { useAuth } from "../transitions/Login/AuthContext";

function LoadingButton({ action, data, buttonText, ...props }) {
  const { setShowPopUp, setReloadPopUp, setShowPopUpLogout, setMessage } =
    useAuth();
  const [isLoading, setLoading] = useState(false);
  //const [showPopUp, setShowPopUp] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await action();
      setMessage(response.message);
      setShowPopUp(true);
      setReloadPopUp(true);
    } catch (error) {
      console.error("Wystąpił błąd:", error);
      setMessage(error.message);
      setShowPopUpLogout(true);
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
    </>
  );
}

export default LoadingButton;
