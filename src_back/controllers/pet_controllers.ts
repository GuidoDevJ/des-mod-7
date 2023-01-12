import { Pet } from "../models/models";

export const createPetDb = async(data)=>{
    console.log(data)
    try {
        let petCreated = await Pet.create(data)
        return petCreated.get("id")
    } catch (error) {
        return error
    }
}

export const deletePet = async(id)=>{
    try {
        let pet= await Pet.findByPk(id)
        await pet.destroy()
        return true
    } catch (error) {
        return false
    }
}

    


export const getPetById=async(id)=>{
    try {
        let pet =  await Pet.findByPk(id)
        return pet
        
    } catch (error) {
        return error
    }
}

export const updatePet = async (id,data)=>{
    let name = data.name
    let state = data.state
    let img = data.img
    let lat = data.lat
    let lng = data.lng
    try {
        
            await Pet.update({name,img,lat,lng,state},{where:{id}})
            return true
          
    } catch (error) {
        return false
    }
}