import {useResponsivePageContext} from "../ResponsivePage/context";
import {Button} from "react-bootstrap";

export const LoggedUser = ({ onSubmit, openCulqi }: { onSubmit: (user: any) => void; openCulqi: () => void; }) => {
    const { user } = useResponsivePageContext();

    if (!user) {
        return null;
    }

    const handlePay = () => {
        onSubmit(user);
        openCulqi();
    };

    return (
        <div className='d-flex flex-column me-5' style={{ width: '480px' }}>
            <h4>Hola {user.nombre} {user.apellido}!</h4>
            <p>
                <span>DNI: </span>
                <span>{user.dni}</span>
            </p>
            <p>
                <span>Email: </span>
                <span>{user.email}</span>
            </p>
            <p>
                <span>Direccion: </span>
                <span>{user.direccion}</span>
            </p>
            <p>
                <span>Zona: </span>
                <span>{user.zona}</span>
            </p>
            <p className='fw-bold'>Si algun dato es incorrecto puedes actualizarlo <a href="/perfil">aqui</a></p>
            <Button variant='success' onClick={handlePay}>Pagar</Button>
        </div>
    );
}
