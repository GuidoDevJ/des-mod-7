import { User,Pet,Auth } from "../models/models";


export async function  createUser(obj){
    const {email,name} = obj
    const [user, created] = await User.findOrCreate({
        where: { email: email},
        defaults: {
          email,
          name,
          
        }
      });
   
    return(user.get("id"))
}
export async function getUser(userId:number) {
  try {
    return await User.findByPk(userId)
    
  } catch (error) {
    return false
  }
}

export async function getAllUser(){
  try {
    return await User.findAll()
  } catch (error) {
    return error
  }
}

export async function updateData(data,id){
  const name = data.name
  const email = data.email
  try {
    if(name && email){
     await User.update({name,email},{where:{id}})
    }
    if(name){
     await User.update({name},{where:{id}})
    }
    if(email){
     await User.update({email},{where:{id}})
    }
  } catch (error) {
    return error
  }
}
export async function getPets(UserId: number) {
	const pets = await Pet.findAll({ where: { UserId } });
	return pets;
}

export async function deleteAllUsers():Promise<void> {
  const users = await User.findAll()
        users.forEach(el=>{
            el.destroy()
        })
}