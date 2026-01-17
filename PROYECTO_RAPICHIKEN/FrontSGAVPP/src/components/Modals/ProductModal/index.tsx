import {Button, Form, Modal} from "react-bootstrap";
import {Product} from "../../../types/Product";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import {useState} from "react";

const productSchema = yup.object({
    nombre: yup.string().required('El nombre es requerido'),
    descripcion: yup.string().required('La descripcion es requerida'),
    unidad: yup.string().required('La unidad es requerido'),
    tipoProducto: yup.string().required('El tipo de producto es requerido'),
    piezas: yup.number(),
}).required();

export const ProductModal = ({ show, handleClose, product, onSubmit, isNew }: { show: boolean; handleClose: (fetchData: boolean) => void; onSubmit: (product: Product, isNew: boolean) => void; isNew: boolean; product?: Product }) => {
    const [isInPieces, setIsInPieces] = useState(Boolean(product?.piezas));
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<Product>({
        resolver: yupResolver(productSchema),
        defaultValues: {
            ...product,
            piezas: product?.piezas ? Number(product?.piezas) : 0,
        },
    });

    const handleSwitch = () => setIsInPieces(!isInPieces);

    return (
        <Modal show={show} onHide={() => handleClose(false)}>
            <Form onSubmit={handleSubmit(data => onSubmit(data, isNew))}>
                <Modal.Header closeButton>
                  <Modal.Title>{isNew ? 'Nuevo' : 'Editar'} Producto</Modal.Title>
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
                      <Form.Label>Descripcion</Form.Label>
                      <Form.Control type="text" {...register("descripcion")} />
                      {errors.descripcion && (
                          <Form.Text className='text-danger'>
                              {errors.descripcion.message}
                          </Form.Text>
                      )}
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Unidad</Form.Label>
                      <Form.Select onChange={event => setValue('unidad', event.target.value)} value={product?.unidad}>
                          <option>Seleccionar</option>
                          <option value="kg">Kilogramos</option>
                          <option value="und">Unidad</option>
                      </Form.Select>
                      {errors.unidad && (
                          <Form.Text className='text-danger'>
                              {errors.unidad.message}
                          </Form.Text>
                      )}
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Tipo de Producto</Form.Label>
                      <Form.Select onChange={event => setValue('tipoProducto', event.target.value)} value={product?.tipoProducto}>
                          <option>Seleccionar</option>
                          <option value="bebidas">Bebidas</option>
                          <option value="comestibles">Comestibles</option>
                      </Form.Select>
                      {errors.tipoProducto && (
                          <Form.Text className='text-danger'>
                              {errors.tipoProducto.message}
                          </Form.Text>
                      )}
                    </Form.Group>
                    <Form.Check
                        type="switch"
                        label="El producto se separa en piezas?"
                        onChange={handleSwitch}
                        defaultChecked={isInPieces}
                    />
                    {isInPieces && (
                        <Form.Group className="mb-3">
                            <Form.Label>Numero de piezas</Form.Label>
                            <Form.Control type="number" {...register("piezas")} />
                        </Form.Group>
                    )}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => handleClose(false)}>
                      Cerrar
                  </Button>
                  <Button variant="primary" type='submit'>
                      {isNew ? 'Guardar' : 'Editar'}
                  </Button>
                </Modal.Footer>
            </Form>
      </Modal>
    );
}
