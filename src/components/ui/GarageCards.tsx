import React, { useRef, useState } from 'react';
import AutoShopCard from './GarageCard';
import GarageImage from '@/assets/images/garage.jpg';
import { Vehicle } from '@/types';

interface GarageCardsProps {
  cars: Vehicle[];
}

const GarageCards: React.FC<GarageCardsProps> = ({ cars }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDown(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDown(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="garage-cards-container">
      <div
        ref={scrollRef}
        className="garage-cards-scroll"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ cursor: isDown ? 'grabbing' : 'grab' }}
      >
        <div className="garage-cards-content">
          {cars.map((car, index) => (
            <div key={index} className="garage-card-wrapper">
              <AutoShopCard image={{ src: GarageImage.src }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GarageCards;

