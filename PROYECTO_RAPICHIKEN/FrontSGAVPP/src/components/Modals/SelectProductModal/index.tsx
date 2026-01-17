import {Button, Form, Modal, Table} from "react-bootstrap";
import {useSelectProduct} from "./useSelectProduct";
import {useState} from "react";
import {Product} from "../../../types/Product";

export const SelectProductModal = ({ handleClose, show, onAddProduct }: { show: boolean; handleClose: () => void; onAddProduct: (product: any) => void; }) => {
    const { products } = useSelectProduct();
    const [product, setProduct] = useState<Product | null>(null);
    const [cantidad, setCantidad] = useState<number | undefined>(undefined);

    const handleSelectProduct = (selectedProduct: any) => setProduct(selectedProduct);

    const handleAddProduct = () => onAddProduct({ ...product, cantidad });

    return (
        <Modal show={show} onHide={() => handleClose()}>
            <Modal.Header closeButton>
                <Modal.Title>Seleccione un Producto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Descripcion</th>
                            <th>Tipo de Producto</th>
                            <th>Unidad</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                    {products.length && products.map((product: any) => (
                        <tr key={`producto-${product.id}`}>
                            <td>{product.nombre}</td>
                            <td>{product.descripcion}</td>
                            <td>{product.tipo_producto}</td>
                            <td>{product.unidad}</td>
                            <td>
                                <Button onClick={() => handleSelectProduct(product)}>Seleccionar</Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                <p>Producto Seleccionado: {product?.nombre}</p>
                {product && (
                    <>
                        {product.piezas ? (
                            <Form.Group>
                                <Form.Label>Cantidad de piezas del producto</Form.Label>
                                <Form.Select onChange={event => setCantidad(Number(event.target.value))}>
                                    <option>Seleccionar</option>
                                    {[...new Array(product.piezas)].map((_v, index) => (
                                        <option key={`pieza-${index+1}`} value={index+1}>{index+1}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        ) : (
                            <Form.Control type="number" placeholder="Cantidad" value={cantidad} onChange={event => setCantidad(Number(event.target.value))} />
                        )}
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => handleClose()}>
                    Cerrar
                </Button>
                <Button className="" variant="primary" onClick={handleAddProduct}>
                    Agregar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
