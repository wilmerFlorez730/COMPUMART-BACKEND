

-- Tabla Rol
CREATE TABLE tienda.Rol (
    ID_Rol SERIAL PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL
);

-- Tabla Cliente 
CREATE TABLE tienda.Cliente (
    ID_Cliente SERIAL PRIMARY KEY,
    Nombre VARCHAR(255) NOT NULL,
    Correo VARCHAR(255) UNIQUE NOT NULL,
    Contrasena VARCHAR(255) NOT NULL,
    Telefono VARCHAR(20),
    Fecha_registro DATE NOT NULL,
    Rol_ID SERIAL NOT NULL,  
    CONSTRAINT FK_Cliente_Rol FOREIGN KEY (Rol_ID) REFERENCES tienda.Rol(ID_Rol)
);

-- Tabla Categoria
CREATE TABLE tienda.Categoria (
    ID_Categoria SERIAL PRIMARY KEY,
    Nombre VARCHAR(255) NOT NULL,
    Descripcion VARCHAR(255)
);

-- Tabla Producto
CREATE TABLE tienda.Producto (
    ID_Producto SERIAL PRIMARY KEY,
    Nombre VARCHAR(255) NOT NULL,
    Precio INT NOT NULL,
    Stock INT NOT NULL,
    Categoria_ID SERIAL NOT NULL, 
    CONSTRAINT FK_Producto_Categoria FOREIGN KEY (Categoria_ID) REFERENCES tienda.Categoria(ID_Categoria)
);

-- Tabla Proveedor
CREATE TABLE tienda.Proveedor (
    ID_Proveedor SERIAL PRIMARY KEY,
    Nombre VARCHAR(255) NOT NULL,
    Telefono VARCHAR(20),
    Correo VARCHAR(255) UNIQUE
);

-- Tabla ProductoProveedor
CREATE TABLE tienda.ProductoProveedor (
    ID SERIAL PRIMARY KEY,
    Producto_ID SERIAL NOT NULL, 
    Proveedor_ID SERIAL NOT NULL, 
    CONSTRAINT FK_ProductoProveedor_Producto FOREIGN KEY (Producto_ID) REFERENCES tienda.Producto(ID_Producto),
    CONSTRAINT FK_ProductoProveedor_Proveedor FOREIGN KEY (Proveedor_ID) REFERENCES tienda.Proveedor(ID_Proveedor)
);

-- Tabla Pedido
CREATE TABLE tienda.Pedido (
    ID_Pedido SERIAL PRIMARY KEY,
    Fecha DATE NOT NULL,
    Estado VARCHAR(50) NOT NULL,
    Total DECIMAL(10, 2) NOT NULL,
    Cliente_ID SERIAL NOT NULL, 
    CONSTRAINT FK_Pedido_Cliente FOREIGN KEY (Cliente_ID) REFERENCES tienda.Cliente(ID_Cliente)
);

-- Tabla Envio
CREATE TABLE tienda.Envio (
    ID_Envio SERIAL PRIMARY KEY,
    Pedido_ID SERIAL NOT NULL,  
    Direccion VARCHAR(255) NOT NULL,
    Fecha_Entrega DATE,
    Estado VARCHAR(50) NOT NULL,
    CONSTRAINT FK_Envio_Pedido FOREIGN KEY (Pedido_ID) REFERENCES tienda.Pedido(ID_Pedido)
);

-- Tabla DetallePedido
CREATE TABLE tienda.DetallePedido (
    ID_Detalle SERIAL PRIMARY KEY,
    Pedido_ID SERIAL NOT NULL, 
    Producto_ID SERIAL NOT NULL,  
    Cantidad INT NOT NULL,
    Subtotal DECIMAL(10, 2) NOT NULL,
    PrecioUnitario INT NOT NULL,
    CONSTRAINT FK_DetallePedido_Pedido FOREIGN KEY (Pedido_ID) REFERENCES tienda.Pedido(ID_Pedido),
    CONSTRAINT FK_DetallePedido_Producto FOREIGN KEY (Producto_ID) REFERENCES tienda.Producto(ID_Producto)
);

-- Tabla Pago
CREATE TABLE tienda.Pago (
    ID_Pago SERIAL PRIMARY KEY,
    Metodo_Pago VARCHAR(100) NOT NULL,
    Estado VARCHAR(50) NOT NULL,
    Fecha_Pago DATE NOT NULL,
    DetallePedido_ID SERIAL NOT NULL,  
    
    CONSTRAINT FK_Pago_DetallePedido FOREIGN KEY (DetallePedido_ID) REFERENCES tienda.DetallePedido(ID_Detalle)
);
