import {Order, ORDER_STATUS_LABELS} from "../../../types/Order";
import {Button, Modal, Table} from "react-bootstrap";

export const OrderDetailModal = ({ closeModal, order, show }: { show: boolean; closeModal: () => void; order: Order | null }) => {

  return order && (
      <Modal show={show} onHide={closeModal}>
        <Modal.Header>
            <Modal.Title>Detalle de Orden</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='d-flex flex-column'>
                <h3>Cliente</h3>
                <div className='d-grid' style={{ gridTemplateColumns: 'auto auto', columnGap: '20px', rowGap: '20px' }}>
                    <span>Nombre: {order.nombreCompleto}</span>
                    <span>DNI: {order.dni}</span>
                    <span>Direccion: {order.direccion}</span>
                    <span>Zona: {order.zona}</span>
                    <span>Email: {order.email}</span>
                    <span className='text-capitalize'>Estado: {ORDER_STATUS_LABELS[order.estado]}</span>
                    <span>Total: {order.total}</span>
                    <span>Fecha: {new Date(order.createdAt).toLocaleString()}</span>
                </div>
                <h3 className='mt-3'>Productos</h3>
                <Table>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Monto</th>
                        <th>Descuento</th>
                    </tr>
                    </thead>
                    <tbody>
                    {order.detail.length > 0 && order.detail.map((detail, index) => (
                        <tr key={`order-detail-${detail.id}`}>
                            <th>{index + 1}</th>
                            <th>{detail.product.nombre}</th>
                            <th>{detail.cantidad}</th>
                            <th>{detail.monto}</th>
                            <th>{detail.descuento}</th>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
        </Modal.Body>
          <Modal.Footer>
              <Button variant="secondary" onClick={closeModal}>
                  Cerrar
              </Button>
          </Modal.Footer>
      </Modal>
  );
}
