import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import PopUp from "./PopUp";

function LoadingButton(props) {
  const [isLoading, setLoading] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);

  useEffect(() => {
    function simulateNetworkRequest() {
      return new Promise((resolve) => setTimeout(resolve, 2000));
    }

    if (isLoading) {
      simulateNetworkRequest().then(() => {
        setLoading(false);
        setShowPopUp(true);
      });
    }
  }, [isLoading]);

  const handleClick = () => {
    props.onClick();
    setLoading(true);
  };

  return (
    <>
      <Button
        variant='primary'
        disabled={isLoading}
        onClick={!isLoading ? handleClick : null}>
        {isLoading ? "Loading…" : "Click to load"}
      </Button>
      <PopUp
        show={showPopUp}
        setShow={setShowPopUp}
        title={"Tytuł"}
        message={"Wysłano ECP"}></PopUp>
    </>
  );
}

export default LoadingButton;
