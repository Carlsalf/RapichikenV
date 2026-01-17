import {ResponsivePage} from "../../components/ResponsivePage";
import {Button, Form} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {Product} from "../../types/Product";
import {yupResolver} from "@hookform/resolvers/yup";
import {Catalog} from "../../types/Catalog";
import {useState} from "react";
import * as yup from "yup";
import {SelectProductModal} from "../../components/Modals/SelectProductModal";
import {useCatalog} from "../../hooks/catalog/useCatalog";
import { useRouter } from 'next/router'

const catalogSchema = yup.object({
    nombre: yup.string().required('El nombre es requerido'),
    descripcion: yup.string().required('La descripcion es requerida'),
    descuento: yup.number(),
    precio: yup.number().required('El tipo de producto es requerido').typeError('El precio debe ser un numero'),
}).required();

const NewCatalog = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<Catalog>({
        resolver: yupResolver(catalogSchema),
    });
    const [isAvailable, setIsAvailable] = useState(true);
    const [products, setProducts] = useState<{id: string; nombre: string; piezas?: number; cantidad: number; unidad: string; descripcion: string;}[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [files, setFiles] = useState<File | null>(null);
    const { createCatalog, uploadPhoto } = useCatalog();
    const router = useRouter();

    const handleSwitch = () => setIsAvailable(!isAvailable);

    const handleOnSubmit = async (data: any) => {
        // if (!files) {
        //     alert('Seleccione una foto');
        //     return;
        // }

        if (!products.length) {
            alert('Seleccione un producto');
            return;
        }

        const catalog = {
            ...data,
            disponible: isAvailable,
            productos: products.map(({ id, cantidad, piezas }) => ({ id, cantidad, isPieces: Boolean(piezas) })),
        }

        const response = await createCatalog(catalog);

        if (response) {
            // const photoResponse = await uploadPhoto(files, response.id);
            //
            // if (photoResponse) {
                await router.push('/catalogo');
            // }
        }
    };

    const handleOpenModal = () => setShowModal(true);

    const handleCloseModal = () => setShowModal(false);

    const handleAddProduct = (product: any) => {
      setProducts([...products, product]);
      handleCloseModal();
    };

    const handleFileSelected = (e: any): void => {
        const file = e.target.files[0];
        setFiles(file);
    }

    const handleRemoveProduct = (productId: string) => {
        const newProducts = products.filter(product => product.id !== productId);
        setProducts(newProducts);
    };

    return (
        <ResponsivePage>
            <div className='container mt-3'>
                <div className='d-flex justify-content-between'>
                    <h1 className='mb-2'>Crear Catalogo</h1>
                </div>
                <div className='d-flex justify-content-center'>
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
                            <Form.Label>Descripcion</Form.Label>
                            <Form.Control type="text" {...register("descripcion")} />
                            {errors.descripcion && (
                                <Form.Text className='text-danger'>
                                    {errors.descripcion.message}
                                </Form.Text>
                            )}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descuento</Form.Label>
                            <Form.Control type="number" {...register("descuento")} defaultValue={0} />
                            {errors.descuento && (
                                <Form.Text className='text-danger'>
                                    {errors.descuento.message}
                                </Form.Text>
                            )}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Precio</Form.Label>
                            <Form.Control type="number" {...register("precio")} />
                            {errors.precio && (
                                <Form.Text className='text-danger'>
                                    {errors.precio.message}
                                </Form.Text>
                            )}
                        </Form.Group>
                        <Form.Check
                            type="switch"
                            label="Esta disponible?"
                            onChange={handleSwitch}
                            defaultChecked={isAvailable}
                        />
                        {/*<Form.Group controlId="formFile" className="mb-3">*/}
                        {/*    <Form.Label>Foto</Form.Label>*/}
                        {/*    <Form.Control type="file" onChange={handleFileSelected} />*/}
                        {/*</Form.Group>*/}
                    <Button type='submit' variant='success'>Crear</Button>
                    </Form>
                </div>
                <div className='d-flex justify-content-end'>
                    <Button type='button' variant='primary' onClick={handleOpenModal}>Agregar Producto</Button>
                </div>
                <table className='table'>
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Descripcion</th>
                        <th scope="col">Cantidad</th>
                        <th scope="col" />
                    </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 && products.map((product, index: number) => (
                            <tr key={`producto-seleccionado-${product.id}`}>
                                <td>{index + 1}</td>
                                <td>{product.nombre}</td>
                                <td>{product.descripcion}</td>
                                <td>{`${product.cantidad} ${product.piezas ? 'piezas' : ''} ${product.unidad}`}</td>
                                <td><Button variant='danger' onClick={() => handleRemoveProduct(product.id)}>                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zm-9 3h2v6H9v-6zm4 0h2v6h-2v-6zM9 4v2h6V4H9z" fill="rgba(61,61,61,1)"/></svg>
</Button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showModal && <SelectProductModal show={showModal} handleClose={handleCloseModal} onAddProduct={handleAddProduct} />}
        </ResponsivePage>
    );
};

export default NewCatalog;
