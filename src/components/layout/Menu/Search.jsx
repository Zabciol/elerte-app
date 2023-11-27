import React, { useState, useRef, useEffect } from "react";
import { Form } from "react-bootstrap";
import "../../../styles/Home/search.css";
const Search = () => {
  const max_width = 1200;

  const [searchValue, setSearchValue] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const searchRef = useRef(null);

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setSearchValue("");
      setIsExpanded(false);
    }
  };

  const handleSearchIconClick = () => {
    if (window.matchMedia(`(min-width: ${max_width}px)`).matches) {
      setIsExpanded(true);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className='search-bar' ref={searchRef} onClick={handleSearchIconClick}>
      <Form.Control
        type='search'
        placeholder='Search'
        className={`search-input ${isExpanded ? "expanded" : ""}`}
        aria-label='Search'
        value={searchValue}
        onChange={handleInputChange}
      />
      <i
        className={`bi bi-search search-icon ${searchValue ? "hidden" : ""}
        ${isExpanded ? "p-0" : "p-3 pe-0 "}`}></i>
    </div>
  );
};

export default Search;
