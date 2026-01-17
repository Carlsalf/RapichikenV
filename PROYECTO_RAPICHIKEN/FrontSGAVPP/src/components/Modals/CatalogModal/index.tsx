import {Button, Form, Modal, Table} from "react-bootstrap";
import {useCatalogs} from "../../../hooks/catalog/useCatalogs";
import {useState} from "react";
import {Catalog} from "../../../types/Catalog";

export const CatalogModal = ({ onClose, show, onAddProduct }: {show: boolean; onClose: () => void; onAddProduct: (catalog: any) => void;}) => {
    const { catalogs } = useCatalogs();
    const [catalog, setCatalog] = useState<Catalog | null>(null);
    const [cantidad, setCantidad] = useState<number | undefined>(undefined);

    const handleSelectProduct = (selectedCatalog: Catalog) => setCatalog(selectedCatalog);

    const handleAddProduct = () => onAddProduct({ ...catalog, cantidad });

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Seleccione Producto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table responsive>
                    <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripcion</th>
                        <th>Precio</th>
                        <th>Descuento</th>
                        <th />
                    </tr>
                    </thead>
                    <tbody>
                        {catalogs.length > 0 && catalogs.map(catalog => (
                            <tr key={`catalog-id-${catalog.id}`}>
                                <td>{catalog.nombre}</td>
                                <td>{catalog.descripcion}</td>
                                <td>{catalog.precio}</td>
                                <td>{catalog.descuento}</td>
                                <td>
                                    <Button variant='primary' onClick={() => handleSelectProduct(catalog)}>Seleccionar</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <p>Producto Seleccionado: {catalog?.nombre}</p>
                {catalog && (
                    <input type="number" max={100} min={0} placeholder="Cantidad" value={cantidad} onChange={event => setCantidad(Number(event.target.value))} />
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cerrar
                </Button>
                <Button variant="success" type='button' onClick={handleAddProduct}>
                    Agregar
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
