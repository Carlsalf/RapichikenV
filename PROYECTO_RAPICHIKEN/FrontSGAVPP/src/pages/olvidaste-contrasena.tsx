import {ResponsivePage} from "../components/ResponsivePage";
import {Button, Form} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useRegister} from "../hooks/register/useRegister";
import {useRouter} from "next/router";

const forgotPasswordSchema = yup.object({
    email: yup.string().required('El email es requerido').email('EL email tiene que tener el siguiente formato ejemplo@ejemplo.com')
}).required();

const OlvidasteContrasena = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<{ email: string;}>({
        resolver: yupResolver(forgotPasswordSchema),
    });
    const { forgotPassword } = useRegister();
    const router = useRouter();

    const handleOnSubmit = async ({ email }: { email: string }) => {
        const result = await forgotPassword(email);

        if (result.includes('mal')) {
            alert('No tenemos este email registrado');
            return;
        }

        await router.push({ pathname: '/restablecer-contrasena', query: { code: result } });
    };

    return (
        <ResponsivePage>
            <div className='container'>
                <div className='d-flex flex-column justify-content-center align-items-center'>
                    <h1>Olvidaste tu contraseña?</h1>
                    <Form onSubmit={handleSubmit(handleOnSubmit)}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" {...register("email")} />
                            {errors.email && (
                                <Form.Text className='text-danger'>
                                    {errors.email.message}
                                </Form.Text>
                            )}
                        </Form.Group>
                        <Button variant="primary" type='submit'>
                            Enviar correo
                        </Button>
                    </Form>
                </div>
            </div>
        </ResponsivePage>
    );
};

export default OlvidasteContrasena;
