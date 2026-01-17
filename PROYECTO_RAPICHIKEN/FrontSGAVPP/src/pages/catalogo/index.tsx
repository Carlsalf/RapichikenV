import {ResponsivePage} from "../../components/ResponsivePage";
import {Button} from "react-bootstrap";
import {useRouter} from "next/router";
import {useCatalogs} from "../../hooks/catalog/useCatalogs";

const Catalogo = () => {
    const router = useRouter();
    const { catalogs, removeCatalog, enabledCatalog } = useCatalogs();

    const goToCreatePage = () => router.push('catalogo/nuevo');

    const handleRemoveCatalog = async (catalogId: string) => {
        await removeCatalog(catalogId);
    }

    const handleAddCatalog = async (catalogId: string) => {
        await enabledCatalog(catalogId);
    }

  return (
      <ResponsivePage>
          <div className='container mt-3'>
              <div className='d-flex justify-content-between'>
                  <h1 className='mb-2'>Catalogo</h1>
                  <Button variant='success' onClick={goToCreatePage}>Nuevo</Button>
              </div>
              <table className='table'>
                  <thead>
                  <tr>
                      <th scope="col">#</th>
                      <th scope="col">Nombre</th>
                      <th scope="col">Descripcion</th>
                      <th scope="col">Estado</th>
                      <th scope="col">Descuento</th>
                      <th scope="col">Precio</th>
                      <th scope="col"># productos</th>
                      <th scope="col" />
                  </tr>
                  </thead>
                  <tbody>
                  {catalogs.length > 0 && catalogs.map(catalog => (
                      <tr key={`catalog-${catalog.id}`}>
                          <td>{catalog.id}</td>
                          <td>{catalog.nombre}</td>
                          <td>{catalog.descripcion}</td>
                          <td>{catalog.disponible ? 'Disponible' : 'No Disponible'}</td>
                          <td>{catalog.descuento}</td>
                          <td>{catalog.precio}</td>
                          <td>{catalog.productos.length}</td>
                          <td>
                              <Button className='me-2' variant='danger' onClick={() => handleRemoveCatalog(catalog.id)}>Eliminar</Button>
                              <Button variant='primary' onClick={() => handleAddCatalog(catalog.id)}>Habilitiar</Button>
                          </td>
                      </tr>
                  ))}
                  </tbody>
              </table>
          </div>
      </ResponsivePage>
  );
};

export default Catalogo;
