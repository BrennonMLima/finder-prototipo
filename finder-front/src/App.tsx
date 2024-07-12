import React, { useEffect, useState } from 'react';
import AppRouter from './router/router';
import GlobalStyles from './styles/GlobalStyles';
import { getCookie, setCookie } from 'typescript-cookie';
import { login } from './service/users';


const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(()=>{
    const token = getCookie("auth-token");
    if(token) setIsLoggedIn(true)
}, [])


const handleLogin = async (email: string, password: string)=> {
  try{
    const {data: {token}, status} = await login(email, password);
    if(status === 200){
      setCookie("auth-token", token)
      setIsLoggedIn(true)
  
    }
  }catch{
    alert('Login Inválido! Tente novamente.')
  }
}

  return (
    <div className="App">
      <AppRouter
        isLoggedIn={isLoggedIn}
        handleLogin={handleLogin}
      />
      <GlobalStyles/>
    </div>
  );
}
export default App;