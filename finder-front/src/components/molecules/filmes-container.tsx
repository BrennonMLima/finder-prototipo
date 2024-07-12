import React, { useState, TouchEvent } from 'react';
import Text from '../atoms/text/text';
import GlobalStyles from '../../styles/GlobalStyles';

interface FilmesContainerProps {
  titulos: string[];
  imagens: string[];
  descricoes: string[];
}

const FilmesContainer: React.FC<FilmesContainerProps> = ({titulos, imagens, descricoes }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imagens.length);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touchStartX = e.changedTouches[0].clientX;

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      if (touchStartX - touchEndX > 50) handleSwipe();
      if (touchEndX - touchStartX > 50) handleSwipe();
      e.target.removeEventListener('touchend', handleTouchEnd as any);
    };

    e.target.addEventListener('touchend', handleTouchEnd as any);
  };

  return (
    <div className="filmes-container">
      <div
        className="filme-item"
        onTouchStart={handleTouchStart}
      > 
        <Text variant="h1">{titulos[currentIndex]}</Text>
        <img src={process.env.PUBLIC_URL + imagens[currentIndex]} alt={`Imagem ${currentIndex}`} />
        <Text variant="p" >{descricoes[currentIndex]}</Text>
      </div>
    </div>
  );
};

export default FilmesContainer;