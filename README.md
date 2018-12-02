# Taxis Inteligentes

 El proyecto de taxis inteligentes se basa en el seguimiento de los vehículos que prestan el servicio de movilizar pasajeros, estos vehículos están inscritos en el programa y de ellos se adquiere la ubicación, el estado, los servicios que se toman, las rutas teóricas y reales que se toman al momento de prestar un servicio, esta información se almacena, procesa y analiza para mejorar la movilidad en la ciudad además de regular el servicio.


# Como Instalar
clonar o descargar el repositorio
 ``` git clone [repo] ```
copiar y pegar el contenido en un servidor de aplicaciones
* tomcat
* IIS
* ...

ejecutar la aplicación desde el explorador

# Tecnologias usadas
* D3 V5
* ArcGIS V4.9 js
* EnjoyHint
* JQuery
* BulmaJs
___
# **_Insights:_** :shipit:

## Actividad de los Taxis

* Debido a la naturaleza de los datos se esperaría que el estado dominante fuera el Ocupado, al menos en ciertas horas del día, pero el estado Disponible domina por completo las mediciones.
* Los picos más altos (donde había más cantidad de taxis activos y por ende mayor número de mediciones) es entre las 10 y 11 de la mañana y la 1 y 3 de la tarde, siendo específicamente el más alto entre las 2 y 3 de la tarde.
* A pesar de que hay taxis disponibles no se encontraron servicios en el extremo sur de la ciudad (localidades de Ciudad Bolivar, San Cristobal y Rafael Uribe Uribe.
* Muy posiblemente algunos taxis perdieron conexión o transitaron con los sistemas fuera de línea debido a que al filtrar por taxi en algunos casos se puede notar que hay tramos de ruta que no están conectados.

## Uso de los Taxis

* Para el mes de abril de 2018 y mayo de 2018 la mayor cantidad de servicios generados fue en las localidades de Puente Aranda y Suba respectivamente.
* Los destinos mas servicios presentaron en los meses de abril y mayo de 2018 fueron Usaquén, Fontibón y suba.
* Las zonas centro y norte son las que mas servicios de taxi solicitan y donde mas servicios de taxi finalizan.
* Con el mapa se puede notar puntos calientes donde se podrían instalar zonas amarillas para que los taxis estén atentos a prestar el servicio.
___

# De dónde vienen los Datos

Los datos provienen de [Secretaria Distrital de Movilidad](http://www.movilidadbogota.gov.co/web/) y como mejora a iniciativa de la entidad [version actual](https://public.tableau.com/profile/camilo.nemocon#!/vizhome/TaxisMes/Historia1) 


___
## Actividad de los Taxis

### What

#### Tarea Principal

Dataset Availability: Static

Data Type: Items, Attributes 

Dataset Type: Temporal

_Attributes:_

| item   |      Type      |  Description |
|----------|:-------------:|------:|
| tarjetaControl |  Categorical | Identifica el taxi |
| idCarrera |  Categorical | Identifica el servicio (sólo disponible en estado Ocupado) |
| fechaHora |  Temporal | Fecha y hora de la medición del estado del taxi |
| latiitud |  Ordered -> Quantitative -> Diverging | Latitud de la medición |
| longitud |  Ordered -> Quantitative -> Diverging | Longitud de la medición |
| estado |  Categorical | Estado del vehículo al momento de la adquisición del dato: D,O; disponible, ocupado |
| rango_hora |  Ordered -> Ordinal | Clasificación en rangos de una hora de la hora de la medición del estado* |
| origen |  Categorical | Dato binario que identifica si la medición es el punto de origen de un servicio* |

(*) Campos derivados de los datos originales.

#### Tarea Secundaria

Dataset Availability: Dinamic (depends on filters)

Data Type: Items Attributes 

Dataset Type: Table

_Attributes:_

| item   |      Type      |  Description |
|----------|:-------------:|------:|
| estado |  Categorical | Estado del vehículo al momento de la adquisición del dato: D,O; disponible, ocupado |
| minutos |  Ordered -> Quantitative -> Sequential | Cantidad de minutos en un estado determinado* |

(*) Campos derivados de los datos originales.

### Why

* **Principal:** Evidenciar los momentos en los que los taxis pertenecientes al proyecto de Taxi Inteligente permanecen ocupados y disponibles. Para esto se entiende que el taxi se encuentra ocupado cuando se está transportando pasajeros y las aplicaciones móviles están en uso, el estado disponible significa que el conductor está a la espera de recibir una solicitud de servicio en la aplicación móvil o recoger un pasajero en la calle.
Identify -> Trends

* **Secundaria:** Determinar cuánto tiempo pasan los taxis en cada estado
Summarize -> Features
* **Secundaria:** Identificar espacialmente la ubicación de las mediciones de los estados.
Summarize -> Spatial Data
* **Secundaria:** Identificar rutas de los taxis.
Summarize -> Trends
* **Derive:** Modificar la información para lograr las tareas principales y secundarias.
Analyze -> Produce -> Derive (Attributes)

### How
#### Tarea Principal
* Encode:
  * Estado: Map – Color, hue.
  * Minutos: Arrange – Express.
* Mark: Area.
* Channels:
  * Estado: Color, hue.
  * *Minutos: Size.

#### Tarea Secundaria 1
* Encode:
  * Estado: Map – Color, hue.
  * Minutos: Arrange – Express.
* Mark: Area.
* Channels:
  * Estado: Color, hue.
  * Minutos: Size.

#### Tarea Secundaria 2
* Encode:
  * Estado: Map – Color, hue.
  * Latitud, Longitude: Arrange – Use.
* Mark: Shape (point).
* Channels:
  * Estado: Color, hue.
  * Latitud, Longitude: Position.

### Screenshots
![preview](/img/ss-a1.png)
![preview](/img/ss-a2.png)

___
## Uso de los Taxis

### What

#### Tarea Principal

Dataset Availability: Static

Data Types: Table -> Items -> Attributes -> links

Data and Dataset Types: Network

Dataset Types: Networks

_Attributes:_

| item   |      Type      |  Description |
|----------|:-------------:|------:|
| name (node) |  Categorical | nombres de las localidades de Bogotá |
| node (node) |    Categorical   |   identificador unico del nodo |
| region (node) | Categorical | zona geografica del set de datos|
| source (link) | Categorical | identificador de la localidad para el origen en la red|
| target (link) | Categorical | identificador de la localidad para el destino en la red |
| value (link) | Ordered -> Quantitative -> Sequential |  cantidad de servicios del origen al destino |

#### Tarea Secundaria

Dataset Availability: Static

Data Types: Table -> Items -> Attributes -> Positions

Data and Dataset Types: Geometry

Dataset Types: Geometry

_Attributes:_

| item   |      Type      |  Description |
|----------|:-------------:|------:|
| OBJECTID |  Categorical | ID unico del registro en el set de datos|
| NOMBRE |    Categorical | Nombre de la localidad donde se dejan o recogen pasajeros |
| SHAPE | Ordered -> Quantitative -> Divergin | define la geometria que tien ela coordenada (Geometria: punto ->x,y; Sistema de referencia) |
| ID | Categorical | identificador de la localidad para el origen en la red|

### Why


* **Principal:** Identificar las localidades donde mas se reciben servicios y donde mas se termina servicios

**Search -> Browse (terget unknown, Location Known) (Outliers)**

* **Secundaria:** Ubicar los lugares donde se recogen los pasajeros y de dejan

**Query -> Compare -> Sapatial Data**

* **Derive:** Modificar la información para lograr las tareas principales.

**Analyze -> Produce -> Derive (Attributes)**

### How
|Tarea| Encode | Manipulate | Facet | Reduce |
|---| ---|---|---|---|
|Tarea 1|Separate, Order, Align | Select || |
|Tarea 2|Separate | Navigate | Superimpose|

### Marcas y Canales

 #### Tarea 1
##### Marca
* **paht:** rectangulos que definen la localidad de donde salen los servicios o se dejan los servicios.
*  **lineas:** conexion entre los origenes y los destinos.
##### Canales 
* Color hue: en los rectangulos define las localidades de la ciudad.
* tamaño del rectangulo, define la cantidad de servicios presentes en el origen o destino
* Tamaño grosor de la linea: define la cantidad de servicios que se dieron en ese origne y destino
* Color Luminance: los link de los nodos cambian de color con la seleccion|

#### Tarea 2
##### Marca
Shape (point, area)
##### Canal 
* color en el mapa e identifica las zonas donde mas se tienen servicios de llegada o recogida (color Saturation).

### Screenshots
![preview](/img/usotaxis.gif)




