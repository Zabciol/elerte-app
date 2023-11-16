import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Carousel from "react-bootstrap/Carousel";
import Presence from "./Presence";
import Leaves from "./Leaves";
import { getCurrentDateYearMonth } from "../../common/CommonFunctions";
import ElerteFooter from "../../../assets/Carousel/elerte-bottom.png";

const MenuItems = ({ date, setDate }) => {
  return (
    <>
      <Form.Control
        type='month'
        value={date}
        onChange={setDate}
        className='menu-select'
      />
    </>
  );
};

const Home = ({ user, setMenuItems }) => {
  const [date, setDate] = useState(getCurrentDateYearMonth());
  const [filteredImages, setFilteredImages] = useState([]);

  const changeDate = (event) => {
    setDate(event.target.value);
  };

  const importAllImages = (r) => {
    return r.keys().map(r);
  };
  const images = importAllImages(
    require.context("../../../assets/Carousel", false, /\.(png|jpe?g|svg)$/)
  );

  useEffect(() => {
    setMenuItems(<MenuItems date={date} setDate={changeDate} />);
  }, [date]);

  return (
    <>
      <Carousel>
        <Carousel.Item>
          <img
            className='d-block w-100 h-100 background'
            src={images[0]}
            alt='First slide'
          />
          <Carousel.Caption>
            <Presence user={user} date={date} />
          </Carousel.Caption>
          <img src={ElerteFooter} className='background-footer' />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className='d-block w-100 h-100 background'
            src={images[1]}
            alt='Second slide'
          />
          <Carousel.Caption>
            <Leaves user={user} date={date} />
          </Carousel.Caption>
          <img src={ElerteFooter} className='background-footer' />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className='d-block w-100 h-100 background'
            src={images[2]}
            alt='Third slide'
          />
          <Carousel.Caption>
            <h3>Third slide label</h3>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </Carousel.Caption>
          <img src={ElerteFooter} className='background-footer' />
        </Carousel.Item>
      </Carousel>
    </>
  );
};

export default Home;
