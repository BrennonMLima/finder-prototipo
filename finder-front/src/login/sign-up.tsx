import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/atoms/button/button';
import Input from '../components/atoms/input/input';
import Text from '../components/atoms/text/text';
import { createUser } from '../service/users';

const SignUp: React.FC = () => {
    const [name, setname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handlenameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setname(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !password) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        try{

            const {data, status} = await createUser(email, name, password)
            if (status === 201) {
                navigate('/login');
            }
        }catch(err){
            alert('Ocorreu um erro! tente novamente.')
        }
    };

    return (
        <div className="login">
            <Text variant="h1">Cadastre-se</Text>
            <Text variant="p">Olá, bem-vindo(a)!</Text>
            <form onSubmit={handleSubmit}>
                <div className='form-login'>
                    <Input type="text" placeholder="E-mail" onChange={handleEmailChange} className='text-input' />
                    <Input type="text" placeholder="Nome" onChange={handlenameChange} className='text-input' />
                    <Input type="password" placeholder="Senha" onChange={handlePasswordChange} />
                    <Button type="submit" className='margin-top'>Cadastrar </Button>
                    <p>Já tem uma conta? <Link to="/login" className='link'>Entre!</Link></p>
                </div>
            </form>
        </div>
    );
};

export default SignUp;

