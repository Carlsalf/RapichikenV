import {Button, Card, Offcanvas} from "react-bootstrap";
import {useEffect, useMemo, useState} from "react";
import {Cart as CartType, CartProduct} from "../../types/Cart";
import {useRouter} from "next/router";
import {useResponsivePageContext} from "../ResponsivePage/context";
import {ProductCatalog} from "../../types/Catalog";

export const Cart = ({ show, handleClose }: { show: boolean; handleClose: () => void; }) => {
    const [cart, setCart] = useState<CartType | null>(null);
    const { push } = useRouter();
    const { inventories } = useResponsivePageContext();

    const total = useMemo<number>(() => {
        if (cart) {
            return cart.products.reduce((acc, product) => acc + product.cantidad * (product.precio - product.descuento), 0);
        }

        return 0;
    }, [cart]);

    const handleRemoveProduct = (productId: string) => {
        if (cart) {
            const productIds = cart.products.map(product => product.id);
            const indexProduct = productIds.indexOf(productId);

            if (indexProduct > -1) {
                const product = cart.products[indexProduct];
                cart.products.splice(indexProduct, 1);
                cart.total = cart.total - Number(product.descuento > 0 ? (product.precio - product.descuento) : product.precio);

                localStorage.setItem('cart', JSON.stringify({ ...cart }));
                location.reload();
            }
        }
    };

    const handleClearCart = () => {
        localStorage.removeItem('cart');
        handleClose();
    };

    const handleBuy = async () => {
        await push('/pago');
    };

    const checkProductCanBeAddedToCart = (products: ProductCatalog[], quantity: number): boolean => {
        const productsAvailableToCart: boolean[] = [];

        const cartProducts = cart?.products.reduce((acc: any, value: CartProduct) => {
            const products = value.productos.map(product => ({ ...product, cantidad: product.cantidad * value.cantidad }));
            return [...acc, ...products];
        }, []) || [];

        const productsToAdd = [...cartProducts, ...products].reduce((acc: any, value: any) => {
            if (acc[value.id]) {
                acc[value.id] = acc[value.id] + (value.cantidad * quantity);
            } else {
                acc[value.id] = value.cantidad;
            }

            return acc;
        }, {});

        for(const productId in productsToAdd) {
            const inventory = inventories.find(inventory => Number(inventory.producto.id) === Number(productId));

            if (!inventory) {
                productsAvailableToCart.push(false);
                break;
            }
            if (Number(inventory.stock) >= productsToAdd[productId]) {
                productsAvailableToCart.push(true);
            } else {
                productsAvailableToCart.push(false);
                break;
            }
        }

        return productsAvailableToCart.length > 0 ? productsAvailableToCart.every(isAvailable => isAvailable) : false;
    };

    const changeQuantity = (value: number, productId: string) => {
        if (!cart) {
            return;
        }

        const productIds = cart.products.map(product => product.id);
        const indexProduct = productIds.indexOf(productId);
        const product = cart.products[indexProduct];

        if (!checkProductCanBeAddedToCart(product.productos, value)) {
            alert('No se puede agregar mas al carrito por falta de stock');
            return;
        }

        cart.products[indexProduct].cantidad = cart.products[indexProduct].cantidad + value;

        if (cart.products[indexProduct].cantidad === 0) {
            handleRemoveProduct(productId);
            return;
        }

        setCart({ ...cart });
        localStorage.setItem('cart', JSON.stringify({ ...cart }));
    };

    useEffect(() => {
        const cartRaw = localStorage.getItem('cart');

        if (cartRaw) {
            const cart = JSON.parse(cartRaw) as CartType;
            setCart(cart);
        }
    }, []);

    return (
        <Offcanvas show={show} onHide={handleClose} placement='end'>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Carrito de compras</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <div className='d-flex flex-column justify-content-between h-100'>
                <div className='d-flex flex-column overflow-scroll'>
                    {cart && cart.products.length > 0 && cart.products.map((product) => (
                        <Card body key={`cart-${product.id}`}>
                            <div className='d-flex flex-column'>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <div>{product.nombre}</div>
                                    <div>
                                        <Button variant='light' onClick={() => changeQuantity(-1, product.id)}>-</Button>
                                        <span>{product.cantidad}</span>
                                        <Button variant='light' onClick={() => changeQuantity(1, product.id)}>+</Button>
                                    </div>
                                    <Button className="carrito-btn-borrar" variant='danger' onClick={() => handleRemoveProduct(product.id)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zM9 4v2h6V4H9z" fill="rgba(67,67,67,1)"/></svg></Button>
                                </div>
                                <div className='d-flex justify-content-between'>
                                    <div>Precio: S/.{product.precio * product.cantidad}</div>
                                    <div>Desc: S/.{product.descuento * product.cantidad}</div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
                {cart && (
                    <div className='d-flex flex-column mt-3' style={{ borderTop: '2px solid black' }}>
                        <div className='d-flex justify-content-between'>
                            <span>SubTotal</span>
                            <span>{Number(total - (total * 0.18)).toFixed(2)}</span>
                        </div>
                        <div className='d-flex justify-content-between'>
                            <span>IGV</span>
                            <span>{Number(total * 0.18).toFixed(2)}</span>
                        </div>
                        <div className='d-flex justify-content-between'>
                            <span>Total</span>
                            <span>{Number(total)}</span>
                        </div>
                        <div className='d-flex justify-content-between mt-5'>
                            <Button variant='danger' onClick={handleClearCart}>Limpiar</Button>
                            <Button variant='success' onClick={handleBuy}>Comprar</Button>
                        </div>
                    </div>
                )}
                </div>
            </Offcanvas.Body>
        </Offcanvas>
    );
};
