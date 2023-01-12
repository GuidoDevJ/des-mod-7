import { sequelize } from "./db/db";
import "./models/models";

// sequelize.sync solo lo activamos cada vez que queremos guardar una tabla nueva...
// si no lo activamos dará error 42P01 y la tabla nunca se guardará en la DB.
// Una vez activado y con la tabla ya almacenada, podemos comentarlo y trabajar el CRUD sin problemas.
sequelize.sync({ force: true }).then(res => console.log(res));