import {ResponsivePage} from "../components/ResponsivePage";

const Home = () => {
  return (
      <ResponsivePage>
        <div className='container-fluid'>
            <div className='d-flex justify-content-center'>
                <h1>Bienvenido a RAPICHICKEN</h1>
            </div>
            <img className="pollo-home" src="/pollohome.webp" alt="" />
            <div className="enlaces-main">

              <a href="/iniciar-sesion" className="btn--loguin">Iniciar Sesión</a>
              <a href="/ver-catalogo" className="btn--loguin">Ver catálogo</a>
              <a href="/ver-promos" className="btn--loguin">Ver catálogo</a>
            </div>
        </div>
      </ResponsivePage>
  )
};

export default Home;
