import React, { useEffect, useState } from "react";
import Nav from "react-bootstrap/Nav";
import Carousel from "react-bootstrap/Carousel";
import Presence from "./Presence";

const Home = ({ user, setMenuItems }) => {
  const menuItems = <></>;

  const [filteredImages, setFilteredImages] = useState([]);

  function importAllImages(r) {
    return r.keys().map(r);
  }
  const images = importAllImages(
    require.context("../../../assets/Carousel", false, /\.(png|jpe?g|svg)$/)
  );

  useEffect(() => {
    setMenuItems(menuItems);
  }, []);
  return (
    <>
      <Carousel>
        <Carousel.Item>
          <img
            className='d-block w-100 h-100'
            src={images[0]}
            alt='First slide'
          />
          <Carousel.Caption>
            <Presence user={user} />
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className='d-block w-100 h-100'
            src={images[1]}
            alt='Second slide'
          />
          <Carousel.Caption>
            <h3>Second slide label</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className='d-block w-100 h-100'
            src={images[2]}
            alt='Third slide'
          />
          <Carousel.Caption>
            <h3>Third slide label</h3>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </>
  );
};

export default Home;
