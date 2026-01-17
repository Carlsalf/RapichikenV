import {Button, Table} from "react-bootstrap";
import {useState} from "react";
import {Order, ORDER_STATUS, ORDER_STATUS_LABELS} from "../../types/Order";
import {useOrders} from "../../hooks/orders/useOrders";
import {OrderDetailModal} from "../Modals/OrderDetailModal";
import {useResponsivePageContext} from "../ResponsivePage/context";

export const AllOrdersTable = () => {
    const { orders, updateStatus } = useOrders();
    const { user } = useResponsivePageContext();

    const [showDetailModal, setShowDetailModal] = useState(false);
    const [order, setOrder] = useState<Order | null>(null);

    const handleOpenModal = (order: Order) => {
        setOrder(order);
        setShowDetailModal(true);
    };

    const handleCloseModal = () => {
        setShowDetailModal(false);
    };

    const handleChangeStatus = async (id: number, status: ORDER_STATUS) => updateStatus(id, status);

    return (
        <>
        <Table>
            <thead>
            <tr>
                <th>#</th>
                <th>Numero de Pedido</th>
                <th>Numero de Productos</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Total</th>
                <th></th>
                {user?.role.id === 7 && (
                    <th></th>
                )}
            </tr>
            </thead>
            <tbody>
            {orders.length > 0 && orders.map((order, index) => (
                <tr key={`order-${order.id}`}>
                    <td>{index + 1}</td>
                    <td>{order.numeroPedido}</td>
                    <td>{order.detail.length}</td>
                    <td>{ORDER_STATUS_LABELS[order.estado]}</td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                    <td>{order.total}</td>
                    <td>
                        <div className='d-flex align-items-center'>
                            <Button className='me-3 btn-controladores' variant='primary' onClick={() => handleOpenModal(order)}>Ver</Button>
                            {user?.role.id === 7 && (
                                <div className='d-flex flex-column'>
                                    {[ORDER_STATUS.CREADO].includes(order.estado) && (
                                        <Button className='mb-1 btn--loguin-invert' variant='light' onClick={() => handleChangeStatus(order.id, ORDER_STATUS.RECOGER)}>Recoger</Button>
                                    )}
                                    {[ORDER_STATUS.RECOGER].includes(order.estado) && (
                                        <Button className='mb-1 btn--loguin-invert' variant='light' onClick={() => handleChangeStatus(order.id, ORDER_STATUS.CAMINO)}>En camino</Button>
                                    )}
                                    {[ORDER_STATUS.CAMINO].includes(order.estado) && (
                                        <Button className='mb-1 btn--loguin-invert' variant='light' onClick={() => handleChangeStatus(order.id, ORDER_STATUS.LLEGUE)}>Llegue</Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </td>
                    {user?.role.id === 7 && (
                        <td>
                            {order.estado === ORDER_STATUS.LLEGUE && (
                                <div className='d-flex flex-column'>
                                    <Button className='mb-1' variant='success' onClick={() => handleChangeStatus(order.id, ORDER_STATUS.ENTREGADO)}>Entregado</Button>
                                    <Button className='mb-1' variant='danger' onClick={() => handleChangeStatus(order.id, ORDER_STATUS.RECHAZADO)}>Rechazado</Button>
                                    <Button className='mb-1' variant='info' onClick={() => handleChangeStatus(order.id, ORDER_STATUS.NO_ENCONTRADO)}>No se encontro</Button>
                                </div>
                            )}
                        </td>
                    )}
                </tr>
            ))}
            </tbody>
        </Table>
            {showDetailModal && <OrderDetailModal show={showDetailModal} closeModal={handleCloseModal} order={order} />}
        </>
    );
}
