import {ResponsivePage} from "../components/ResponsivePage";
import {useCart} from "../components/Cart/useCart";
import {Table} from "react-bootstrap";
import {useEffect} from "react";

const VentaExitosa = () => {
    const { cart, total, discount } = useCart();

    useEffect(() => {
        const timer = setTimeout(() => {
            localStorage.removeItem('cart');
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <ResponsivePage>
            <div className='container d-flex flex-column align-items-center'>
                <h1>Venta Exitosa!</h1>
                <h3>Resumen de su pedido</h3>
                <Table>
                    <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Costo</th>
                    </tr>
                    </thead>
                    <tbody>
                    {cart && cart.products.length > 0 && cart.products.map(product => (
                        <tr key={`product-${product.id}`}>
                            <td>{product.nombre}</td>
                            <td>{product.cantidad}</td>
                            <td>{product.precio}</td>
                        </tr>
                    ))}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td className='fw-bold'>Subtotal</td>
                        <td colSpan={2}
                            className='text-center'>{Number(total - (total * 0.18)).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td className='fw-bold'>IGV</td>
                        <td colSpan={2} className='text-center'>{Number(total * 0.18).toFixed(2)}</td>
                    </tr>
                    {discount > 0 && (
                        <tr>
                            <td className='fw-bold'>Descuento</td>
                            <td colSpan={2} className='text-center'>-{Number(discount).toFixed(2)}</td>
                        </tr>
                    )}
                    <tr>
                        <td className='fw-bold'>Total</td>
                        <td colSpan={2} className='text-center'>{Number(total).toFixed(2)}</td>
                    </tr>
                    </tfoot>
                </Table>
            </div>
        </ResponsivePage>
    );
};

export default VentaExitosa;
