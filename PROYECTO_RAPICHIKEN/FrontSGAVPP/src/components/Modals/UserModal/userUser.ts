import {useEffect, useState} from "react";
import {Role} from "../../../types/Role";
import {api} from "../../../utils/api";

export const useUser = () => {
    const [roles, setRoles] = useState<Role[]>([]);

    const getRoles = async () => {
        const { data: { roles: rolesRaw } } = await api.get('/users-permissions/roles');

        const rolesMapping = rolesRaw.filter((role: any) => ![1, 2, 3].includes(role.id)).map(({id, description}) => ({ id, name: description }))

        setRoles(rolesMapping);
    };

    useEffect(() => {
        getRoles();
    }, []);

    return {
        roles,
    };
};
