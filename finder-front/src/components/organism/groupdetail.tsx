import React, { useState, useEffect } from 'react';
import Button from '../atoms/button/button';
import Navbar from '../molecules/navbar';
import styled from 'styled-components';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaTrashAlt } from "react-icons/fa";
import { getGroupById, getUsersInGroup, deleteGroup } from '../../service/groups';

const EventDate = styled.div`
    display: flex;
    gap: 10px;
`;

const LocalEvent = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 20px;
`;

const EventHeader = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 10px;
`;

const EventInfo = styled.div`
    background-color: #37393B;
    border: 2px solid var(--primary);
    margin: 15px 0px;
    padding: 5px 20px;
    border-radius: 20px;
`;

const RankingBtn = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Members = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 55px;
`;

const Footer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
`;

const GroupDetail: React.FC = () => {
    const { groupId } = useParams<{ groupId: string }>();
    const [groupName, setGroupName] = useState<string>('');
    const [groupDescription, setGroupDescription] = useState<string>('');
    const [members, setMembers] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGroupDetails = async () => {
            if (groupId) {
                try {
                    const group = await getGroupById(groupId);
                    console.log('Group data:', group);
                    setGroupName(group.name);
                    setGroupDescription(group.description);

                    const membersResponse = await getUsersInGroup(groupId);
                    setMembers(membersResponse.data);
                } catch (error) {
                    setError('Erro ao carregar dados do grupo.');
                }
            } else {
                setError('ID do grupo não fornecido.');
            }
        };

        fetchGroupDetails();
    }, [groupId]);

    const handleDeleteGroup = async () => {
        if (groupId) {
            try {
                await deleteGroup(groupId);
                navigate('/grouppage');
            } catch (error) {
                setError('Erro ao deletar o grupo.');
            }
        }
    };

    return (
        <div className="page">
            <div className='group-info'>
                <EventHeader>
                    <h2>{groupName}</h2>
                    <span>{groupDescription}</span>
                </EventHeader>
                <div className='newgroupbtn'>
                    <Link className='link' to="/rankingpage"><Button><h4>+ Novo Evento</h4></Button></Link>
                </div>
                <EventInfo>
                    <EventDate>
                        <span>Proximo evento: </span>
                        <span>xx/xx/xx</span>
                        <span>19:30</span>
                    </EventDate>
                    <LocalEvent>
                        <h2>Local: Fatec Sorocaba</h2>
                    </LocalEvent>
                </EventInfo>
                <RankingBtn>
                    <Link className='link' to="/rankingpage"><Button><h3>Ver Raking de Filmes</h3></Button></Link>
                </RankingBtn>
                <Footer>
                    <Members>
                        <h3>Membros: {members.length}</h3>
                        <span>+ Convidar via link</span>
                        {error && <p>{error}</p>}
                        {members.map((member, index) => (
                            <span key={index}>{member}</span>
                        ))}
                    </Members>
                    <div>
                        <FaTrashAlt className='buttontrash' onClick={handleDeleteGroup}/>
                    </div>
                </Footer>
            </div>
            <Navbar />
        </div>
    );
};

export default GroupDetail;
