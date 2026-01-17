import {ResponsivePage} from "../components/ResponsivePage";
import Link from "next/link";


const VentaFallida = () => {
    return (
        <ResponsivePage>
            <div className='container d-flex flex-column align-items-center'>
                <h1>Ocurrio un error!</h1>
                <p>Porfavor vuelva intentarlo</p>
                <Link href='/pago'>ir a pago</Link>
            </div>
        </ResponsivePage>
    );
};

export default VentaFallida;
