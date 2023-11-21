import React from "react";
import ConfirmPupUp from "../../../common/ConfirmPopUp";

const NewEmployee = ({ show, cancel }) => {
  return (
    <ConfirmPupUp
      show={show}
      hide={cancel}
      title={"Nowy dział"}
      decline={cancel}
      declineText={"Anuluj"}
      confirmText={"Zapisz"}>
      adsas
    </ConfirmPupUp>
  );
};

export default NewEmployee;
