const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routers = require('./routers'); // Importar routers desde la carpeta

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api', routers);  // Las rutas serán accedidas como /api/router1, /api/router2

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
