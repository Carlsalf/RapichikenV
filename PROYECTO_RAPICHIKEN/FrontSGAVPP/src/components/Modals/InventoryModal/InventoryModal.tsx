import {Button, Form, Modal} from "react-bootstrap";
import {useForm} from "react-hook-form";
import * as yup from "yup";
import {Inventory} from "../../../types/Inventario";
import {yupResolver} from "@hookform/resolvers/yup";
import {useEffect, useState} from "react";
import {useInventory} from "../../../hooks/inventory/useInventory";

const inventorySchema = yup.object({
    productoId: yup.string().required('El producto es requerido'),
    stock: yup.number().typeError('El stock debe ser un numero').required('El stock es requerido').min(0, 'El stock debe ser minimo a 0').max(500, 'El stock no puede superar las 500 und'),
    disponible: yup.boolean(),
}).required();

export const InventoryModal = ({ show, handleClose, onSubmit, isNew, inventory }: { show: boolean; handleClose: () => void; onSubmit: (data: Inventory, isNew: boolean) => void; isNew: boolean; inventory?: Inventory }) => {
    const [isAvailable, setIsAvailable] = useState(inventory?.disponible);
    const { register, handleSubmit, formState: { errors }, setValue  } = useForm<Inventory>({
        resolver: yupResolver(inventorySchema),
        defaultValues: inventory,
    });
    const { products, getProducts } = useInventory();

    const handleSwitch = () => setIsAvailable(!isAvailable);

    const handleOnSubmit = (data: any) => {
        onSubmit({ ...data, disponible: isAvailable }, isNew);
    };

    useEffect(() => {
        getProducts();
    }, []);

    return(
        <Modal show={show} onHide={handleClose}>
            <Form onSubmit={handleSubmit(handleOnSubmit)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isNew ? 'Nuevo' : 'Editar'} Inventario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Producto</Form.Label>
                        {inventory ? (
                            <Form.Control type='text' defaultValue={inventory.producto.nombre} disabled />
                        ) : (
                            <>
                                <Form.Select onChange={event => setValue('productoId', event.target.value)}>
                                    <option>Seleccionar</option>
                                    {products.length && products.map((product: any) => (
                                        <option key={`product-${product.id}`} value={product.id}>{product.nombre}</option>
                                    ))}
                                </Form.Select>
                                {errors.productoId && (
                                    <Form.Text className='text-danger'>
                                        {errors.productoId.message}
                                    </Form.Text>
                                )}
                            </>
                        )}
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Stock</Form.Label>
                        <Form.Control type="number" {...register("stock")} />
                        {errors.stock && (
                            <Form.Text className='text-danger'>
                                {errors.stock.message}
                            </Form.Text>
                        )}
                    </Form.Group>
                    <Form.Check
                        type="switch"
                        label="Se encuentra disponible?"
                        onChange={handleSwitch}
                        defaultChecked={isAvailable}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleClose()}>
                        Cerrar
                    </Button>
                    <Button variant="primary" type='submit'>
                        {isNew ? 'Guardar' : 'Editar'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};
