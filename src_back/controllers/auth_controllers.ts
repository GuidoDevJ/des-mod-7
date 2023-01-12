import { Auth } from "../models/models";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";

const INSECURE_ALGORITHM = "sha1";
const pass = `${process.env.AUTH_PASSWORD}`;
const getInsecureSHA1 = function (input) {
  return crypto.createHash(INSECURE_ALGORITHM).update(input).digest("hex");
};

export const createAuth = async (obj, user:number) => {
  const { email, password } = obj;
  const [userAuth, createdAuth] = await Auth.findOrCreate({
    where: { email: email },
    defaults: {
      email,
      password: getInsecureSHA1(password),
      UserId: user,
    },
  });
  return {
    userAuth,
    createdAuth,
  };
};

export const getToken = async (obj) => {
  let { password, email } = obj;
  const hashPassword = getInsecureSHA1(password);
  password = hashPassword
  const auth = await Auth.findOne({ where: { email, password } });
  if (auth === null) {
    console.log("Not found!");
    return false;
  } else {
    const token = jwt.sign({ id: auth.get("UserId") }, pass);
    return token;
  }
};
export function validate(req,res,next){
    let auth:string = req.get("Authorization").split(" ")[1]
    
    try {
        const data = jwt.verify(auth,pass) as any
        req.user_id = data.id 
        next()
        
    } catch (error) {
        res.status(401).json({message:"error"})
    }
}

export const updatePassword = async (UserId:number, newpassword:string) => {
  try {
    const hasspass = getInsecureSHA1(newpassword);
    let password = hasspass
    const res = await Auth.update({ password }, { where: { UserId } });
    return true;
  } catch (error) {
    console.log(error)

    return false;
  }
};

export async function deleteAllAuth():Promise<void> {
    const users = await Auth.findAll()
          users.forEach(el=>{
              el.destroy()
          })
  }