import {Button, Form} from "react-bootstrap";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {User} from "../../types/User";
import {yupResolver} from "@hookform/resolvers/yup";
import {ZoneTable} from "../ZoneTable";

const guestSchema = yup.object({
    nombre: yup.string().required('El nombre es requerido'),
    apellido: yup.string().required('El apellido es requerida'),
    dni: yup.string().typeError('El DNI debe ser un digitos numericos').required('El DNI es requerido').max(8, 'Tiene ser un maximo de 8 digitos').min(8, 'Tiene ser un maximo de 8 digitos'),
    email: yup.string().required('El tipo de producto es requerido').email('EL email tiene que tener el siguiente formato ejemplo@ejemplo.com'),
    direccion: yup.string().required('La direccion es requerida'),
    zona: yup.string().required('La zona es requerida'),
});

export const GuestForm = ({ onSubmit, openCulqi }: { onSubmit: (data: any) => void; openCulqi: () => void; }) => {
    const { register, handleSubmit, formState: { errors }, setValue  } = useForm<User>({
        resolver: yupResolver(guestSchema),
    });

    const handleOnSubmit = (data: any) => {
        onSubmit(data);
        openCulqi();
    };

    return (
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
                    <option value=''>Seleccionar</option>
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
            <Button type='submit' variant='success'>Pagar</Button>
            <ZoneTable />
        </Form>
    );
};
