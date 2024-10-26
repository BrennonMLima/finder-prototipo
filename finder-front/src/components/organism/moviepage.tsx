import React from "react";
import { GiNightSleep } from "react-icons/gi";
import { GiPopcorn } from "react-icons/gi";
import FilmesContainer from "../moleculews/filmes-container";
import Navbar from "../molecules/navbar";

const MoviePage: React.FC = () => {
  const titulos = ["Urso do Pó Branco", "Internet o FIlme", "Bebês Geniais 2"];

  const imagens = ["urso.jpeg", "internet.jpg", "bebegenio.jpeg"];

  const descricoes = [
    "Depois de uma operação de contrabando de drogas fracassada, um urso negro ingere uma grande quantidade de cocaína e começa um tumulto movido a drogas.",
    "Em uma convenção de youtubers, os personagens entram em vários conflitos uma vez que todos os youtubers estão em busca da fama a qualquer preço.",
    "Os bebês geniais, juntam-se para combater um poderoso e perigoso chefe, com a intenção de lançar um satélite para controlar a mente dos humanos.",
  ];

  return (
    <div className="page">
      <div>
        <FilmesContainer
          titulos={titulos}
          imagens={imagens}
          descricoes={descricoes}
        />
      </div>
      <div className="buttonsYN">
        <GiNightSleep id="no" />
        <GiPopcorn id="yes" />
      </div>
      <div>
        <Navbar />
      </div>
    </div>
  );
};

export default MoviePage;
