import {ResponsivePage} from "../components/ResponsivePage";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {Button, Form} from "react-bootstrap";
import {useRouter} from "next/router";
import {useRegister} from "../hooks/register/useRegister";

const validationSchema = yup.object({
    password: yup.string().required("Contraseña es requerido"),
    passwordConfirmation: yup.string().oneOf([yup.ref("password"), null], "No coincide con la contraseña").required("Contraseña es requerido"),
});

const RestablecerContrasena = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<{ password: string; passwordConfirmation: string;}>({
        resolver: yupResolver(validationSchema),
    });
    const { resetPassword } = useRegister();
    const { query, push } = useRouter();


    const code = query.code;

    const handleOnSubmit = async (data: {password: string; passwordConfirmation: string;}) => {
        const result = await resetPassword({ ...data, code: `${code}` });

        if (result) {
            await push('/iniciar-sesion');
            return;
        }

        alert('Algo salio mal');
    };

    return (
        <ResponsivePage>
            <div className='container'>
                <div className='d-flex flex-column justify-content-center align-items-center'>
                    <h1>Restablecer Contraseña</h1>
                    <Form onSubmit={handleSubmit(handleOnSubmit)}>
                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control type="password" {...register("password")} />
                            {errors.password && (
                                <Form.Text className='text-danger'>
                                    {errors.password.message}
                                </Form.Text>
                            )}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Verifique Contraseña</Form.Label>
                            <Form.Control type="password" {...register("passwordConfirmation")} />
                            {errors.passwordConfirmation && (
                                <Form.Text className='text-danger'>
                                    {errors.passwordConfirmation.message}
                                </Form.Text>
                            )}
                        </Form.Group>
                        <Button variant="primary" type='submit'>
                            Restablecer contraseña
                        </Button>
                    </Form>
                </div>
            </div>
        </ResponsivePage>
    );
};

export default RestablecerContrasena;
