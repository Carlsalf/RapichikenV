import {Button, Modal, Table} from "react-bootstrap";
import {useMyOrders} from "../../hooks/orders/useMyOrders";
import {useResponsivePageContext} from "../ResponsivePage/context";
import {useState} from "react";
import {OrderDetailModal} from "../Modals/OrderDetailModal";
import {Order, ORDER_STATUS_LABELS} from "../../types/Order";

export const OrdersTable = () => {
    const { user } = useResponsivePageContext();
    const { orders } = useMyOrders(user?.id);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [order, setOrder] = useState<Order | null>(null);

    const handleOpenModal = (order: Order) => {
        setOrder(order);
        setShowDetailModal(true);
    };

    const handleCloseModal = () => {
        setShowDetailModal(false);
    };

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
                </tr>
                </thead>
                <tbody>
                {orders.length > 0 && orders.map(order => (
                    <tr key={`order-${order.id}`}>
                        <td>{order.id}</td>
                        <td>{order.numeroPedido}</td>
                        <td>{order.detail.length}</td>
                        <td>{ORDER_STATUS_LABELS[order.estado]}</td>
                        <td>{new Date(order.createdAt).toLocaleString()}</td>
                        <td>{order.total}</td>
                        <td><Button variant='primary' onClick={() => handleOpenModal(order)}>Ver</Button></td>
                    </tr>
                ))}
                </tbody>
            </Table>
            {showDetailModal && <OrderDetailModal show={showDetailModal} closeModal={handleCloseModal} order={order} />}
        </>
    );
}
