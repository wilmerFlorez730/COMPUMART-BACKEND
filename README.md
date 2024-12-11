

**🚀 Proyecto:** Backend para Tienda Online - *Compumart*  
**Desarrollador:** Equipo de Desarrollo de CompuMart  
**Directorio Fuente:** `/src/GitHub - Projects/Compumart-Backend` 📂  
**Creado:** 1-Diciembre-2024 🗓️  
**Última Actualización:** 10-Diciembre-2024 ✨  

---

### **Descripción**  
Este proyecto es un backend desarrollado en Node.js para gestionar las operaciones de una tienda en línea llamada *Compumart*. El sistema conecta distintas páginas HTML mediante APIs, utiliza una base de datos estructurada y normalizada, y sigue una arquitectura modular para facilitar el mantenimiento y escalabilidad.

¡Tus contribuciones y comentarios son bienvenidos! 🚀  

---

### **Estructura del Proyecto**

#### **DataBase/**
- **Propósito:** Contiene todos los scripts necesarios para la configuración de la base de datos.
  
  **Contenido:**
  - **`Scripts📂 `**: Script para crear la base de datos.
  - **`normalizacion.xsl`**: Definición de la normalización aplicada.
  - **`diccionario.xsl`**: Diccionario de datos con descripción de tablas, campos y relaciones.

#### **routers/**
- **Propósito:** Contiene los archivos para gestionar las APIs.

  **Contenido:**
  - **`productos.js`**: API para la gestión de productos.
  - **`usuarios.js`**: API para la gestión de usuarios.
  - **`ordenes.js`**: API para las órdenes de compra.

#### **Archivos raíz:**
- **`.env`**: Archivo de configuración para las variables de entorno.
- **`db.js`**: Configuración de la conexión a la base de datos.
- **`server.js`**: Punto de entrada del servidor.
- **`package.json`**: Declaración de dependencias y metadatos del proyecto.
- **`package-lock.json`**: Detalle de las dependencias instaladas.

---

### **Requisitos**
- Node.js 16+
- Un sistema de base de datos compatible (ej.: MySQL, PostgreSQL).

---

### **Instalación**

#### 1. Clonar el Repositorio  
```bash
git clone https://github.com/usuario/compumart-backend.git
cd compumart-backend
```

#### 2. Instalar Dependencias  
```bash
npm install
```

#### 3. Configurar Variables de Entorno  
Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido (modifica los valores según tu configuración):  
```plaintext
DB_HOST=localhost
DB_PORT=3306
DB_NAME=compumart
DB_USER=root
DB_PASSWORD=tu_contraseña
APP_ENV=development
PORT=3000
```

#### 4. Inicializar la Base de Datos  
Asegúrate de que tu base de datos esté corriendo y ejecuta los scripts de la carpeta `DataBase/` para configurarla.

#### 5. Ejecutar el Servidor  
Para iniciar el servidor, utiliza el siguiente comando:  
```bash
node server.js
```
El servidor se ejecutará en `http://localhost:3000` (o el puerto especificado en `.env`).

---

### **Notas Adicionales**
- **Modularidad:** Las rutas están organizadas en la carpeta `routers/` para facilitar la expansión del sistema.  
- **Escalabilidad:** La estructura del proyecto permite la integración de nuevos módulos sin afectar el núcleo del sistema.  
- **Configuración:** Utiliza el archivo `.env` para manejar configuraciones sensibles de manera segura.

--- 

¡Gracias por explorar el backend de Compumart! 🌟
