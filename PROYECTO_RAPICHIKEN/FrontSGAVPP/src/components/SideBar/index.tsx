import Link from "next/link";
import {useResponsivePageContext} from "../ResponsivePage/context";

export const SideBar = () => {
    const { user } = useResponsivePageContext();
  return (
      <ul className="nav flex-column sidebar--admin">
          {user?.role.id === 4 && (
              <>
                  <li className="nav-item">
                      <Link className="nav-link" href="/producto">Productos</Link>
                  </li>
                  <li className="nav-item">
                      <Link className="nav-link" href="/inventario">Inventario</Link>
                  </li>
                  <li className="nav-item">
                      <Link className="nav-link" href="/catalogo">Catalogo</Link>
                  </li>
                  <li className="nav-item">
                      <Link className="nav-link" href="/usuario">Usuarios</Link>
                  </li>
              </>
          )}
          {(user?.role.id === 4 || user?.role.id === 7) && (
              <li className="nav-item">
                  <Link className="nav-link" href="/pedidos">Pedidos</Link>
              </li>
          )}
          {user?.role.id === 5 && (
              <>
                  <li className="nav-item">
                      <Link className="nav-link" href="/crear-pedido">Crear Pedido</Link>
                  </li>
                  <li className="nav-item">
                      <Link className="nav-link" href="/caja-chica">Caja Chica</Link>
                  </li>
              </>
          )}
      </ul>
  );
}
