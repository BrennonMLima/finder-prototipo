import React, { useState } from "react";
import styled from "styled-components";
import Input from "../atoms/input/input";
import Button from "../atoms/button/button";
import { createGroup } from "../../service/groups";

interface GroupProps {
    onClose: () => void;
    
}

const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    justify-content: center;
    position: relative;
    background-color: var(--primary);
    margin: auto;
    border: 2px solid var(--primary);
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    border-radius: 10px;
`;

const ModalHeader = styled.div`
    display: flex;
    padding: 5px;
    justify-content: center;
    background-color: var(--secondary);
    width: 100%;
    color: white;
    border-radius: 10px 10px 0px 0px;
`;

const ModalBody = styled.div`
    display: flex;
    gap: 10px;
    flex-direction: column;
    justify-content: center;
    padding: 10px 50px 20px 20px;
    color: white;
`;

const ModalButton = styled.button`
    padding: 5px 15px;
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
`;

const ModalFooter = styled.div`
    display: flex;
    padding: 5px;
    justify-content: end;
    gap: 15px;
    background-color: var(--secondary);
    border-radius: 0px 0px 10px 10px;
`;

const TextArea = styled.textarea`
    resize: none;
    color: white;
    border-radius: 10px;
    padding: 13px 10px;
    background: var(--white);
    border: 0.07rem solid #e3e3e3;
    box-shadow: 0rem 0.4rem 1.6rem rgba(22, 22, 22, 0.1);
    cursor: blink;
`;

const NewGpModal: React.FC<GroupProps> = ({ onClose }) => {
    const [groupName, setGroupName] = useState("");
    const [groupDescription, setGroupDescription] = useState("");
    const [groupGenres, setGroupGenres] = useState("");
    const [groupMembersEmails, setGroupMembersEmails] = useState("");

    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    const handleSaveGroup = async () => {
        try {
            const emailsArray = groupMembersEmails.split(",").map(email => email.trim());

            await createGroup(groupName, groupDescription, groupGenres, emailsArray);
            onClose();
            // Optionally, you can add logic to refresh the groups list or show a success message
        } catch (error) {
            console.error("Erro ao criar grupo:", error);
            // Handle error (e.g., show error message)
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <ModalContent>
                <ModalHeader><h3>Criar novo grupo</h3></ModalHeader>
                <ModalBody>
                    <span>Nome do Grupo:</span>
                    <Input
                        type="text"
                        placeholder="Nome do Grupo"
                        className="group-input"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                    />

                    <span>Descrição do Grupo:</span>
                    <TextArea
                        id="descricaoGrupo"
                        rows={3}
                        placeholder="ex: grupo de amigos que adoram assistir filmes"
                        value={groupDescription}
                        onChange={(e) => setGroupDescription(e.target.value)}
                    />

                    <span>Gêneros:</span>
                    <Input
                        type="text"
                        placeholder="ex: comédia, terror, romance..."
                        className="group-input"
                        value={groupGenres}
                        onChange={(e) => setGroupGenres(e.target.value)}
                    />

                    <span>Emails dos Membros:</span>
                    <TextArea
                        rows={5}
                        placeholder="ex: fulano@gmail.com, ciclano@gmail.com..."
                        value={groupMembersEmails}
                        onChange={(e) => setGroupMembersEmails(e.target.value)}
                    />
                </ModalBody>
                <ModalFooter>
                    <ModalButton id="closebtn" onClick={onClose}>Sair</ModalButton>
                    <ModalButton onClick={handleSaveGroup}>Salvar</ModalButton>
                </ModalFooter>
            </ModalContent>
        </div>
    );
};

export default NewGpModal;
