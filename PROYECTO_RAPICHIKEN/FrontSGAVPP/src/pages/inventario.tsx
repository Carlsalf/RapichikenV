import {ResponsivePage} from "../components/ResponsivePage";
import {Button} from "react-bootstrap";
import {useState} from "react";
import {InventoryModal} from "../components/Modals/InventoryModal/InventoryModal";
import {useInventory} from "../hooks/inventory/useInventory";
import {Inventory} from "../types/Inventario";

const Inventario = () => {
    const [showModal, setShowModal] = useState(false);
    const [isNew, setIsNew] = useState(true);
    const { inventories, createInventory, removeInventory, updateInventory } = useInventory();
    const [selectedInventory, setSelectedInventory] = useState<Inventory | undefined>(undefined);

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedInventory(undefined);
    };

    const handleOpenModal = () => setShowModal(true);

    const handleOnSubmit = async (inventory: any, isNew: boolean) => {
        if (isNew) {
            await createInventory(inventory);
        } else {
            await updateInventory(inventory);
            handleCloseModal();
        }
    };

    const handleRemoveInventory = async (inventoryId: string) => {
        await removeInventory(inventoryId);
    }

    const handleEditInventory = (inventory: Inventory) => {
        setSelectedInventory(inventory);
        setIsNew(false);
        handleOpenModal();
    }

    return (
        <ResponsivePage>
            <div className='container mt-3'>
                <div className='d-flex justify-content-between'>
                    <h1 className='mb-2'>Inventario</h1>
                    <Button variant='success' onClick={handleOpenModal}>Nuevo</Button>
                </div>
                <table className='table'>
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Producto</th>
                        <th scope="col">Stock</th>
                        <th scope="col">Estado</th>
                        <th scope="col" />
                    </tr>
                    </thead>
                    <tbody>
                    {inventories.length > 0 && inventories.map(inventory => (
                        <tr key={`inventory-${inventory.id}`}>
                            <td>{inventory.id}</td>
                            <td>{inventory.producto.nombre}</td>
                            <td>{inventory.stock}</td>
                            <td>{inventory.disponible ? 'Disponible' : 'No Disponible'}</td>
                            <td>
                                <Button className='me-2 btn--admin btn-init-i' variant='danger' onClick={() => handleRemoveInventory(inventory.id)}>                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zm-9 3h2v6H9v-6zm4 0h2v6h-2v-6zM9 4v2h6V4H9z" fill="rgba(61,61,61,1)"/></svg>
</Button>
                                <Button variant='primary' className="btn--admin" onClick={() => handleEditInventory(inventory)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M6.414 16L16.556 5.858l-1.414-1.414L5 14.586V16h1.414zm.829 2H3v-4.243L14.435 2.322a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414L7.243 18zM3 20h18v2H3v-2z" fill="rgba(76,76,76,1)"/></svg></Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {showModal && <InventoryModal show={showModal} handleClose={handleCloseModal} onSubmit={handleOnSubmit} isNew={isNew} inventory={selectedInventory} />}
        </ResponsivePage>
    );
}

export default Inventario;
