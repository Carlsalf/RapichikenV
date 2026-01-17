import {User} from "../../types/User";
import {api} from "../../utils/api";

export const useProfile = () => {
    const update = async (data: User, id: number) => {
        const response = await api.put(`/users/${id}`, {
            nombre: data.nombre,
            apellido: data.apellido,
            dni: data.dni,
            email: data.email,
            username: data.email,
            ...(data.password && { password: data.password }),
            direccion: data.direccion,
            zona: data.zona,
        }).catch(response => {
            return response.response;
        });
        console.log(response);
        if (response.data?.error) {
            const { message } = response.data.error;

            if (message.includes('already taken')) {
                alert('Este correo ya se encuentra registrado por otro usuario');
                return;
            }

            const { details: { errors } } = response.data.error;

            for (const { path, message } of errors) {
                if (path.includes('dni') && message.includes('unique')) {
                    alert('Este DNI ya se encuentra registrado por otro usuario');
                }
            }

            return false;
        }

        localStorage.setItem('user', JSON.stringify(response.data as User));

        return response.status === 200;
    };

    return {
        update,
    };
};
