import Link from "next/link";
import {Button, Dropdown} from "react-bootstrap";
import {useCallback, useEffect, useState} from "react";
import {Cart} from "../Cart";
import { useRouter } from "next/router";
import {useResponsivePageContext, useResponsivePageDispatch} from "../ResponsivePage/context";

export const Header = () => {
    const [show, setShow] = useState(false);
    const router = useRouter();
    const { user, isLogged, isEmployee } = useResponsivePageContext();
    const { setUser } = useResponsivePageDispatch();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const goToLogin = () => router.push('iniciar-sesion');

    const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(undefined, false, false);
      router.push('/ver-catalogo');
    };

    const goToProfile = () => router.push('/perfil');

    const goToMyOrders = () => router.push('/mis-pedidos');

  return (
      <nav className="navbar navbar-expand-lg cabecera--principal">
          <div className="container-fluid">
              <Link className="navbar-brand" href={isEmployee ? '/' : '/ver-catalogo'}>
                  <img src="\logo.png" alt="Logo" className="logo--rapi"/>
              </Link>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                      aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                  {!isEmployee && (
                      <ul className="navbar-nav">
                          <li className="nav-item">
                              <Link className="nav-link" aria-current="page" href="/ver-catalogo">Catalogo</Link>
                          </li>
                          <li className="nav-item">
                              <Link className="nav-link" aria-current="page" href="/ver-promos">Promociones</Link>
                          </li>
                      </ul>
                  )}
              </div>
              <div className='d-flex justify-content-between contenedor--enlaces-cabecera'>
                  {isLogged && user ? (
                      <Dropdown>
                          <Dropdown.Toggle variant="light btn--loguin" id="dropdown-basic">
                              {user.nombre} {user.apellido}
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                              <Dropdown.Item onClick={goToProfile}>Mi perfil</Dropdown.Item>
                              {!isEmployee && <Dropdown.Item onClick={goToMyOrders}>Mis Pedidos</Dropdown.Item>}
                              <Dropdown.Item onClick={handleLogout}>Cerrar Sesion</Dropdown.Item>
                          </Dropdown.Menu>
                      </Dropdown>
                  ) : (
                    <Button className='me-2 btn--loguin' variant='light' onClick={goToLogin}>Iniciar Sesion</Button>
                  )}
                  {!isEmployee && <Button variant='light' onClick={handleShow}>                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M4 6.414L.757 3.172l1.415-1.415L5.414 5h15.242a1 1 0 0 1 .958 1.287l-2.4 8a1 1 0 0 1-.958.713H6v2h11v2H5a1 1 0 0 1-1-1V6.414zM6 7v6h11.512l1.8-6H6zm-.5 16a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm12 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" fill="rgba(213,57,57,1)"/></svg>
</Button>}
              </div>
          </div>
          {show && <Cart show={show} handleClose={handleClose} />}
      </nav>
  );
}
