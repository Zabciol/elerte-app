import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const PasswordInput = ({ inputRef, type, placeholder, onKeyDown }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Form.Control
        ref={inputRef}
        type={showPassword ? "text" : type}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
      />
      <Button
        variant='outline-secondary'
        size='sm'
        className='password-btn_hide-show'
        onClick={togglePasswordVisibility}>
        {showPassword ? "Ukryj hasło" : "Pokaż hasło"}
      </Button>
    </>
  );
};

export default PasswordInput;
