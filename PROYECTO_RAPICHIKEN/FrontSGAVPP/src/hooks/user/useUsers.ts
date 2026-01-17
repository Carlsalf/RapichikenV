import {api} from "../../utils/api";
import {User} from "../../types/User";
import {useEffect, useState} from "react";

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);

    const createUser = async (data: User): Promise<boolean> => {
         const response = await api.post('/auth/local/register', {
                 ...data,
                 username: data.email,
         }).catch(response => {
             return response.response;
         });

        if (response.data?.error) {
            const { details: { errors } } = response.data.error;

            for (const { path, message } of errors) {
                if (path.includes('dni') && message.includes('unique')) {
                    alert('Este DNI ya se encuentra registrado por otro usuario');
                }
            }

            return false;
        }

         await getUsers();

         return response.status === 200;
    };

    const updateUser = async (data: User): Promise<boolean> => {
        const response = await api.put(`/users/${data.id}`, {
            nombre: data.nombre,
            apellido: data.apellido,
            dni: data.dni,
            email: data.email,
            username: data.email,
            ...(data.password && { password: data.password }),
            rol: {
                id: data.role.id
            }
        }).catch(response => {
            return response.response;
        });

        if (response.data?.error) {
            const { details: { errors } } = response.data.error;

            for (const { path, message } of errors) {
                if (path.includes('dni') && message.includes('unique')) {
                    alert('Este DNI ya se encuentra registrado por otro usuario');
                }
            }

            return false;
        }

        await getUsers();

        return response.status === 200;
    };

    const removeUser = async (userId: number): Promise<boolean> => {
        const response = await api.put(`/users/${userId}`, {
            blocked: true,
        });

        await getUsers();

        return response.status === 200;
    };

    const enableUser = async (userId: number): Promise<boolean> => {
        const response = await api.put(`/users/${userId}`, {
            blocked: false,
        });

        await getUsers();

        return response.status === 200;
    };

    const getUsers = async () => {
        const { data } = await api.get('/users');

        setUsers(data);
    };

    useEffect(() => {
        getUsers();
    }, []);

    return {
        users,
        createUser,
        updateUser,
        removeUser,
        enableUser,
    };
};
