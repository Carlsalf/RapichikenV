import {ResponsivePage} from "../components/ResponsivePage";
import {Button} from "react-bootstrap";
import {useState} from "react";
import {UserModal} from "../components/Modals/UserModal";
import {User} from "../types/User";
import {useUsers} from "../hooks/user/useUsers";

const Usuario = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
    const [isNew, setIsNew] = useState(true);
    const { createUser, users, updateUser, removeUser, enableUser } = useUsers();

    const handleOnCloseModal = () => {
        setSelectedUser(undefined);
        setIsNew(true);
        setShowModal(false);
    };

    const handleOnOpenModal = () => setShowModal(true);

    const handleOnSubmit = async (data: User, isNew: boolean) => {
        let result: boolean;
        if (isNew) {
            result = await createUser(data);
        } else {
            result = await updateUser(data);
        }

        if (result) {
            handleOnCloseModal();
        }
    };

    const handleOnEdit = (user: User) => {
      setIsNew(false);
      setSelectedUser(user);
      handleOnOpenModal();
    };

    const handleOnRemove = async (userId: number) => {
        const hasAManager = users.some(user => user.role.id === 4 && !user.blocked && user.id !== userId);

        if (!hasAManager) {
            return alert('No puedes deshabilitar esta cuenta ya que te quedarias sin Gerente');
        }

        await removeUser(userId);
    }

    const handleOnEnable = async (userId: number) => {
        await enableUser(userId);
    }

    return (
        <ResponsivePage>
            <div className='container mt-3'>
                <div className='d-flex justify-content-between'>
                    <h1 className='mb-2'>Usuarios</h1>
                    <Button variant='success' onClick={handleOnOpenModal}>Nuevo</Button>
                </div>
                <table className='table'>
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nombre Completo</th>
                            <th scope="col">DNI</th>
                            <th scope="col">Correo</th>
                            <th scope="col">Rol</th>
                            <th scope="col">Estado</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 && users.map(user => (
                            <tr key={`user-${user.id}`}>
                                <td>{user.id}</td>
                                <td>{user.nombre} {user.apellido}</td>
                                <td>{user.dni}</td>
                                <td>{user.email}</td>
                                <td>{user.role.name}</td>
                                <td>{user.blocked ? 'No Dispnible' : 'Disponible'}</td>
                                <td>
                                    <Button className='me-2' variant='danger' onClick={() => handleOnRemove(user.id)}>Eliminar</Button>
                                    <Button className='me-2' variant='primary' onClick={() => handleOnEdit(user)}>Editar</Button>
                                    <Button variant='info' onClick={() => handleOnEnable(user.id)}>Habilitar</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showModal && <UserModal show={showModal} handleClose={handleOnCloseModal} isNew={isNew} onSubmit={handleOnSubmit} user={selectedUser} />}
        </ResponsivePage>
    );
}

export default Usuario;
