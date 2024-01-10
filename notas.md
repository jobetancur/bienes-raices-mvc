## Asociaciones con Sequelize

Dentro de Sequelize existen varios tipos de asociaciones o relaciones como se les conoce. Las relaciones pueden ser 1 a 1, 1 a muchos o muchos a muchos.

Sequalize hace estas asociaciones usando métodos:

**hasOne:** Es para crear relaciones 1:1, donde un registro puede tener hasta 1 registro relacionado en otra tabla.

Ejemplos: Una Propiedad tiene un Vendedor, un Usuario tiene un Perfil, un Producto tiene una Categoría.

`Sintaxis: Vendedor.hasOne(Propiedad)`

En este ejemplo; propiedad debería tener una llave foránea que haga referencia a un Vendedor, si no se especifica, Sequelize lo va a crear.

**belongsTo:** Al igual que hasOne es para relaciones 1:1, donde un registro puede tener hasta 1 registro relacionado en otra tabla, la única diferencia es la sintaxis.

`Sintaxis: Propiedad.belongsTo(Vendedor)`

En este ejemplo; Propiedad debería tener una llave foránea que haga referencia a un Vendedor, si no se especifica, Sequelize lo va a crear.

**hasMany:** Es para crear Relaciones 1:N, donde un registro puede tener múltiples coincidencias o relaciones en otra tabla.

Ejemplos: Un Vendedor tiene múltiples propiedades para vender. Un Usuario tiene múltiples Posts o un Producto tiene múltiples Reviews.

`Sintaxis: Vendedor.hasMany(Propiedad)`

En este ejemplo; Propiedad debería tener una llave foránea que haga referencia a un Vendedor.

`Propiedad.belongsTo(Vendedor)`
`Vendedor.hasMany(Propiedades)`

**belongsToMany:** Es utilizado para las relaciones N:N, en este tipo de relaciones se utiliza una tabla pivote, por lo tanto se realiza mediante 3 métodos.

`Sintaxis: Estudiante.belongsToMany(Clase, { through: HorarioClase })`

En este ejemplo; Múltiples Estudiantes tendrán Múltiples Clases, por lo tanto se crea una 3er Tabla que sirve como pivote con referencia por llave foránea tanto a Estudiantes como a Clases.