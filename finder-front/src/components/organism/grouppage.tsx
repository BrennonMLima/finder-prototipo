import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../atoms/button/button';
import Navbar from '../molecules/navbar';
import NewGpModal from '../organism/newgroupmodal';
import styled from 'styled-components';
import { getAllGroups, getUsersInGroup } from '../../service/groups';

const GroupContainer = styled.div`
  width: 100%;
  background-color: var(--secondary);
  color: #fff;
  margin: 15px 0px;
  padding: 5px 20px 5px 20px;
  border-radius: 20px;
  height: 120px;
`;

const Title = styled.div`
  display: flex;
  width: 55%;
  justify-content: center;
`;

interface Group {
  id: string;
  name: string;
  description: string;
  genre: string;
  userCount: number; // Alterado para contar o número de usuários
}

const GroupPage: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroupsAndUsers = async () => {
      try {
        const response = await getAllGroups();
        console.log("Grupos obtidos:", response.data.groups);

        if (response && response.data && response.data.groups) {
          const groups = response.data.groups;

          const groupsWithUserCount = await Promise.all(groups.map(async (group: Group) => {
            try {
              const usersResponse = await getUsersInGroup(group.id);
              console.log(`Usuários do grupo ${group.id}:`, usersResponse.data);

              return {
                ...group,
                userCount: usersResponse.data.length
              };
            } catch (error) {
              console.error(`Erro ao obter usuários do grupo ${group.id}:`, error);
              return {
                ...group,
                userCount: 0
              };
            }
          }));

          setGroups(groupsWithUserCount);
          console.log("Grupos com contagem de usuários:", groupsWithUserCount);
        }
      } catch (error) {
        console.error("Erro ao obter os grupos:", error);
      }
    };

    fetchGroupsAndUsers();
  }, []);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className="page">
      <div className="newgroupbtn">
        <Button onClick={openModal}><h4>+ Novo Grupo</h4></Button>
      </div>
      <Title><h2>Seus grupos</h2></Title>

      <div className="groups-list">
        {groups.map((group) => (
          <Link className='nav-link' to={`/groupDetail/${group.id}`} key={group.id}>
            <GroupContainer>
              <div className="group">
                <div className="group-title">
                  <h2>{group.name}</h2>
                </div>
                <div className="group-information">
                  <span>{group.userCount} participantes</span>
                  <div className="event-date">
                    <span>prox. evento:</span>
                    <span>xx/xx/xx</span>
                  </div>
                </div>
              </div>
            </GroupContainer>
          </Link>
        ))}
      </div>

      <Navbar />
      {isModalOpen && <NewGpModal onClose={closeModal} />}
    </div>
  );
};

export default GroupPage;
