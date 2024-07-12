import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
@import '~typeface-montserrat';

* {
margin: 0;
padding: 0;
box-sizing: border-box;
}
html, body {
    height: 100%;
    margin: 0;
    display: flex;
    flex-direction: column;
    background-color: var(--primary);
}
.main{
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
}

*, button, input {
border: 0;
outline: 0;

}
p,h1,h2{
    color: #fff;
    margin-top: 10px;
    text-decoration: none;
}
:root {
--primary: #262626;
--secondary: #333;
--tertiary: #0496ff;
}

header{
    display: flex;
    position: sticky;
    align-items: center;
    justify-content: flex-end;
    background-color: var(--secondary);
    color: #fff;
    padding-right: 5px;
}

.page{
  width: 100%;
  padding: 0px 20px;
}
.name-input{
    display: flex;
    flex-direction: row;
    margin-top: 20px;
    gap: 20px;
    align-items: center;
}
.button {
    padding: 10px 20px;
    border: 0;
    background: var(--tertiary);
    color: black;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    cursor: pointer;
    border: 1px solid #000;
  }

.text-input{
    background: var(--white);
    border: 0.07rem solid #e3e3e3;
    box-shadow: 0rem 0.4rem 1.6rem rgba(22, 22, 22, 0.1);
    border-radius: 10px;
    padding: 20px 30px;
    color: white;
    cursor: blink;
}

.group-input{
  border-radius: 10px;
  color: white;
  padding: 13px 10px;
  width: 200px;
  background: var(--white);
  border: 0.07rem solid #e3e3e3;
  box-shadow: 0rem 0.4rem 1.6rem rgba(22, 22, 22, 0.1);
  cursor: blink;
}

.login{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: 10%;
}

.form-login{
    display: flex;
    flex-direction: column;
    gap: 20px
}

.link{
    color: var(--tertiary);
}

.nav-link{
  color: #fff;
  text-decoration: none;
}

.btn-link{
  text-decoration: none;
}

.filmes-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    width: 100%;
    height: 83%;
    padding: 10px;
  }
  
.filme-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin: 1px;
  }

.filme-item img {
    width: 18.75rem;
    height: 23.75rem;
    border-radius: 10px;
    margin: 15px 0px;
  }

  .descricao {
    margin-top: 10px;
  }

  .navbar {
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: #333;
    width: 100%;
    height: 4rem;
    display: flex;
    align-items: baseline;
    justify-content: space-around;
    border-radius: 1.2rem 1.2rem 0 0;
  }
  

  .nav-item{
    display: flex;
    flex-direction: column;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer
    align-items: center;
  }

  .nav-icon{
    font-size: 28px;
    color: white;
  }

  .active{
    color: var(--tertiary);
  }

  .buttonsYN{
    font-size: 50px;
    display: flex;
    justify-content: center;
    gap: 100px;
    margin-top: 20px;
  }
  
  .buttontrash{
    font-size: 33px;
    display: flex;
    justify-content: center;
    gap: 100px;
    margin-top: 20px;
  }

  #yes{
    color: var(--tertiary);
  }
  #no{
    color: #696969;
  }

  .group-container{
    background-color: var(--secondary);
    color: #fff;
    margin: 15px 0px;
    padding: 5px 20px 5px 20px;
    border-radius: 20px;
    height: 120px;
  }

  .group-info{
    background-color: var(--secondary);
    color: #fff;
    margin: 15px 0px;
    padding: 5px 20px 5px 20px;
    border-radius: 20px;
    height: 100%;
  }

  .group-title{
    display: flex;
    width: 100%;
    justify-content: center;
  }

  .group-information{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .group{
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .newgroupbtn{
    width: 95%;
    margin-top: 30px;
    display: flex;
    justify-content: flex-end;
  }

  .event-date{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  #closebtn{
  padding: 5px 15px;
  background: var(--white);
  color: var(--tertiary);
  border: 1px solid var(--tertiary);
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.teste{
  width:90%
}

`;

