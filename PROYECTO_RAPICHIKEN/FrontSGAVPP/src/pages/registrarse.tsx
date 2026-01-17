import {ResponsivePage} from "../components/ResponsivePage";
import {Button, Form, Table} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {User} from "../types/User";

import {useState} from "react";
import {useRegister} from "../hooks/register/useRegister";
import {useRouter} from "next/router";

const registerSchema = yup.object({
    nombre: yup.string().required('El nombre es requerido'),
    apellido: yup.string().required('El apellido es requerida'),
    dni: yup.string().typeError('El DNI debe ser un digitos numericos').required('El DNI es requerido').max(8, 'Tiene ser un maximo de 8 digitos').min(8, 'Tiene ser un maximo de 8 digitos'),
    email: yup.string().required('El tipo de producto es requerido').email('EL email tiene que tener el siguiente formato ejemplo@ejemplo.com'),
    password: yup.string().required('La contraseña es requerida').min(6, 'La contraseña tiene que tener un minimo de 6 caracteres '),
    direccion: yup.string().required('La direccion es requerida'),
    zona: yup.string().required('La zona es requerida'),
});

const Registrarse = () => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<User>({
        resolver: yupResolver(registerSchema),
    });
    const { createClient } = useRegister();
    const [user, setUser] = useState<User | undefined>(undefined);
    const router = useRouter();

    const handleOnSubmit = async (data: User) => {
        const result = await createClient(data);

        if (!result) {
            return;
        }

        setUser(result);
        await router.push('/ver-catalogo');
    };

    return (
        <ResponsivePage user={user}>
            <div className='container mt-4 mb-5'>
                <div className='cont--registrate'>
                    <h1>Registrarse</h1>
                    <Form onSubmit={handleSubmit(handleOnSubmit)}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" {...register("nombre")} />
                            {errors.nombre && (
                                <Form.Text className='text-danger'>
                                    {errors.nombre.message}
                                </Form.Text>
                            )}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Apellido</Form.Label>
                            <Form.Control type="text" {...register("apellido")} />
                            {errors.apellido && (
                                <Form.Text className='text-danger'>
                                    {errors.apellido.message}
                                </Form.Text>
                            )}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>DNI</Form.Label>
                            <Form.Control type="number" {...register("dni")} />
                            {errors.dni && (
                                <Form.Text className='text-danger'>
                                    {errors.dni.message}
                                </Form.Text>
                            )}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" {...register("email")} />
                            {errors.email && (
                                <Form.Text className='text-danger'>
                                    {errors.email.message}
                                </Form.Text>
                            )}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" {...register("password")} />
                            {errors.password && (
                                <Form.Text className='text-danger'>
                                    {errors.password.message}
                                </Form.Text>
                            )}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Direccion</Form.Label>
                            <Form.Control type="text" {...register("direccion")} />
                            {errors.direccion && (
                                <Form.Text className='text-danger'>
                                    {errors.direccion.message}
                                </Form.Text>
                            )}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Zonas</Form.Label>
                            <Form.Select onChange={event => setValue('zona', event.target.value)}>
                                <option>Seleccionar</option>
                                <option value='A'>Zona A</option>
                                <option value='B'>Zona B</option>
                                <option value='C'>Zona C</option>
                                <option value='D'>Zona D</option>
                            </Form.Select>
                            {errors.zona && (
                                <Form.Text className='text-danger'>
                                    {errors.zona.message}
                                </Form.Text>
                            )}
                        </Form.Group>
                        <Button variant="primary" type='submit'>
                            Registrarse
                        </Button>
                    </Form>
                    <Table striped bordered hover className='mt-5'>
                        <thead>
                        <tr>
                            <th>Zonas</th>
                            <th>Avenidas</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>A</td>
                            <td>Av. Benavides, Av.Caminos del Inca, Av. Velasco Astete, Av.Nasarenas</td>
                        </tr>
                        <tr>
                            <td>B</td>
                            <td>Av. Surco, Av.Ayacucho, Av. Mariscal Catilla, Av.Castellana</td>
                        </tr>
                        <tr>
                            <td>C</td>
                            <td>Av. Proceres, Av.Guardia civil norte, Av. Vista alegre, Av. El sol</td>
                        </tr>
                        <tr>
                            <td>D</td>
                            <td>Av. Primavera, Av. Angamos, Av. San luis, Av. Encalada</td>
                        </tr>
                        </tbody>
                    </Table>
                </div>
            </div>
        </ResponsivePage>
    );
}

export default Registrarse;
