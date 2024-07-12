import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from '../components/molecules/header';
import Login from '../login/sign-in';
import SignUp from '../login/sign-up';
import GroupPage from '../components/organism/grouppage';
import MoviePage from '../components/organism/moviepage';
import ProfilePage from '../components/organism/profilepage';
import GroupDetail from '../components/organism/groupdetail';

interface RouterProps {
    isLoggedIn: boolean;
    handleLogin: (username: string, password: string) => void;
}

const AppRouter: React.FC<RouterProps> = ({
    isLoggedIn,
    handleLogin,
}) => {

    return (
        <Router>
            <div className="App">
                <Header />
                <div className="main">
                    {isLoggedIn ? (
                        <>
                        <Routes>
                        <Route path="/" element={<MoviePage />} />
                        <Route path="/moviepage" element={<MoviePage />}/>
                        <Route path="/grouppage" element={<GroupPage />}/>
                        <Route path="/profilepage" element={<ProfilePage />}/>
                        <Route path="/rankingpage" element={<ProfilePage />}/>
                        <Route path="/groupdetail/:groupId" element={<GroupDetail />}/>
                        </Routes>
                        </>
                    ) : (
                        <Routes>
                            <Route path="/login" element={<Login onLogin={handleLogin} />} />
                            <Route path="/signup" element={<SignUp />} />
                            <Route path="*" element={<Login onLogin={handleLogin} />} />
                        </Routes>
                    )}
                </div>
            </div>
        </Router>
    );
};

export default AppRouter;