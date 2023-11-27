import React, { useState, useRef, useEffect } from "react";
import { Form } from "react-bootstrap";
import "../../../styles/Home/search.css";

const Search = ({ searchValue, setSearchValue }) => {
  const max_width = 1200;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  const handleClickOutside = (event) => {
    if (
      searchRef.current &&
      !searchRef.current.contains(event.target) &&
      !searchValue
    ) {
      setIsExpanded(false);
    }
  };

  const handleSearchIconClick = () => {
    if (window.matchMedia(`(min-width: ${max_width}px)`).matches) {
      setIsExpanded(true);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleInputFocus = () => {
    if (searchValue) setIsFocused(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
  };

  const changeHandler = (e) => {
    setSearchValue(e.target.value);
    if (!isFocused) setIsFocused(true);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchValue]);

  return (
    <div className='search-bar' ref={searchRef} onClick={handleSearchIconClick}>
      <Form.Control
        type='search'
        placeholder='Search'
        className={`search-input ${isExpanded ? "expanded" : ""}`}
        aria-label='Search'
        value={searchValue}
        onChange={changeHandler}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        ref={inputRef}
      />
      {!isFocused && (
        <i
          className={`bi bi-search search-icon ${
            isExpanded ? "p-0" : "p-3 pe-0 "
          }`}></i>
      )}
    </div>
  );
};

export default Search;
