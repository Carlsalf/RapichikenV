import {Button, Form, Modal} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {User} from "../../../types/User";
import {useUser} from "./userUser";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';

const getUserSchema = (isNew: boolean) => {
    if (isNew) {
        return yup.object({
            nombre: yup.string().required('El nombre es requerido'),
            apellido: yup.string().required('El apellido es requerida'),
            dni: yup.string().typeError('El DNI debe ser un digitos numericos').required('El DNI es requerido').max(8, 'Tiene ser un maximo de 8 digitos').min(8, 'Tiene ser un maximo de 8 digitos'),
            email: yup.string().required('El email es requerido').email('EL email tiene que tener el siguiente formato ejemplo@ejemplo.com'),
            password: yup.string().required('El password es requerido').min(6, 'El password tiene que tener como minimo 6 caracteres'),
            role: yup.object({
                id: yup.number().required('El rol es requerido'),
            }),
        }).required();
    }

    return yup.object({
        nombre: yup.string().required('El nombre es requerido'),
        apellido: yup.string().required('El apellido es requerida'),
        dni: yup.string().typeError('El DNI debe ser un digitos numericos').required('El DNI es requerido').max(8, 'Tiene ser un maximo de 8 digitos').min(8, 'Tiene ser un maximo de 8 digitos'),
        email: yup.string().required('El tipo de producto es requerido').email('EL email tiene que tener el siguiente formato ejemplo@ejemplo.com'),
        password: yup.string(),
        role: yup.object({
            id: yup.number().required('El rol es requerido'),
        }),
    }).required();
}

export const UserModal = ({ show, handleClose, isNew, onSubmit, user }: { show: boolean; handleClose: () => void; isNew: boolean; onSubmit: (usuario: any, isNew: boolean) => void; user?: User }) => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<User>({
        resolver: yupResolver(getUserSchema(isNew)),
        defaultValues: user,
    });
    const { roles } = useUser();

  return (
      <Modal show={show} onHide={handleClose}>
          <Form onSubmit={handleSubmit(data => onSubmit(data, isNew))}>
              <Modal.Header closeButton>
                  <Modal.Title>{isNew ? 'Crear' : 'Editar'} Usuario</Modal.Title>
              </Modal.Header>
              <Modal.Body>
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
                      <Form.Label>Rol</Form.Label>
                      <Form.Select onChange={event => setValue('role.id', Number(event.target.value))} value={user?.role.id}>
                          <option>Seleccionar</option>
                          {roles.length > 0 && roles.map(rol => (
                              <option key={`rol-${rol.id}`} value={rol.id}>{rol.name}</option>
                          ))}
                      </Form.Select>
                      {errors.role?.id && (
                          <Form.Text className='text-danger'>
                              {errors.role.id.message}
                          </Form.Text>
                      )}
                  </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                      Cerrar
                  </Button>
                  <Button variant="primary" type='submit'>
                      {isNew ? 'Crear': 'Editar'}
                  </Button>
              </Modal.Footer>
          </Form>
      </Modal>
  );
}
