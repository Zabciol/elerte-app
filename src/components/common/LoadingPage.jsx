import React from "react";
import Spinner from "react-bootstrap/Spinner";

const LoadingPage = () => {
  return (
    <div className='loading-page'>
      <Spinner animation='border' role='status'>
        <span className='visually-hidden'>Loading...</span>
      </Spinner>
    </div>
  );
};

export default LoadingPage;
