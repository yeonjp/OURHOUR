import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import pic1 from "../assets/1.jpg";
import pic2 from "../assets/2.jpg";
import pic3 from "../assets/3.jpg";
import pic4 from "../assets/4.jpg";
import pic5 from "../assets/5.jpg";
import pic6 from "../assets/6.jpg";
import pic7 from "../assets/7.jpg";
import pic8 from "../assets/8.jpg";
import pic9 from "../assets/9.jpg";
import pic10 from "../assets/10.jpg";
import pic11 from "../assets/11.jpg";
import pic12 from "../assets/12.jpg";
import pic13 from "../assets/13.jpg";
import pic14 from "../assets/14.png";
import pic15 from "../assets/15.jpg";
import pic16 from "../assets/16.jpg";
import pic17 from "../assets/17.jpg";
import pic18 from "../assets/18.jpg";
import pic19 from "../assets/19.png";
import pic20 from "../assets/20.jpg";
import pic21 from "../assets/21.png";
import pic22 from "../assets/22.jpg";
import pic23 from "../assets/23.jpg";
import pic24 from "../assets/24.jpg";
import pic25 from "../assets/25.png";
import pic26 from "../assets/26.jpg";
import pic27 from "../assets/27.jpg";
import pic28 from "../assets/28.jpg";
import pic29 from "../assets/29.jpg";
import pic30 from "../assets/30.jpg";
import pic31 from "../assets/31.jpg";
import pic32 from "../assets/32.jpg";
import pic33 from "../assets/33.jpg";
import pic34 from "../assets/34.jpg";


function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

function Move() {
  const images = [
    pic1, pic2, pic3, pic4, pic5, pic6, pic7, pic8, pic9,
    pic10, pic11, pic12, pic13, pic14, pic15, pic16, pic17, pic18, pic19, pic20,
    pic21, pic22, pic23, pic24, pic25, pic26, pic27, pic28, pic29,
    pic30, pic31, pic32, pic33, pic34
  ];
  const shuffledImages1 = shuffle([...images]);
  const shuffledImages2 = shuffle([...images]);
  const shuffledImages3 = shuffle([...images]);
  const column1Ref = useRef(null);
  const column2Ref = useRef(null);
  const column3Ref = useRef(null);

  useEffect(() => {
    const column1 = column1Ref.current;
    const column2 = column2Ref.current;
    const column3 = column3Ref.current;

    for (let i = 0; i < 90; i++) {
      const img1 = document.createElement("img");
      img1.src = shuffledImages1[i % 34];
      img1.alt = `Image ${i % 34 + 1}`;
      img1.className = "w-48 h-60 object-cover m-1 border-4 border-white";
      column1.appendChild(img1);

      const img2 = document.createElement("img");
      img2.src = shuffledImages2[i % 34];
      img2.alt = `Image ${i % 34 + 1}`;
      img2.className = "w-48 h-60 object-cover m-1 border-4 border-white";
      column2.appendChild(img2);

      const img3 = document.createElement("img");
      img3.src = shuffledImages3[i % 34];
      img3.alt = `Image ${i % 34 + 1}`;
      img3.className = "w-48 h-60 object-cover m-1 border-4 border-white";
      column3.appendChild(img3);
    }

    gsap.to(column1.children, {
      yPercent: -100 * (column1.children.length / 2),
      repeat: -1,
      duration: 240,
      ease: "linear"
    });

    gsap.to(column2.children, {
      yPercent: 100 * (column2.children.length / 2),
      repeat: -1,
      duration: 240,
      ease: "linear"
    });

    gsap.to(column3.children, {
      yPercent: -100 * (column3.children.length / 2),
      repeat: -1,
      duration: 240,
      ease: "linear"
    });

  }, [shuffledImages1, shuffledImages2, shuffledImages3]);

  return (
    <div 
      className="flex justify-center items-center overflow-hidden md:mt-0 md:mb-0 md:ml-0" 
      style={{ 
        height: '97vh', 
        marginTop: '-95px', 
        marginBottom: '20px', 
        marginLeft: '-40px'
      }}
    >
      <div className="container flex flex-row items-start flex-wrap md:flex-nowrap">
        <div id="column1" ref={column1Ref} className="hidden md:flex flex-col w-1/3"></div>
        <div id="column2" ref={column2Ref} className="hidden md:flex flex-col w-1/3"></div>
        <div id="column3" ref={column3Ref} className="hidden md:flex flex-col w-1/3"></div>
      </div>
    </div>
  );
}



export default Move;
