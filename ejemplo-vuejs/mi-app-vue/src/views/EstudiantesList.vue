<!-- src/views/EstudiantesList.vue -->
<template>
  <div class="estudiantes-list-container">
    <h2>Listado de Estudiantes</h2>
    <p v-if="loading">Cargando estudiantes...</p>
    <p v-if="error" class="error-message">{{ error }}</p>
    <ul v-else-if="estudiantes.length">
      <li
        v-for="estudiante in estudiantes"
        :key="estudiante.url"
        class="estudiante-item"
      >
        <div class="item-content">
          <router-link
            :to="{
              name: 'EstudianteDetail',
              params: { estudianteUrl: estudiante.url },
            }"
          >
            {{ estudiante.nombre }} {{ estudiante.apellido }} (Cédula:
            {{ estudiante.cedula }})
          </router-link>

          <button @click="deleteEstudiante(estudiante)" class="delete-button">
            Eliminar
          </button>
        </div>
      </li>
    </ul>
    <p v-else>No hay estudiantes registrados.</p>
    <!-- Este botón debería llevar a un formulario de CREACIÓN -->
    <router-link :to="{ name: 'EstudianteCreate' }" class="add-button"
      >Agregar Nuevo Estudiante</router-link
    >
  </div>
</template>

<script>
import api from "@/api/axios";

export default {
  name: "EstudiantesList",
  data() {
    return {
      estudiantes: [],
      loading: true,
      error: null,
    };
  },
  async created() {
    await this.fetchEstudiantes();
  },
  methods: {
    async fetchEstudiantes() {
      try {
        this.loading = true;
        this.error = null;
        const response = await api.get("estudiantes/");
        this.estudiantes = response.data.results || response.data;
      } catch (err) {
        console.error("Error al cargar estudiantes:", err.response || err);
        this.error = "No se pudieron cargar los estudiantes.";
      } finally {
        this.loading = false;
      }
    },
    async deleteEstudiante(estudiante) {
      if (
        window.confirm(
          `¿Estás seguro de que deseas eliminar a ${estudiante.nombre} ${estudiante.apellido}?`
        )
      ) {
        try {
          await api.delete(estudiante.url);
          // Actualizar la lista para reflejar el cambio
          this.estudiantes = this.estudiantes.filter(
            (e) => e.url !== estudiante.url
          );
        } catch (err) {
          console.error("Error al eliminar estudiante:", err.response || err);
          this.error = "No se pudo eliminar el estudiante.";
        }
      }
    },
  },
};
</script>

<style scoped>
.estudiantes-list-container {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}
h2 {
  text-align: center;
  margin-bottom: 20px;
}
ul {
  list-style: none;
  padding: 0;
}
.estudiante-item {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}
.item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.estudiante-item a {
  text-decoration: none;
  color: #007bff;
  font-weight: bold;
}
.estudiante-item a:hover {
  text-decoration: underline;
}
.delete-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}
.delete-button:hover {
  background-color: #c82333;
}
.add-button {
  display: block;
  width: fit-content;
  margin: 20px auto 0;
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border-radius: 5px;
  text-decoration: none;
}
.error-message {
  color: red;
  text-align: center;
}
</style>
