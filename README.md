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
* Vegas
* ArcGIS V4.9 js
* enjoyint
* jquery
* BulmaJs
___
# **_Insight:_** :shipit:

## Actividad de los Taxis

* 

## Uso de los Taxis

*
___

# De donde vienen los Datos

Los datos provienen de [Secretaria Distrital de Movilidad](http://www.movilidadbogota.gov.co/web/) y como mejora a iniciativa de la entidad [version actual](https://public.tableau.com/profile/camilo.nemocon#!/vizhome/TaxisMes/Historia1) 


___
## Actividad de los Taxis
___

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
| node (node) |    Categorical (Todos los Departamentos de Colombia)   |   Division politica de Colombia |
| region (node) | Categorical | identificador para la localidad en la red |
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
Search -> Browse (terget unknown, Location Known) (Outliers)

* **Secundaria:** Ubicar los lugares donde se recogen los pasajeros y de dejan
Query -> Compare -> Sapatial Data
* **Derive:** Modificar la información para lograr las tareas principales.
Analyze -> Produce -> Derive (Attributes)

### How
| Encode | Manipulate | Facet | Reduce |
| ---|---|---|---|
|Separate, Order, Align | Select |Superimpose| |
|Separate | Navigate | Superimpose|

### Marcas

**paht:** rectangulos que definen la localidad de donde salen los servicios o se dejan los servicios
**lineas:** conexion entre los origenes y los destinos
puntos:

### Canales

* Color hue: en los rectangulos define las zonas de la ciudad, en el mapa el color define el origen y el destino
* Tamaño grosor de la linea: define la cantidad de servicios que se dieron en ese origne y destino
* tamaño del rectangulo, define la cantidad de servicios presentes en el origen o destino
* color en el mapa e identifica las zonas donde mas se tienen servicios de llegada o recogida color Saturation
* Color Luminance: los link de los nodos cambian de color con la seleccion
___
## Uso de los Taxis
___

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
| node (node) |    Categorical (Todos los Departamentos de Colombia)   |   Division politica de Colombia |
| region (node) | Categorical | identificador para la localidad en la red |
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
Search -> Browse (terget unknown, Location Known) (Outliers)

* **Secundaria:** Ubicar los lugares donde se recogen los pasajeros y de dejan
Query -> Compare -> Sapatial Data
* **Derive:** Modificar la información para lograr las tareas principales.
Analyze -> Produce -> Derive (Attributes)

### How
| Encode | Manipulate | Facet | Reduce |
| ---|---|---|---|
|Separate, Order, Align | Select |Superimpose| |
|Separate | Navigate | Superimpose|

### Marcas

**paht:** rectangulos que definen la localidad de donde salen los servicios o se dejan los servicios
**lineas:** conexion entre los origenes y los destinos
puntos:

### Canales

* Color hue: en los rectangulos define las zonas de la ciudad, en el mapa el color define el origen y el destino
* Tamaño grosor de la linea: define la cantidad de servicios que se dieron en ese origne y destino
* tamaño del rectangulo, define la cantidad de servicios presentes en el origen o destino
* color en el mapa e identifica las zonas donde mas se tienen servicios de llegada o recogida color Saturation
* Color Luminance: los link de los nodos cambian de color con la seleccion


