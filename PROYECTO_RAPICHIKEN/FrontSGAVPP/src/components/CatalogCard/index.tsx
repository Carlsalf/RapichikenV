import {Button, Card} from "react-bootstrap";
import {Catalog} from "../../types/Catalog";
import {useCart} from "../Cart/useCart";
import {useResponsivePageContext} from "../ResponsivePage/context";
import {CartProduct} from "../../types/Cart";

export const CatalogCard = ({catalog}: { catalog: Catalog }) => {
    const { addProductToCart, cart } = useCart();
    const { inventories } = useResponsivePageContext();

    const handleAddToCart = () => {
        const { productos } = catalog;
        const productsAvailableToCart: boolean[] = [];

        const cartProducts = cart?.products.reduce((acc: any, value: CartProduct) => {
            const products = value.productos.map(product => ({ ...product, cantidad: product.cantidad * value.cantidad }));
            return [...acc, ...products];
        }, []) || [];

        const catalogProducts = productos.reduce((acc: any, product: any) => [...acc, product], []);

        const productsToAdd = [...cartProducts, ...catalogProducts].reduce((acc: any, value: any) => {
          if (acc[value.id]) {
              acc[value.id] = acc[value.id] + value.cantidad;
          } else {
              acc[value.id] = value.cantidad;
          }

          return acc;
        }, {});

        for(const productId in productsToAdd) {
            const inventory = inventories.find(inventory => Number(inventory.producto.id) === Number(productId));
            if (!inventory) {
                alert('No se puede agregar este producto al carrito');
                break;
            }

            if (Number(inventory.stock) >= productsToAdd[productId]) {
                productsAvailableToCart.push(true);
            } else {
                productsAvailableToCart.push(false);
                alert('No se puede agregar este producto al carrito');
                break;
            }
        }

        const isAvailableToAdd = productsAvailableToCart.length > 0 ? productsAvailableToCart.every(isAvailable => isAvailable) : false;

        if (isAvailableToAdd) {
            addProductToCart(catalog);
        }

    };

    return (
        <Card key={`catalog-${catalog.id}`}>
            <div className="cont-img">
                <Card.Img variant="top" src="/pollo.jpeg"/>
            </div>
            
            <Card.Body>
                <Card.Title>{catalog.nombre}</Card.Title>
                <Card.Text>
                    <p>{catalog.descripcion}</p>
                    <p>Precio: S/.{catalog.precio}</p>
                    {catalog.descuento > 0 && (<p>Descuento: S/.{catalog.descuento}</p>)}
                </Card.Text>
                <Button className="btn--agregar-carrito " variant="primary" onClick={handleAddToCart}>Agregar</Button>
            </Card.Body>
        </Card>
    );
};
