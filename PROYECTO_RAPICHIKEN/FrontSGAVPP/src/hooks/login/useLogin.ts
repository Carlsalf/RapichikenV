import {api} from "../../utils/api";
import {User} from "../../types/User";

export const useLogin = () => {

    const login = async (email: string, password: string): Promise<User | string> => {
        const response = await api.post('/auth/local', { identifier: email, password }).catch(response => response.response);

        if (response.data.error && response.data.error.message === 'Invalid identifier or password') {
            return 'El email o la contraseña es incorrecto';
        }

        const { jwt, user } = response.data;

        localStorage.setItem('token', jwt);
        localStorage.setItem('user', JSON.stringify(user));

        return user;
    };

    return {
        login,
    };
};
