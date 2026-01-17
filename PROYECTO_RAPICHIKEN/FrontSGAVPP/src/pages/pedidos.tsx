import {ResponsivePage} from "../components/ResponsivePage";
import {AllOrdersTable} from "../components/OrdersTable/AllOrdersTable";

const Pedidos = () => {
    return (
        <ResponsivePage>
            <div className='container  mt-3'>
                <div className='d-flex justify-content-center'>
                    <h1 className='mb-2'>Pedidos</h1>
                </div>
                <AllOrdersTable />
            </div>
        </ResponsivePage>
    );
}

export default Pedidos;
