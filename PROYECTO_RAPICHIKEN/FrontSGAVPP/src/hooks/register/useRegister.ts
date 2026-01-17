import {User} from "../../types/User";
import {api} from "../../utils/api";

export const useRegister = () => {
    const createClient = async (data: User) => {
        const response = await api.post('/auth/local/register', {
            ...data,
            username: data.email,
            role: {
                id: 3,
            },
        }).catch(response => {
            return response.response;
        });

        if (response.data?.error) {
            const { message } = response.data.error;

            if (message.includes('already taken')) {
                alert('El email ya se encuentra registrado');

                return false;
            }

            const { details: { errors } } = response.data.error;

            for (const { path, message } of errors) {
                if (path.includes('dni') && message.includes('unique')) {
                    alert('Este DNI ya se encuentra registrado por otro usuario');
                }
            }

            return false;
        }

        const { jwt, user } = response.data;

        localStorage.setItem('token', jwt);
        localStorage.setItem('user', JSON.stringify(user));

        return user;
    };

    const forgotPassword = async (email: string): Promise<string> => {
        const { data } = await api.post('/auth/forgot-password', { email });

        const { ok } = data;

        if (ok) {
            return data.resetPasswordToken;
        }

        return 'Algo salio mal';
    };

    const resetPassword = async (reset: { password: string; passwordConfirmation: string; code: string; }): Promise<boolean> => {
        const response = await api.post('/auth/reset-password', reset);

        return response.status === 200
    };

  return {
      createClient,
      forgotPassword,
      resetPassword,
  };
};
