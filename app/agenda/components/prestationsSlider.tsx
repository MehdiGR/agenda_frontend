import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Prestation from "./prestation";

const PrestationSlider = ({ prestations, addPrestation }) => {
  // Slider settings
  // const settings = {
  //   dots: true,
  //   infinite: true,
  //   speed: 500,
  //   slidesToShow: 3,
  //   slidesToScroll: 3,
  //   variableWidth: true,
  //   arrows: true,
  //   rows: prestations.length > 5 ? 2 : 1,
  //   // slidesPerRow: 2,
  //   // centerMode: true,
  // };
  return (
    <div className="flex flex-wrap pb-16">
      {/* <Slider {...settings}> */}
      {prestations?.map((prestation: any, index: number) => {
        return (
          <div key={index} className="w-[200px] h-[200px] mx-2 cursor-pointer">
            <Prestation prestation={prestation} addPrestation={addPrestation} />
          </div>
        );
      })}
      {/* </Slider> */}
    </div>
  );
};

export default PrestationSlider;
