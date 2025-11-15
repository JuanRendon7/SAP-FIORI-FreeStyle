# Arquitectura Completa - Aplicación SAPUI5 Freestyle

## Resumen Ejecutivo
Esta es una aplicación SAPUI5 freestyle que sigue el patrón MVC (Model-View-Controller), generada con SAP Fiori Application Generator. Utiliza OData V2 para comunicarse con el servicio Northwind y presenta un listado de productos en una tabla.

**Versión UI5:** 1.142.0
**Namespace:** com.bootcamp.sapui5.freestyle
**OData Service:** Northwind OData V2 (https://services.odata.org/northwind/northwind.svc/)
**Tema:** sap_horizon

---

## 1. ESTRUCTURA DE ARCHIVOS PRINCIPAL

### 1.1 Árbol de Directorios
```
webapp/
├── Component.js                          # Componente raíz (inicialización, routing)
├── manifest.json                         # Descriptor de aplicación (configuración central)
├── index.html                           # Punto de entrada (no existe en este proyecto)
├── controller/                          # Controladores MVC
│   ├── App.controller.js               # Controlador raíz
│   └── Home.controller.js              # Controlador de página de inicio
├── view/                               # Vistas XML
│   ├── App.view.xml                    # Vista raíz (contenedor de routing)
│   ├── Home.view.xml                   # Vista de página de inicio
│   └── fragments/                      # Fragmentos reutilizables
│       └── ProductsTable.fragment.xml  # Tabla de productos
├── model/                              # Modelos de datos
│   └── models.js                       # Factory de modelos
├── utils/                              # Servicios y utilidades
│   ├── HomeHelper.js                   # Helper para lógica de negocio
│   └── HomeService.js                  # Servicio para llamadas OData
├── localService/                       # Mock data y metadata
│   └── mainService/
│       └── metadata.xml                # Metadata del servicio OData V2
├── i18n/                               # Internacionalización
│   └── i18n.properties                 # Textos en idiomas
├── css/                                # Estilos personalizados
│   └── style.css
└── test/                               # Pruebas unitarias e integración
    ├── unit/                           # Tests unitarios (QUnit)
    └── integration/                    # Tests integración (OPA5)
```

### 1.2 Archivos Raíz de Configuración
```
/
├── package.json                        # Dependencias y scripts npm
├── ui5.yaml                           # Configuración para desarrollo (CDN remote)
├── ui5-local.yaml                     # Configuración para desarrollo local
├── ui5-mock.yaml                      # Configuración con datos mock
└── ui5-deploy.yaml                    # Configuración para production
```

---

## 2. CAPAS MVC - ANÁLISIS DETALLADO

### 2.1 CONTROLADORES (webapp/controller/)

#### 2.1.1 App.controller.js
```javascript
Ruta: /home/user/projects/freestyle/webapp/controller/App.controller.js

Responsabilidad: Controlador raíz de la aplicación
- Extiende: sap.ui.core.mvc.Controller
- Namespace: com.bootcamp.sapui5.freestyle.controller.App
- Funcionalidad: Inicialización básica (onInit vacío)
- Propósito: Punto de entrada para lógica global
```

**Análisis:**
- Controlador mínimo que actúa como contenedor
- En esta app no hay lógica implementada en el nivel de App
- Podría albergar lógica compartida entre varias vistas (si existieran)

#### 2.1.2 Home.controller.js
```javascript
Ruta: /home/user/projects/freestyle/webapp/controller/Home.controller.js

Responsabilidad: Controlador para la vista Home
- Extiende: sap.ui.core.mvc.Controller
- Namespace: com.bootcamp.sapui5.freestyle.controller.Home
- Dependencias: 
  * HomeHelper (lógica de negocio)
  * MessageBox (dialogs SAP)

Métodos Principales:
1. onInit()
   - Vacío en esta implementación
   - Podría usarse para inicializar listeners, controles, etc.

2. onPress() [async]
   - Disparado por clic del botón "Buscar"
   - Flujo:
     a) Obtiene referencia a tabla (byId)
     b) Muestra indicador de carga (setBusy)
     c) Llama a HomeHelper.getDataProducts()
     d) Establece modelo ProductCollection con datos
     e) Muestra mensaje de éxito
     f) En caso de error: muestra diálogo de error
     g) Siempre: oculta indicador de carga (finally)
```

**Análisis:**
- Manejo robusto con try-catch-finally
- Usa i18n para mensajes multiidioma
- No almacena datos en controlador (delega en modelos)

### 2.2 VISTAS (webapp/view/)

#### 2.2.1 App.view.xml
```xml
Ruta: /home/user/projects/freestyle/webapp/view/App.view.xml

Tipo: Vista XML
Controlador: App.controller.js
displayBlock: true (usa display: block en CSS)

Estructura:
<mvc:View>
  └─ <App id="app">
      └─ pages (controlAggregation del router)
```

**Análisis:**
- Vista raíz/shell de la aplicación
- Contiene control <App> que es el contenedor de páginas
- El atributo 'app' es vinculado en manifest.json como controlId para router
- Vacío de contenido (el router inyecta las páginas dinámicamente)

#### 2.2.2 Home.view.xml
```xml
Ruta: /home/user/projects/freestyle/webapp/view/Home.view.xml

Tipo: Vista XML
Controlador: Home.controller.js
Estructura:
<mvc:View>
  └─ <Page id="page" title="{i18n>title}">
      ├─ <VBox id="vTest">
      │   ├─ <Text> (con texto i18n)
      │   └─ <Button press="onPress"> (dispara onPress del controlador)
      └─ <VBox id="vTest2">
          └─ <Fragment> (referencia a ProductsTable.fragment.xml)
```

**Análisis:**
- Página simple con botón de búsqueda
- Usa VBox para layout vertical
- Referencia un fragmento para la tabla (modularidad)
- Binding bidireccional con i18n
- Botón dispara evento onPress de Home.controller

#### 2.2.3 ProductsTable.fragment.xml (FRAGMENTO REUTILIZABLE)
```xml
Ruta: /home/user/projects/freestyle/webapp/view/fragments/ProductsTable.fragment.xml

Tipo: FragmentDefinition
Alcance: Definición de fragmento (puede incluirse en múltiples vistas)

Estructura:
<c:FragmentDefinition>
  └─ <Table id="idProductsTable" items="{ProductCollection>/}">
      ├─ <columns>
      │   ├─ Product
      │   ├─ UnitPrice
      │   ├─ UnitsInStock
      │   └─ QuantityPerUnit
      └─ <items>
          └─ <ColumnListItem>
              └─ <cells> (ObjectIdentifier, ObjectNumber, Text)
```

**Binding Data:**
- Path: ProductCollection>/ (modelo 'ProductCollection', raíz de array)
- Vincula array de productos a filas
- Propiedades: ProductID, ProductName, UnitPrice, UnitsInStock, QuantityPerUnit

**Análisis:**
- Tabla con binding a modelo ProductCollection (JSONModel)
- Cada fila corresponde a un producto
- Usa ObjectIdentifier para ID + nombre
- Usa ObjectNumber para precio con formato Currency (USD)
- Fragmento permite reutilización en múltiples vistas

---

## 3. CAPA DE SERVICIOS Y UTILIDADES (webapp/utils/)

### 3.1 HomeService.js (Servicio OData)
```javascript
Ruta: /home/user/projects/freestyle/webapp/utils/HomeService.js

Responsabilidad: Comunicación directa con OData
- Sin dependencias internas
- Patrón: Promise-based async

Método: readProducts(oModel, oFilter)
- Parámetros:
  * oModel: OData Model (de manifest)
  * oFilter: Array de filtros OData (actualmente vacío)
- Retorna: Promise.all([...])
- Operación: oModel.read('/Products', {...})
- Éxito: resolve(data) → array de productos
- Error: reject(error)
```

**Análisis:**
- Wrapper simple alrededor de oModel.read()
- Usa Promesas para abstracción async
- Endpoint: /Products (tabla de productos Northwind)
- Permite agregar filtros sin modificar llamada

### 3.2 HomeHelper.js (Lógica de Negocio)
```javascript
Ruta: /home/user/projects/freestyle/webapp/utils/HomeHelper.js

Responsabilidad: Orquestación de lógica de negocio
- Dependencias: HomeService, JSONModel
- Actúa como intermediario entre Controller y Service

Métodos:

1. init(oNorthwindModel)
   - Almacena referencia a OData Model global
   - Se llama desde Component.js.setInitModel()
   - Permite acceso al modelo en métodos posteriores

2. getDataProducts() [async]
   - Llama a HomeService.readProducts()
   - Retorna array de resultados
   - Gestión centralizada de filtros

3. setProductModel(oController, oDatos) [async]
   - Crea/obtiene modelo ProductCollection
   - Establece tamaño límite (1,000,000 registros)
   - Asigna datos al modelo
```

**Análisis:**
- Patrón: Separation of Concerns (servicios vs lógica)
- Singleton implícito: almacena _oNorthwindModel
- JSONModel con setSizeLimit() para manejo de grandes conjuntos
- Inicialización centralizada en Component

---

## 4. CAPA DE MODELOS (webapp/model/)

### 4.1 models.js
```javascript
Ruta: /home/user/projects/freestyle/webapp/model/models.js

Responsabilidad: Factory de modelos
- Dependencias: JSONModel, sap/ui/Device

createDeviceModel()
- Crea JSONModel con datos del dispositivo
- Vinculación OneWay (unidireccional: modelo → vista)
- Datos: isPhone, isTablet, isDesktop, orientation, etc.
- Registrado como: "device" (en manifest)
```

**Análisis:**
- Factory pattern para creación centralizada
- Modelo de dispositivo es solo lectura (OneWay)
- Datos se usan en vistas para diseño responsivo

---

## 5. MODELOS DE DATOS - TIPOS Y CONFIGURACIÓN

### 5.1 Modelos Registrados en la Aplicación

#### A) OData Model (Modelo por defecto - "")
```
Tipo: sap.ui.model.odata.ODataModel (V2)
Nombre: "" (default model)
Origen: manifest.json
Datos: Data source "mainService"
Preload: true
Configuración:
{
  "dataSource": "mainService",
  "preload": true,
  "settings": {}
}
```

**Características:**
- Conecta a Northwind OData V2
- Cargado automáticamente en inicialización
- Almacena referencia global (accesible vía this.getModel())
- Metadata: /webapp/localService/mainService/metadata.xml

#### B) i18n Model (Internacionalización)
```
Tipo: sap.ui.model.resource.ResourceModel
Nombre: "i18n"
Bundle: com.bootcamp.sapui5.freestyle.i18n.i18n
Archivo: /webapp/i18n/i18n.properties
```

**Características:**
- Textos multiidioma
- Acceso: {i18n>clave} en vistas
- En controlador: this.getView().getModel("i18n").getResourceBundle()

#### C) Device Model (Dispositivo)
```
Tipo: sap.ui.model.json.JSONModel
Nombre: "device"
Origen: models.js
Datos: Información del dispositivo
```

**Características:**
- Datos de ejecución del dispositivo
- Lectura solo (OneWay binding)
- Usado para diseño responsivo

#### D) ProductCollection Model (Dinámico)
```
Tipo: sap.ui.model.json.JSONModel
Nombre: "ProductCollection"
Origen: Creado dinámicamente en HomeHelper
Inicialización: Cuando el usuario hace clic en "Buscar"
Tamaño límite: 1,000,000 registros
```

**Características:**
- Creado por HomeHelper.setProductModel()
- Vinculado a tabla en ProductsTable.fragment.xml
- Actualizado con datos de OData (HomeService.readProducts)

### 5.2 Flujo de Datos en Modelos
```
OData Service (Northwind)
         ↓
ODataModel (manifest)
         ↓
HomeService.readProducts()
         ↓
HomeHelper.getDataProducts()
         ↓
Home.controller.onPress()
         ↓
HomeHelper.setProductModel()
         ↓
ProductCollection JSONModel
         ↓
ProductsTable.fragment.xml (binding)
         ↓
Table UI5 (renderización)
```

---

## 6. SERVICIO ODATA - CONFIGURACIÓN DETALLADA

### 6.1 Data Source en manifest.json
```json
"dataSources": {
  "mainService": {
    "uri": "/northwind/northwind.svc/",
    "type": "OData",
    "settings": {
      "annotations": [],
      "localUri": "localService/mainService/metadata.xml",
      "odataVersion": "2.0"
    }
  }
}
```

**Parámetros:**
- **uri**: Endpoint en runtime (/northwind/northwind.svc/)
- **localUri**: Metadata para desarrollo (mockup)
- **odataVersion**: OData V2 (no V4)

### 6.2 Metadata OData (webapp/localService/mainService/metadata.xml)
```xml
Namespace: NorthwindModel
EntityContainer: NorthwindEntities

Entidades Principales:
- Product (ProductID, ProductName, UnitPrice, UnitsInStock, QuantityPerUnit, etc.)
- Category
- Order
- Customer
- Employee
- Supplier
- Y más...

EntitySets Disponibles:
- /Products
- /Categories
- /Orders
- /Customers
- /Employees
- /Suppliers
- /Shippers
- /Regions
- /Territories
- /Order_Details
- (Y vistas adicionales)
```

### 6.3 Entity: Product
```xml
Propiedades:
- ProductID (Edm.Int32, clave primaria)
- ProductName (Edm.String)
- SupplierID (Edm.Int32, FK)
- CategoryID (Edm.Int32, FK)
- QuantityPerUnit (Edm.String)
- UnitPrice (Edm.Decimal)
- UnitsInStock (Edm.Int16)
- UnitsOnOrder (Edm.Int16)
- ReorderLevel (Edm.Int16)
- Discontinued (Edm.Boolean)

NavigationProperties:
- Category (N:1)
- Order_Details (1:N)
- Supplier (N:1)
```

### 6.4 Endpoints OData Usados en la App
```
GET /Products
- Retorna: Array de todos los productos
- Respuesta esperada:
{
  "results": [
    {
      "ProductID": 1,
      "ProductName": "Chai",
      "UnitPrice": "18.00",
      "UnitsInStock": 39,
      "QuantityPerUnit": "10 boxes x 20 bags",
      ...
    },
    ...
  ]
}
```

---

## 7. ROUTING - CONFIGURACIÓN EN manifest.json

### 7.1 Estructura de Routing
```json
"routing": {
  "config": {
    "routerClass": "sap.m.routing.Router",
    "controlAggregation": "pages",
    "controlId": "app",
    "transition": "slide",
    "type": "View",
    "viewType": "XML",
    "path": "com.bootcamp.sapui5.freestyle.view",
    "async": true,
    "viewPath": "com.bootcamp.sapui5.freestyle.view"
  },
  "routes": [...],
  "targets": {...}
}
```

**Parámetros:**
- **controlId**: "app" → elemento <App id="app"> en App.view.xml
- **controlAggregation**: "pages" → agregación dónde insertar vistas
- **transition**: "slide" → animación entre vistas
- **async**: true → carga asíncrona de vistas
- **viewPath**: Namespace base para vistas

### 7.2 Rutas Definidas
```json
"routes": [
  {
    "name": "RouteHome",
    "pattern": ":?query:",
    "target": ["TargetHome"]
  }
]
```

**Análisis:**
- Una única ruta: RouteHome
- Pattern `:?query:` → ruta por defecto (home)
- Target → TargetHome

### 7.3 Targets
```json
"targets": {
  "TargetHome": {
    "id": "Home",
    "name": "Home"
  }
}
```

**Mapeo:**
- TargetHome → Home.view.xml (archivo)
- id: "Home" → id del control generado

### 7.4 Root View
```json
"rootView": {
  "viewName": "com.bootcamp.sapui5.freestyle.view.App",
  "type": "XML",
  "id": "App",
  "async": true
}
```

**Análisis:**
- Vista raíz: App.view.xml
- Se carga primera en el DOM

---

## 8. FLUJO DE DATOS COMPLETO (UI A BACKEND)

### 8.1 Inicialización de la Aplicación
```
1. index.html (punto de entrada - carga UI5)
        ↓
2. bootstrap UI5 → carga Component.js
        ↓
3. Component.init()
   ├─ Llama: UIComponent.prototype.init()
   ├─ Crea Device Model (models.createDeviceModel())
   ├─ Registra modelo "device"
   ├─ Inicializa router (this.getRouter().initialize())
   └─ Llama: this.setInitModel()
        ↓
4. setInitModel()
   └─ Llama: HomeHelper.init(this.getModel())
        └─ Almacena referencia a ODataModel
        ↓
5. manifest.json se procesa
   ├─ Carga ODataModel (mainService)
   ├─ Carga i18n Model
   ├─ Configura rutas
   └─ Carga Root View (App.view.xml)
        ↓
6. Router inicializa y carga Home.view.xml
   ├─ Renderiza Page con botón "Buscar"
   └─ Renderiza fragmento ProductsTable (tabla vacía)
        ↓
7. App lista para interacción del usuario
```

### 8.2 Flujo: Usuario Hace Clic en "Buscar"
```
Usuario hace clic en botón "Buscar"
        ↓
Home.controller.onPress() ejecuta
        ├─ this.byId("idProductsTable").setBusy(true)
        └─ Entra en try block
        ↓
HomeHelper.getDataProducts()
        └─ HomeService.readProducts(this._oNorthwindModel, [])
        ↓
HomeService.readProducts() ejecuta
        └─ oModel.read('/Products', {
             filters: [],
             success: resolve,
             error: reject
           })
        ↓
ODataModel realiza HTTP GET
        ↓
Northwind OData Service responde
        ├─ Status: 200
        └─ Body: { "results": [...productos...] }
        ↓
Promise.all() resuelve
        └─ Retorna [{ results: [...] }]
        ↓
Home.controller.onPress() - línea: setProductModel()
        └─ HomeHelper.setProductModel(this, oDatos[0].results)
        ↓
HomeHelper.setProductModel()
        ├─ Obtiene/crea modelo "ProductCollection"
        ├─ Asigna datos: oListModel.setData(oDatos)
        └─ Trigger binding update
        ↓
Home.view actualiza binding
        └─ ProductsTable.fragment.xml se actualiza
        ↓
Table se renderiza con productos
        ├─ Filas creadas para cada producto
        ├─ Columnas vinculadas a propiedades
        └─ Formato Currency para UnitPrice
        ↓
MessageBox.success() muestra notificación
        ↓
finally block ejecuta
        └─ this.byId("idProductsTable").setBusy(false)
        ↓
Fin - App con tabla poblada
```

### 8.3 Manejo de Errores
```
Si error en read():
        ↓
Promise rechazado
        ↓
catch block en Home.controller.onPress()
        ├─ MessageBox.error(mensaje i18n)
        ├─ console.error(error)
        └─ finally: setBusy(false)
```

---

## 9. COMPONENT.JS - ANÁLISIS DETALLADO

### 9.1 Estructura
```javascript
sap.ui.define([
  "sap/ui/core/UIComponent",
  "com/bootcamp/sapui5/freestyle/model/models",
  "com/bootcamp/sapui5/freestyle/utils/HomeHelper"
], (UIComponent, models, HomeHelper) => {
  return UIComponent.extend("com.bootcamp.sapui5.freestyle.Component", {
    metadata: {
      manifest: "json",
      interfaces: ["sap.ui.core.IAsyncContentCreation"]
    },
    init() {...},
    setInitModel() {...}
  });
});
```

### 9.2 Interfaces
```
sap.ui.core.IAsyncContentCreation:
- Indica que el componente soporta creación asíncrona
- El framework espera que las promesas se resuelvan
- Requiere que manifest esté disponible (descriptor)
```

### 9.3 Flujo de init()
```
1. Llamar init() de clase base (UIComponent)
2. Crear Device Model vía models.createDeviceModel()
3. Registrar con setModel(..., "device")
4. Iniciar router: this.getRouter().initialize()
5. Llamar setInitModel() para inicializar datos
```

### 9.4 Flujo de setInitModel()
```
HomeHelper.init(this.getModel())
        ↓
HomeHelper almacena ODataModel
        ↓
Listo para usar en métodos async posteriores
```

---

## 10. INTERNACIONALIZACIÓN (i18n)

### 10.1 Archivo de Propiedades
```
Ruta: /home/user/projects/freestyle/webapp/i18n/i18n.properties

Contenido Principal:
appTitle=Freestyle SAPUI5
appDescription=An SAP Fiori application.
title=Freestyle SAPUI5
freestyle-display.flpTitle=App freestyle SAPUI5
freestyle-display.flpSubtitle=SAPUI5

textPruebai18n=Text prueba
textBuscar=Buscar

Product=Product
UnitPrice=UnitPrice
UnitsInStock=UnitsInStock
QuantityPerUnit=QuantityPerUnit

errorLoadingProducts=Error loading products. Please try again.
MessageSuccess=Se consultaron los productos exitosamente
```

### 10.2 Uso en Vistas
```xml
{i18n>textBuscar}     → "Buscar"
{i18n>title}          → "Freestyle SAPUI5"
{i18n>Product}        → "Product"
```

### 10.3 Uso en Controladores
```javascript
this.getView().getModel("i18n").getResourceBundle().getText("MessageSuccess")
→ "Se consultaron los productos exitosamente"
```

---

## 11. RELACIONES ENTRE COMPONENTES

### 11.1 Dependencias por Archivo

**Component.js** depende de:
- models.js (createDeviceModel)
- HomeHelper.js (init)
- manifest.json (configuración)

**Home.controller.js** depende de:
- HomeHelper.js (getDataProducts, setProductModel)
- MessageBox (SAP)

**HomeHelper.js** depende de:
- HomeService.js (readProducts)
- JSONModel (crear modelo)

**HomeService.js** depende de:
- ODataModel (global del manifest)

**Home.view.xml** depende de:
- Home.controller.js
- ProductsTable.fragment.xml

**ProductsTable.fragment.xml** depende de:
- ProductCollection model (binding)

### 11.2 Diagrama de Inyección de Dependencias
```
Component.js
├─ Inyecta: models.js
├─ Inyecta: HomeHelper.js
└─ Inyecta: manifest (descriptor)

Home.controller.js
├─ Inyecta: HomeHelper.js
├─ Accede: ODataModel (vía Component)
└─ Accede: i18n Model (vía Component)

HomeHelper.js
├─ Inyecta: HomeService.js
├─ Almacena: ODataModel (pasado por Component)
└─ Crea: JSONModel (ProductCollection)

HomeService.js
└─ Recibe: ODataModel (pasado por HomeHelper)
```

---

## 12. CONFIGURACIÓN DE RUNTIME

### 12.1 ui5.yaml (Desarrollo - Remote CDN)
```yaml
specVersion: '3.0'
metadata:
  name: freestyle
  namespace: com/bootcamp/sapui5/freestyle
type: application
server:
  customMiddleware:
    - name: fiori-tools-proxy
    - name: fiori-tools-appreload
    - name: fiori-tools-preview
```

### 12.2 ui5-local.yaml (Desarrollo - UI5 Local)
```yaml
# Con bibliotecas UI5 descargadas localmente
# Más rápido sin internet
# Offline capable
```

### 12.3 ui5-mock.yaml (Desarrollo - Mock Server)
```yaml
# Mock OData Server
# Datos fake para testing
# Sin backend requerido
```

### 12.4 ui5-deploy.yaml (Production)
```yaml
# Optimizado para Cloud Foundry
# Build preload
# Minificación
```

---

## 13. SCRIPTS NPM DISPONIBLES

```json
"start": "fiori run --open \"test/flp.html#app-preview\""
→ Inicia con Fiori Launchpad (CDN UI5)

"start-local": "fiori run --config ./ui5-local.yaml ..."
→ Inicia con librerías UI5 locales (más rápido)

"start-mock": "fiori run --config ./ui5-mock.yaml ..."
→ Inicia con mock server (sin backend)

"start-noflp": "fiori run --open \"/index.html?sap-ui-xx-viewCache=false\""
→ Inicia sin Fiori Launchpad

"unit-test": "fiori run --config ./ui5-mock.yaml ... unit/"
→ Ejecuta pruebas unitarias (QUnit)

"int-test": "fiori run --config ./ui5-mock.yaml ... integration/"
→ Ejecuta pruebas de integración (OPA5)

"build": "ui5 build ... --dest dist"
→ Build para desarrollo

"build:cf": "ui5 build preload ... ui5-deploy.yaml"
→ Build para Cloud Foundry

"build:mta": "mbt build"
→ Build Multi-Target Application

"deploy": "fiori cfDeploy"
→ Deploy a Cloud Foundry

"undeploy": "cf undeploy ..."
→ Undeploy de Cloud Foundry
```

---

## 14. RESUMEN DE TECNOLOGÍAS

| Aspecto | Tecnología | Versión |
|--------|-----------|---------|
| Framework UI | SAPUI5 | 1.142.0 |
| Patrón | MVC | - |
| Modelo de Datos | OData V2 | 2.0 |
| Componentes | XML Views | - |
| Estilos | sap_horizon | - |
| Build Tool | UI5 CLI | - |
| Testing Unit | QUnit | - |
| Testing Integration | OPA5 | - |
| Internacionalización | i18n Properties | - |
| Deployment | Cloud Foundry + MTA | - |

---

## 15. RESPONSABILIDADES POR CAPA

### Vista (View)
- Renderización de UI
- Binding de datos
- Gestión de eventos (click del botón)
- Representación visual de modelos

### Controlador (Controller)
- Lógica de presentación
- Manejo de eventos de usuario
- Coordinación entre vista y modelo
- Gestión de estados visuales (setBusy)

### Helper (HomeHelper)
- Orquestación de procesos
- Gestión de modelos (crear, actualizar)
- Lógica de negocio central
- Inicialización de servicios

### Servicio (HomeService)
- Comunicación con backend
- Operaciones OData
- Promisificación de llamadas async
- Abstracción de detalles de red

### Modelo (model.js)
- Creación centralizada de modelos
- Factory pattern
- Modelos reutilizables

### Manifest.json
- Configuración declarativa
- Data sources
- Routing
- Models
- i18n

---

## 16. FLUJO VISUAL SIMPLIFICADO

```
┌─────────────────────────────────────────────────────┐
│ START: Aplicación se carga                         │
└──────────────────┬──────────────────────────────────┘
                   │
         ┌─────────▼──────────┐
         │ Component.init()   │
         └─────────┬──────────┘
                   │
         ┌─────────▼──────────────────────────┐
         │ • Crea Device Model                │
         │ • Carga ODataModel (manifest)      │
         │ • Inicializa Router                │
         │ • HomeHelper.init(ODataModel)      │
         └─────────┬──────────────────────────┘
                   │
         ┌─────────▼──────────────────────────┐
         │ Renderiza App.view.xml             │
         │ + Home.view.xml (routing)          │
         │ + ProductsTable.fragment.xml       │
         └─────────┬──────────────────────────┘
                   │
         ┌─────────▼──────────────────────────┐
         │ UI Lista para Interacción          │
         │ (tabla vacía)                      │
         └─────────┬──────────────────────────┘
                   │
    ┌──────────────┴──────────────┐
    │ Usuario hace click en        │
    │ Botón "Buscar"              │
    └──────────────┬──────────────┘
                   │
         ┌─────────▼──────────────────────────┐
         │ Home.controller.onPress()          │
         │ • setBusy(true)                    │
         │ • getDataProducts()                │
         └─────────┬──────────────────────────┘
                   │
         ┌─────────▼──────────────────────────┐
         │ HomeHelper.getDataProducts()       │
         │ → HomeService.readProducts()       │
         └─────────┬──────────────────────────┘
                   │
         ┌─────────▼──────────────────────────┐
         │ ODataModel.read('/Products')       │
         │ (HTTP GET al backend)              │
         └─────────┬──────────────────────────┘
                   │
         ┌─────────▼──────────────────────────┐
         │ Promise Resuelto                   │
         │ + Array de Productos               │
         └─────────┬──────────────────────────┘
                   │
         ┌─────────▼──────────────────────────┐
         │ HomeHelper.setProductModel()       │
         │ • Crea ProductCollection Model     │
         │ • setData(productos)               │
         └─────────┬──────────────────────────┘
                   │
         ┌─────────▼──────────────────────────┐
         │ Binding Update                     │
         │ ProductsTable recibe actualización │
         └─────────┬──────────────────────────┘
                   │
         ┌─────────▼──────────────────────────┐
         │ Tabla Renderizada con Datos        │
         │ Columnas vinculadas a propiedades  │
         │ Formato Currency aplicado          │
         └─────────┬──────────────────────────┘
                   │
         ┌─────────▼──────────────────────────┐
         │ MessageBox.success()               │
         │ setBusy(false)                     │
         └─────────┬──────────────────────────┘
                   │
         ┌─────────▼──────────────────────────┐
         │ FIN: Datos Mostrados en Tabla      │
         └──────────────────────────────────────┘
```

---

## 17. ARCHIVOS CRÍTICOS - RESUMEN

| Archivo | Propósito | Criticidad |
|---------|-----------|-----------|
| Component.js | Inicialización | CRÍTICA |
| manifest.json | Configuración central | CRÍTICA |
| Home.controller.js | Lógica presentación | ALTA |
| Home.view.xml | UI principal | ALTA |
| HomeHelper.js | Orquestación | ALTA |
| HomeService.js | OData comm | ALTA |
| models.js | Factory modelos | MEDIA |
| ProductsTable.fragment.xml | Tabla UI | MEDIA |
| i18n.properties | Textos multiidioma | MEDIA |
| App.view.xml | Contenedor raíz | MEDIA |
| metadata.xml | OData schema | MEDIA |

---

## 18. EXTENSIONES POSIBLES

### Posibles Mejoras Arquitectónicas:
1. **Adicionar rutas**: Más vistas/controladores en manifest
2. **Modelos adicionales**: JSONModels para filtros, parámetros
3. **Servicios adicionales**: Para otras entidades OData
4. **Validación**: En controladores o helpers
5. **Caché**: En HomeService para optimizar
6. **Paginación**: En tabla ProductsTable
7. **Filtros avanzados**: En HomeService.readProducts()
8. **Testing**: Ampliar pruebas unitarias e integración

---

## Conclusión

Esta arquitectura SAPUI5 freestyle presenta un diseño limpio y modular siguiendo patrones MVC. 
La separación clara entre vistas, controladores, helpers y servicios facilita el mantenimiento 
y escalabilidad. El flujo de datos es predecible: usuario → controller → helper → service → OData → 
UI actualizada. La configuración centralizada en manifest.json reduce la complejidad global.

