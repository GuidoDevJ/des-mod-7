import { index } from "../lib/algolia";
// Crear la info del pet en algolia
export const createPetAlgolia = async (obj) => {
  try {
    const dataAlgolia = await index.saveObject({
      objectID: obj.id,
      nombre: obj.name,
      _geoloc: {
        lat: obj.lat,
        lng: obj.lng,
      },
    });

    return dataAlgolia;
  } catch (error) {
    return error;
  }
};
// Modificar la dato del pet en algolia
export const updatePetAlgolia = async (obj) => {
  const {nombre,lat,lng,objectID} = obj
  try {
      await index.partialUpdateObject({
        objectID,
      nombre: nombre,
      _geoloc: {
        lat: lat,
        lng: lng,
      }
      });
      return true;
    
  } catch (error) {
    return error;
  }
};

// Eliminar el pet de algolia
export const deletePetAlgolia=async(id)=>{
  try {
    const res = await index.deleteObject(id)
    return  res
  } catch (error) {
    return error
  }
}

export const findAllNear= async (lat,lng)=>{
  const results = await index.search("", {
    aroundLatLng: `${lat}, ${lng}`,
    aroundRadius:100000
  });
  const {hits} = results
  return hits
}