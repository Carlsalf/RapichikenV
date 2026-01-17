import {ResponsivePage} from "../components/ResponsivePage";
import {useCatalogs} from "../hooks/catalog/useCatalogs";
import {Catalog} from "../types/Catalog";
import {Cart} from "../types/Cart";
import {CatalogCard} from "../components/CatalogCard";

const VerPromos = () => {
    const { promos } = useCatalogs();

    const handleAddToCart = (catalog: Catalog) => {
        const cartRaw = localStorage.getItem('cart');

        if (cartRaw) {
            const cart = JSON.parse(cartRaw) as Cart;
            const productIds = cart.products.map(product => product.id);
            const indexProduct = productIds.indexOf(catalog.id);

            if (indexProduct > -1) {
                cart.products[indexProduct].cantidad = cart.products[indexProduct].cantidad +1;
            } else {
                cart.products.push({ ...catalog, cantidad: 1 });
            }

            const total = catalog.descuento > 0 ? (cart.total + (catalog.precio - catalog.descuento)) : (cart.total + catalog.precio);

            localStorage.setItem('cart', JSON.stringify({ ...cart, total }));
        } else {
            localStorage.setItem('cart', JSON.stringify({
                products: [{ ...catalog, cantidad: 1 }],
                total: catalog.descuento > 0 ? (catalog.precio - catalog.descuento) : catalog.precio,
            }));
        }
    };

    return (
        <ResponsivePage>
            <div className='container'>
                <div style={{ display: 'grid',
                    gridTemplateColumns: 'repeat(4, auto)',
                    columnGap: '20px',
                    rowGap: '20px', marginTop: '20px' }}>
                    {promos.length > 0 && promos.map(catalog => <CatalogCard key={`catalog-promo-${catalog.id}`} catalog={catalog} />)}
                </div>
            </div>
        </ResponsivePage>
    );
}

export default VerPromos;
