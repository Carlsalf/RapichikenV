import {ResponsivePage} from "../components/ResponsivePage";
import {useResponsivePageContext} from "../components/ResponsivePage/context";
import {ProfileForm} from "../components/ProfileForm";

const Perfil = () => {
    const { user } = useResponsivePageContext();

    return (
        <ResponsivePage>
            <div className='container'>
                <ProfileForm />
            </div>
        </ResponsivePage>
    );
}

export default Perfil;
