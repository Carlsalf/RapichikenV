import {ResponsivePage} from "../components/ResponsivePage";
import {Checkout} from "../components/Checkout";

const Pago = () => {
    return (
        <ResponsivePage>
            <div className='container'>
                <div className='d-flex flex-column'>
                    <h1 className='align-self-center'>Pago</h1>
                    <Checkout />
                </div>
            </div>
        </ResponsivePage>
    );
}

export default Pago;
