import * as express from "express"
import * as path from "path"
import * as cors from "cors"
import * as bodyParser from "body-parser"
import { createUser, deleteAllUsers, getPets, getUser, updateData } from "../controllers/user_controllers";
import { createAuth, deleteAllAuth, getToken, updatePassword, validate } from "../controllers/auth_controllers";
import { User,Auth } from "../models/models";
import { uploadImage } from "../controllers/cloudinary_controllers";
import { createPetAlgolia, deletePetAlgolia, findAllNear, updatePetAlgolia } from '../controllers/algolia_controllers';
import { createPetDb, deletePet, getPetById, updatePet } from '../controllers/pet_controllers';
import { sendEmail } from "../lib/sengrid"
import * as dotenv from "dotenv"
dotenv.config()


const PORT = process.env.PORT || 3001

export const app = express()
const pathFile = path.resolve(__dirname,"../../../public")
app.use(cors())
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));
app.use(express.json())
app.use(express.static(pathFile));


// Autentificar Usuario
app.post("/auth",async (req,res)=>{
    try {
    const obj= req.body
    const user = await createUser(obj) as any
   
    const auth = await createAuth(obj,user)
    res.json(auth)
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
})
// Eliminar usuario
app.delete("/delete",async(req,res)=>{
    try {
        await deleteAllUsers()
        await deleteAllAuth()
        res.json({
            users:await User.findAll(),
            auths: await Auth.findAll()
        })
    } catch (error) {
        res.status(401).json({message:`Error:${error}`})
    }
})

// Autentificar y obtener token
app.post("/auth/token",async(req,res)=>{
    try {
        const obj = req.body
        const token = await getToken(obj)
        res.json({token})
    } catch (error) {
        res.status(401).json(error)
    }
   
})
// Cambiar info del usuario
app.put("/updateUser", validate,async(req,res)=>{
    const data = req.body
    const id = req.user_id 
    try {
        await updateData(data,id)
        res.status(201).json({res:true})
    } catch (error) {
        res.status(401).json({res:error})
    }

})

// Obtener data usuario por el iD
app.get("/getUser/:id",validate,async(req,res)=>{
    const id = req.params.id
    try {
        let user = await getUser(id)
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json(error)
    }
})
// Campiar contraseña
app.put("/updatepassword", validate,async(req,res)=>{
    const {password} = req.body
    const id = req.user_id 
    try {
        const re = await updatePassword(id,password)
        res.status(201).json({res:re })
    } catch (error) {
        res.status(401).json({res:error})
    }

})
// Subir imagen a cloudynari
app.post("/uploadimage",validate,async(req,res)=>{
    const {url} = req.body
    try {
        let ulrSecure = await uploadImage(url)
        res.status(200).json({url:ulrSecure})
    } catch (error) {
        res.status(401).json({msg:"Hubu un error" + error})
    }
})
// Crear pet en Algolia
app.post("/createPetAlgolia",validate,async(req,res)=>{
    const obj =req.body
        try {
            let dataAlgolia = await createPetAlgolia(obj)
            res.json({msg:"Success"})
        } catch (error) {
            res.status(401).json({msg:error})
        }
})
// Crear pet en BD
app.post("/createPetDb",validate,async(req,res)=>{
    const data = req.body
    const id = req.user_id
    try {
        let petCreated = await createPetDb({...data,UserId:id})
        res.status(201).json(petCreated) 
    } catch (error) {
        res.status(400).json(error) 
    }
})
// Obtener todos los pets de un usuario
app.get("/getPetsUserMe",validate,async(req,res)=>{
    const id = req.user_id
    try {
        let data = await getPets(id)
        res.status(203).json(data)
    } catch (error) {
        res.json(error) 
    }
})
// Obtener un pet por Id
app.get("/getPet/:id",validate,async(req,res)=>{
    const id = req.params.id
    try {
        const data = await getPetById(id)
        res.json(data)
    } catch (error) {
        res.status(400).json({msg:"Error "+error})
    }
    
})
// Adapatar un pet en la base de datos
app.put("/updatePetDb/:id",validate,async(req,res)=>{
    let objPet = req.body
    let id = parseInt(req.params.id)
    try {
        let result = await updatePet(id,objPet)
        res.json({msg:"Listo"})
    } catch (error) {
        res.json(error)
    }
})
// Modificar datos de un pet en algolia
app.put("/updatePetAlgolia/:id",validate,async(req,res)=>{
    let objPet = req.body
    let id = req.params.id
    let opcionAlgolia = {
        ...objPet,
        objectID:id
    }
    try {
        let result = await updatePetAlgolia(opcionAlgolia)
        res.json(result)
    } catch (error) {
        res.json(error)
    }
})
// Enviar email
app.post("/sendemail",validate,async(req,res)=>{
    const {to,petName,fullName,phone,data} = req.body
    try {
        let send = await sendEmail(to,petName,fullName,phone,data)
        res.json(send)
    } catch (error) {
        res.json(error)
    }
})
// Eliminar un pet en algolia
app.delete("/deletePetAlgolia/:id",validate,async(req,res)=>{
    const petId = req.params.id
    try {
        let result = await deletePetAlgolia(petId)
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
})
// Eliminar un pet de la base de datos
app.delete("/deletePetDb/:id",validate,async(req,res)=>{
    const petId = req.params.id
    try {
        let result = await deletePet(petId)
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
})
// Obtener todos los pets de una determinada zona
app.get("/pets-cerca-de",validate,async(req,res)=>{
    const lat = req.query.lat;
    const lng = req.query.lng;
    try {
        let result = await findAllNear(lat,lng)
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json(error)
    }

})
// Sobre el usuario
app.get("/me",validate,async(req,res)=>{
    const id = req.user_id
    const user = await getUser(id)
    res.json(user)
})

app.get("*",(req,res)=>{
    const ruta = path.resolve(__dirname,"../../../public/index.html")
    res.sendFile(ruta)
})
app.listen(PORT,()=>{
    console.log(`Escuchando en el puerto ${PORT}`)
})