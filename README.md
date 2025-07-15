# clase07-2bim

### Proyecto Django

* Instalarla librería django-cors-headers
* Crear un super usuario


### Proyecto VueJs

* Ingresar a la carpeta mi-app-vue
* Ejecutar npm install (esperar algunos minutos)
* Ejecutar npm run serve

### Probar funcionamiento

* Ingresar a un navegador y revisar si el funcionamiento de la aplicación den VueJs

### Tareas - reto

* Implementación de Funcionalidades de Edición y Eliminación en Vue.js
  * Para Estudiantes
  * Para Teléfonos

### Recomendación

 * Tomar un tiempo produnte para analizar el código ya generado en VueJs
 

# prompts:

### 1:
Tengo un proyecto Vue.js que se conecta a una API de Django, quiero implementar las funcionalidades de edición y eliminación para dos: 

Estudiantes: En la vista de lista, pon un botón para eliminar cada estudiante, en el detalle del estudiante, pon un botón que redirija a un nuevo formulario para editar la información.

Teléfonos: en la vista de detalle del estudiante, mostrar una lista de sus números de teléfono, para cada número poner botones para poder editarlo y eliminarlo en esa misma vista, luego crea un formulario para poder registrar nuevos números de teléfono.

como contexto de paso toda la estructura de mi proyecto, el código del backend models.py, serializers.py, views.py, urls.py y el frontend completo (componentes, vistas, router, configuración de API)

### 2:
Muestra una serie de errores con el mensaje 

Estos son los errores que me muestra:
[eslint] ... error prettier/prettier

del cual nos indico que poniendo esto se arregla
```npm run lint -- --fix```

### 3:
ahora necesito implementar la funcionalidad para agregar un nuevo estudiante