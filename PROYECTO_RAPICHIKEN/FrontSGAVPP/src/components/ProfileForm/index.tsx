import {useResponsivePageContext} from "../ResponsivePage/context";
import {Button, Form, Table} from "react-bootstrap";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {User} from "../../types/User";
import {yupResolver} from "@hookform/resolvers/yup";
import {useProfile} from "../../hooks/profile/useProfile";
import {useEffect} from "react";
import {ZoneTable} from "../ZoneTable";

const getProfileSchema = (isEmployee: boolean) => yup.object({
    nombre: yup.string().required('El nombre es requerido'),
    apellido: yup.string().required('El apellido es requerida'),
    dni: yup.string().typeError('El DNI debe ser un digitos numericos').required('El DNI es requerido').max(8, 'Tiene ser un maximo de 8 digitos').min(8, 'Tiene ser un maximo de 8 digitos'),
    email: yup.string().required('El tipo de producto es requerido').email('EL email tiene que tener el siguiente formato ejemplo@ejemplo.com'),
    password: yup.string(),
    ...(!isEmployee && {
        direccion: yup.string().required('La direccion es requerida'),
        zona: yup.string().required('La zona es requerida')
    }),
})

export const ProfileForm = () => {
    const { user, isEmployee } = useResponsivePageContext();
    const { update } = useProfile();

    const { register, handleSubmit, formState: { errors }, setValue  } = useForm<User>({
        resolver: yupResolver(getProfileSchema(isEmployee)),
        defaultValues: user,
    });

    useEffect(() => {
        if (user && !isEmployee) {
            setValue('zona', user.zona);
        }
    }, [user, setValue, isEmployee]);

    if (!user) {
        return null;
    }


    const handleOnSubmit = async (data: User) => {
        const result = await update(data, user.id);

        if (result) {
            alert('Se actualizo correctamente');
            return;
        }
    }

  return (
      <div className='d-flex flex-column justify-content-center align-items-center seccion--edit-profile'>
          <h1>Hola {user.nombre} { user.apellido }</h1>
          <Form onSubmit={handleSubmit(handleOnSubmit)}>
              <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control type="text" {...register("nombre")} defaultValue={user.nombre} />
                  {errors.nombre && (
                      <Form.Text className='text-danger'>
                          {errors.nombre.message}
                      </Form.Text>
                  )}
              </Form.Group>
              <Form.Group className="mb-3">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control type="text" {...register("apellido")}  defaultValue={user.apellido} />
                  {errors.apellido && (
                      <Form.Text className='text-danger'>
                          {errors.apellido.message}
                      </Form.Text>
                  )}
              </Form.Group>
              <Form.Group className="mb-3">
                  <Form.Label>DNI</Form.Label>
                  <Form.Control type="number" {...register("dni")}  defaultValue={user.dni} />
                  {errors.dni && (
                      <Form.Text className='text-danger'>
                          {errors.dni.message}
                      </Form.Text>
                  )}
              </Form.Group>
              <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" {...register("email")}  defaultValue={user.email} />
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
              {!isEmployee && (
                  <>
                      <Form.Group className="mb-3">
                          <Form.Label>Direccion</Form.Label>
                          <Form.Control type="text" {...register("direccion")}  defaultValue={user.direccion} />
                          {errors.direccion && (
                              <Form.Text className='text-danger'>
                                  {errors.direccion.message}
                              </Form.Text>
                          )}
                      </Form.Group>
                      <Form.Group className="mb-3">
                          <Form.Label>Zonas</Form.Label>
                          <Form.Select onChange={event => setValue('zona', event.target.value)} value={user.zona}>
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
                  </>
              )}
              <Button className="btn--loguin-invert" variant="primary" type='submit'>
                  Actualizar <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M6.414 16L16.556 5.858l-1.414-1.414L5 14.586V16h1.414zm.829 2H3v-4.243L14.435 2.322a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414L7.243 18zM3 20h18v2H3v-2z" fill="rgba(255,255,255,1)"/></svg>
              </Button>
          </Form>
          {!isEmployee && (
              <ZoneTable />
          )}
      </div>
  );
};
