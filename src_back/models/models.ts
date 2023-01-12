import { Auth } from "./auth";
import { Pet } from "./pet";
import { Report } from "./report";
import { User } from "./user";

User.hasOne(Auth)
Auth.belongsTo(User)

User.hasMany(Pet)
Pet.belongsTo(User)

User.hasMany(Report),
Report.belongsTo(User)
export {
    User,Auth,Pet,Report
}