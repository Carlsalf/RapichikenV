import {ResponsivePage} from "../components/ResponsivePage";
import * as yup from "yup";
import {Button, Form, Table} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {useMemo, useState} from "react";
import {CatalogModal} from "../components/Modals/CatalogModal";
import {useInventory} from "../hooks/inventory/useInventory";
import {CartProduct} from "../types/Cart";
import {useCreateOrder} from "../hooks/createOrder/useCreateOrder";
import {useRouter} from "next/router";

const clientSchema = yup.object({
    nombre: yup.string().required('El nombre es requerido'),
    apellido: yup.string().required('El apellido es requerida'),
    dni: yup.string().typeError('El DNI debe ser un digitos numericos').required('El DNI es requerido').max(8, 'Tiene ser un maximo de 8 digitos').min(8, 'Tiene ser un maximo de 8 digitos'),
    metodoPago: yup.string().required('El metodo de pago es requerido'),
});

const CrearPedido = () => {
    const { register, handleSubmit, formState: { errors }, setValue  } = useForm<{nombre: string; apellido: string; dni: string; metodoPago: string;}>({
        resolver: yupResolver(clientSchema),
    });
    const { inventories } = useInventory();
    const { buy } = useCreateOrder();
    const router = useRouter();

    const [products, setProducts] = useState<CartProduct[]>([]);
    const [showProductModal, setShowProductModal] = useState(false);

    const total = useMemo<number>(() => products.reduce((acc, value) => acc + value.precio, 0), [products]);
    const descuentos = useMemo<number>(() => products.reduce((acc, value) => acc + value.descuento, 0), [products]);

    const handleOnSubmit = async (data: any) => {
        if (!products.length) {
            alert('No ha seleccionado un producto');
            return;
        }

        const { metodoPago, ...user } = data;

        const response = await buy({ products, total }, user, metodoPago);

        if (response) {
            localStorage.setItem('cart', JSON.stringify({ products, total }));
            await router.push('/venta-exitosa');
        }
    };

    const handleOnOpenModal = () => setShowProductModal(true);
    const handleOnCloseModal = () => setShowProductModal(false);

    const handleRemoveProduct = (id: string) => {
        const newProducts = products.filter(product => product.id !== id);
        setProducts(newProducts);
    }

    const checkProductToAdd = (productToAdd: CartProduct): boolean => {
        const productsAvailableToCart: boolean[] = [];

        const productsSelected = products.reduce((acc: any[], value) => {
            const prods = value.productos.map(prod => ({ ...prod, quantityToBuy: value.cantidad }));
            return [...acc, ...prods];
        }, []);

        const productsToCheck = productToAdd.productos.map(product => ({ ...product, quantityToBuy: productToAdd.cantidad }));

        const productsToAdd = [...productsSelected, ...productsToCheck].reduce((acc: any, value: any) => {
            if (acc[value.id]) {
                acc[value.id] = acc[value.id] + (value.cantidad * value.quantityToBuy);
            } else {
                acc[value.id] = value.cantidad * value.quantityToBuy;
            }

            return acc;
        }, {});

        for(const productId in productsToAdd) {
            const inventory = inventories.find(inventory => Number(inventory.producto.id) === Number(productId));

            if (!inventory) {
                productsAvailableToCart.push(false);
                break;
            }
            if (Number(inventory.stock) >= productsToAdd[productId]) {
                productsAvailableToCart.push(true);
            } else {
                productsAvailableToCart.push(false);
                break;
            }
        }

        return productsAvailableToCart.length > 0 ? productsAvailableToCart.every(isAvailable => isAvailable) : false;
    };

    const handleOnAddProduct = (product: CartProduct) => {
        if (!checkProductToAdd(product)) {
            alert('No se puede agregar mas al carrito por falta de stock')
            return;
        }

        setProducts([...products, product]);
        handleOnCloseModal();
    };

    return (
        <ResponsivePage>
            <div className='container'>
                <div className='d-flex  justify-content-center'>
                    <h1>Crear Pedido</h1>
                </div>
                <div className='d-flex flex-column'>
                    <div className='d-grid d--recepcion-col' style={{ gridTemplateColumns: 'auto auto', columnGap: '20px' }}>
                        <Form onSubmit={handleSubmit(handleOnSubmit)}>
                            <h3>Cliente</h3>
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
                            <h3 className='mt-3'>Metodo de pago</h3>
                            <Form.Group className="mb-3">
                                <Form.Check
                                    inline
                                    label="Efectivo"
                                    type='radio'
                                    id={`inline-radio-1`}
                                    value='efectivo'
                                    {...register("metodoPago")}
                                />
                                <Form.Check
                                    inline
                                    label="Yape"
                                    type='radio'
                                    id={`inline-radio-2`}
                                    value='yape'
                                    {...register("metodoPago")}
                                />
                                <Form.Check
                                    inline
                                    label="POS"
                                    type='radio'
                                    id={`inline-radio-3`}
                                    value='pos'
                                    {...register("metodoPago")}
                                />
                                {errors.metodoPago && (
                                    <Form.Text className='text-danger'>
                                        {errors.metodoPago.message}
                                    </Form.Text>
                                )}
                            </Form.Group>
                            <Button className="btn--loguin-invert" type='submit' variant='success'>Crear Pedido <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z" fill="rgba(255,255,255,1)"/></svg></Button>
                        </Form>
                        <div className='d-flex flex-column'>
                            <div className='d-flex justify-content-between'>
                                <h3>Productos</h3>
                                <Button className="btn--loguin-invert" variant='success' type='button' onClick={handleOnOpenModal}>Agregar Producto <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z" fill="rgba(255,255,255,1)"/></svg></Button>
                            </div>
                            <Table>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nombre</th>
                                    <th>Cantidad</th>
                                    <th>Monto</th>
                                    <th>Descuento</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {products.length > 0 ? products.map((product, index) => (
                                    <tr key={`catalog-product-${product.id}`}>
                                        <td>{index + 1}</td>
                                        <td>{product.nombre}</td>
                                        <td>{product.cantidad}</td>
                                        <td>{product.precio}</td>
                                        <td>{product.descuento}</td>
                                        <td>
                                            <Button variant='danger' onClick={() => handleRemoveProduct(product.id)}>Eliminar</Button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className='text-center'>No hay productos seleccionados</td>
                                    </tr>
                                )}
                                </tbody>
                                <tfoot>
                                <tr>
                                    <td colSpan={3} className='fw-bold'>Subtotal</td>
                                    <td colSpan={3}>{Number(total - (total * 0.18)).toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td colSpan={3} className='fw-bold'>IGV</td>
                                    <td colSpan={3}>{Number(total * 0.18).toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td colSpan={3} className='fw-bold'>Descuentos</td>
                                    <td colSpan={3}>-{Number(descuentos).toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td colSpan={3} className='fw-bold'>Total</td>
                                    <td colSpan={3}>{Number(total - descuentos).toFixed(2)}</td>
                                </tr>
                                </tfoot>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
            {showProductModal && <CatalogModal show={showProductModal} onClose={handleOnCloseModal} onAddProduct={handleOnAddProduct} />}
        </ResponsivePage>
    );
};

export default CrearPedido;
