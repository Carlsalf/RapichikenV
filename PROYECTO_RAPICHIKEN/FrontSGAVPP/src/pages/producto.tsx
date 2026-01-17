import {ResponsivePage} from "../components/ResponsivePage";
import {useCallback, useState} from "react";
import {ProductModal} from "../components/Modals/ProductModal";
import {Button} from "react-bootstrap";
import {useProducts} from "../hooks/product/useProducts";
import {Product} from "../types/Product";
import {useProduct} from "../components/Modals/ProductModal/useProduct";

export default function Producto() {
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
    const { products, getProducts, removeProduct, enabledProduct } = useProducts();
    const [isNew, setIsNew] = useState(true);

    const { createProduct, editProduct } = useProduct();

    const onSubmit = async (data: Product, isNew: boolean) => {
        let result: boolean;
        if (isNew) {
            result = await createProduct(data);
        } else {
            result = await editProduct(data);
        }

        if (result) {
            await handleToggleModal(true);
        } else {
            await handleToggleModal(false);
        }
    };

    const handleToggleModal = useCallback(async (fetchData?: boolean, ) => {
        if (fetchData) {
            await getProducts();
        }

        if (showModal) {
            setSelectedProduct(undefined);
        }

        setShowModal(!showModal)
    }, [getProducts, showModal]);

    const handleRemoveProduct = useCallback((productId: string) => removeProduct(productId), [removeProduct]);

    const handleEnabledProduct = useCallback((productId: string) => enabledProduct(productId), [enabledProduct]);

    const handleEdit = useCallback(async (product: Product) => {
        setIsNew(false);
        setSelectedProduct(product);
        await handleToggleModal();
    }, [handleToggleModal]);

    return (
        <ResponsivePage>
            <div className='container mt-3'>
                <div className='d-flex justify-content-between'>
                    <h1 className='mb-2'>Productos</h1>
                    <Button variant='success' onClick={() => handleToggleModal()}>Nuevo</Button>
                </div>
                <table className='table'>
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Descripcion</th>
                            <th scope="col">Tipo de Producto</th>
                            <th scope="col">Unidad</th>
                            <th scope="col">Estado</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 && products.map((product: Product) => (
                            <tr key={`product-${product.id}`}>
                                <td>{product.id}</td>
                                <td>{product.nombre}</td>
                                <td>{product.descripcion}</td>
                                <td>{product.tipoProducto}</td>
                                <td>{product.unidad}</td>
                                <td>{product.disponible ? 'Disponible' : 'No Disponible'}</td>
                                <td>
                                    <Button className='me-2 btn--admin btn-init-i' variant='danger' onClick={() => handleRemoveProduct(product.id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zm-9 3h2v6H9v-6zm4 0h2v6h-2v-6zM9 4v2h6V4H9z" fill="rgba(61,61,61,1)"/></svg>
                                    </Button>
                                    <Button className='me-2  btn--admin' variant='info' onClick={() => handleEnabledProduct(product.id)}>Habilitar</Button>
                                    <Button variant='primary' className="btn--admin" onClick={() => handleEdit(product)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M6.414 16L16.556 5.858l-1.414-1.414L5 14.586V16h1.414zm.829 2H3v-4.243L14.435 2.322a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414L7.243 18zM3 20h18v2H3v-2z" fill="rgba(76,76,76,1)"/></svg></Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showModal && <ProductModal show={showModal} handleClose={handleToggleModal} product={selectedProduct} onSubmit={onSubmit} isNew={isNew} />}
        </ResponsivePage>
    );
}
