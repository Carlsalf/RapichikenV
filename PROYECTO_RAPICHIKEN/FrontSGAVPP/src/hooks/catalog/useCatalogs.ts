import {useEffect, useMemo, useState} from "react";
import {Catalog} from "../../types/Catalog";
import {api} from "../../utils/api";

export const useCatalogs = () => {
    const [catalogs, setCatalogs] = useState<Catalog[]>([]);

    const catalogsClient = useMemo<Catalog[]>(() => catalogs.filter(catalog => catalog.disponible && Number(catalog.descuento) === 0), [catalogs]);

    const promos = useMemo<Catalog[]>(() => catalogs.filter(catalog => catalog.disponible && Number(catalog.descuento) > 0), [catalogs]);

    const getCatalogs = async () => {
        const { data: { data: dataRaw } } = await api.get('/catologos');

        const catalogsMapping = dataRaw.map(({ id, attributes }: { id: number; attributes: any }) => ({
            ...attributes,
            id,
            precio: Number(attributes.precio),
        }));

        setCatalogs(catalogsMapping);
    };

    const removeCatalog = async (catalogId: string) => {
        await api.put(`/catologos/${catalogId}`, {
            data: {
                disponible: false,
            }
        });

        await getCatalogs();
    };

    const enabledCatalog = async (catalogId: string) => {
        await api.put(`/catologos/${catalogId}`, {
            data: {
                disponible: true,
            }
        });

        await getCatalogs();
    };

    useEffect(() => {
        getCatalogs();
    }, []);

    return {
        catalogs,
        catalogsClient,
        removeCatalog,
        enabledCatalog,
        promos,
    };
}
