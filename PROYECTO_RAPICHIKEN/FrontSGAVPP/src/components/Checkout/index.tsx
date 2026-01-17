import {useResponsivePageContext} from "../ResponsivePage/context";
import {useState} from "react";
import {Button, Table} from "react-bootstrap";
import {GuestForm} from "../GuestForm";
import {useCart} from "../Cart/useCart";
// @ts-ignore
import { Culqi, CulqiProvider } from "react-culqi";
import {useRouter} from "next/router";
import {LoggedUser} from "../LoggedUser";

export const Checkout = () => {
    const { isLogged } = useResponsivePageContext();
    const [showGuestForm, setShowGuestForm] = useState(false);
    const { buy, cart, total, discount } = useCart();
    const [user, setUser] = useState<any>(null);
    const router = useRouter();


    const handleOnSubmit = (data: any) => {
        if (!cart) {
            return;
        }

        setUser(data);
    };

    return cart && (
        <CulqiProvider publicKey="pk_test_P9GPCOGFKONFkR5u"
                       title="SGAPP"
                       onToken={async (token: any) => {
                           const result = await buy(cart, user, token);

                           if (typeof result === 'string'){
                               alert(result);
                               return;
                           }

                           if (result) {
                               await router.push('/venta-exitosa');
                           }
                       }}
                       onError={async (error: any) => {
                           console.log(error);
                           await router.push('/venta-fallida');
                       }} amount={(total * 100)}>
        <div className='d-flex'>
            <Culqi>
                {({ openCulqi }) => {
                    return (
                        <>
                            {isLogged ? (
                                <LoggedUser onSubmit={handleOnSubmit} openCulqi={openCulqi} />
                            ) : (
                                <div className={`flex-column ${showGuestForm ? 'd-none' : 'd-flex'}`}>
                                    <p>Deseas seguir como invitado? o puedes iniciar sesion <a
                                        href="/iniciar-sesion">aqui</a></p>
                                    <Button className='align-self-start' variant='light'
                                            onClick={() => setShowGuestForm(true)}>Seguir como invitado</Button>
                                </div>
                            )}
                            {showGuestForm && (
                                <div className='me-5'>
                                    <GuestForm onSubmit={handleOnSubmit} openCulqi={openCulqi}/>
                                </div>
                            )}
                            <div className='d-flex flex-column align-items-center w-100'>
                                <h2>Resumen</h2>
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
                        </>);
                }}
            </Culqi>
        </div>
        </CulqiProvider>
    );
};
