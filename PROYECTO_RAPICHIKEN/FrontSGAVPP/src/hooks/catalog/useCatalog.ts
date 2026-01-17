import {api} from "../../utils/api";

export const useCatalog = () => {
  const createCatalog = async (catalog: any): Promise<any> => {
      const { data: { data: dataRaw } } = await api.post('/catologos', {
          data: catalog,
      });

      return {
          ...dataRaw.attributes,
          id: dataRaw.id,
      };
  };

  const uploadPhoto = async (files: any, refId: string): Promise<boolean> => {
      const formData = new FormData();

      formData.append('files',files);
      formData.append('ref','api::catologo.catologo');
      formData.append('refId',refId);
      formData.append('field','foto');

      const response = await api.post('/upload', formData, {
          headers: {
              'content-type': 'multipart/form-data'
          }
      });

      return response.status === 200;
  }

  return {
      createCatalog,
      uploadPhoto,
  };
}
