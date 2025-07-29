import React from "react";
import Slider from "react-slick";

const images = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=1920&q=80",
];

const settings = {
  dots: false,
  infinite: true,
  speed: 1000,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 6000,
  fade: true,
  arrows: false,
  pauseOnHover: false,
};

export default function BackgroundCarousel() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        overflow: "hidden",
      }}
    >
      <Slider {...settings}>
        {images.map((url, idx) => (
          <div key={idx}>
            <div
              style={{
                width: "100vw",
                height: "100vh",
                backgroundImage: `linear-gradient(rgba(20,20,30,0.45),rgba(20,20,30,0.45)), url(${url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "background-image 1s",
              }}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
