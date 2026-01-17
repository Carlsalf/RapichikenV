import {ResponsivePage} from "../components/ResponsivePage";
import {OrdersTable} from "../components/OrdersTable";

const MisPedidos = () => {
    return (
        <ResponsivePage>
            <div className='container mt-3'>
                <div className='d-flex flex-column'>
                    <h1 className='align-self-center'>Mis Pedidos</h1>
                    <div className='mt-2'>
                        <OrdersTable />
                    </div>
                </div>
            </div>
        </ResponsivePage>
    );
};

export default MisPedidos;
