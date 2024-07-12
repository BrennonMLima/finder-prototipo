import api from "./api";

export const getAllGroups = async () => {
    return await api.get('/group');
};

export const getGroupById = async (groupId: string) => {
    try {
        const response = await api.get(`/group/${groupId}`);
        return response.data.groups; // Retorne diretamente os dados do grupo
    } catch (error) {
        console.error(`Erro ao obter grupo com ID ${groupId}:`, error);
        throw new Error(`Erro ao obter grupo com ID ${groupId}`);
    }
};

export const createGroup = async (name: string, description: string, genre: string, userEmails: string[]) => {
    return await api.post('/group', { name, description, genre, userEmails});
};

export const deleteGroup = async (groupId: string) => {
    try {
        await api.delete(`/group/${groupId}`);
    } catch (error) {
        console.error(`Erro ao deletar grupo com ID ${groupId}:`, error);
        throw error;
    }
};

export const getUsersInGroup = async (groupId: string) => {
    return await api.get(`/group/${groupId}/users`);
  }