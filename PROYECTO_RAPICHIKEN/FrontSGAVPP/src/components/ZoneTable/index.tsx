import {Table} from "react-bootstrap";

export const ZoneTable = () => {
    return (
        <Table striped bordered hover className='mt-5'>
            <thead>
            <tr>
                <th>Zonas</th>
                <th>Avenidas</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>A</td>
                <td>Av. Benavides, Av.Caminos del Inca, Av. Velasco Astete, Av.Nasarenas</td>
            </tr>
            <tr>
                <td>B</td>
                <td>Av. Surco, Av.Ayacucho, Av. Mariscal Catilla, Av.Castellana</td>
            </tr>
            <tr>
                <td>C</td>
                <td>Av. Proceres, Av.Guardia civil norte, Av. Vista alegre, Av. El sol</td>
            </tr>
            <tr>
                <td>D</td>
                <td>Av. Primavera, Av. Angamos, Av. San luis, Av. Encalada</td>
            </tr>
            </tbody>
        </Table>
    );
}
