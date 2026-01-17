import {ResponsivePage} from "../components/ResponsivePage";
import {useCatalogs} from "../hooks/catalog/useCatalogs";
import {CatalogCard} from "../components/CatalogCard";

const VerCatalogo = () => {
    const { catalogsClient: catalogs } = useCatalogs();

    return (
        <ResponsivePage>
            <div className="container mt-3 mb-4">
                <h2>Nuestros productos</h2>
            </div>
            
            <div className='container'>
                <div className="contenedor-catalogo" style={{ display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 17rem), 1fr))',
                    columnGap: '35px',
                    rowGap: '25px', marginTop: '20px' }}>
                    {catalogs.map(catalog => <CatalogCard key={`catalog-${catalog.id}`} catalog={catalog} />)}
                </div>
            </div>
        </ResponsivePage>
    );
}
<script src="sweetalert2.min.js"></script>;
<link rel="stylesheet" href="sweetalert2.min.css"></link>;
<script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>;

export default VerCatalogo;
