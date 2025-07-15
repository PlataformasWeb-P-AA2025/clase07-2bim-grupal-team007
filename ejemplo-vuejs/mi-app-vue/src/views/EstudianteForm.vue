<!-- src/views/EstudianteForm.vue -->
<template>
  <div class="form-container">
    <h2>{{ isEditing ? "Editar Estudiante" : "Agregar Nuevo Estudiante" }}</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" v-model="estudiante.nombre" required />
      </div>
      <div class="form-group">
        <label for="apellido">Apellido:</label>
        <input
          type="text"
          id="apellido"
          v-model="estudiante.apellido"
          required
        />
      </div>
      <div class="form-group">
        <label for="cedula">Cédula:</label>
        <input type="text" id="cedula" v-model="estudiante.cedula" required />
      </div>
      <div class="form-group">
        <label for="correo">Correo Electrónico:</label>
        <input type="email" id="correo" v-model="estudiante.correo" required />
      </div>
      <div class="button-group">
        <button type="submit">{{ isEditing ? "Actualizar" : "Crear" }}</button>
        <button type="button" @click="cancel">Cancelar</button>
      </div>
      <p v-if="error" class="error-message">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import api from "@/api/axios";

export default {
  name: "EstudianteForm",
  props: ["estudianteUrl"], // Recibido del router para modo edición
  data() {
    return {
      estudiante: {
        nombre: "",
        apellido: "",
        cedula: "",
        correo: "",
      },
      isEditing: false,
      error: null,
    };
  },
  async created() {
    if (this.estudianteUrl) {
      this.isEditing = true;
      await this.fetchEstudianteData();
    }
  },
  methods: {
    async fetchEstudianteData() {
      try {
        const decodedUrl = decodeURIComponent(this.estudianteUrl);
        const response = await api.get(decodedUrl);
        this.estudiante = response.data;
      } catch (err) {
        this.error = "No se pudieron cargar los datos para editar.";
      }
    },
    async handleSubmit() {
      this.error = null;
      try {
        let response;
        if (this.isEditing) {
          const decodedUrl = decodeURIComponent(this.estudianteUrl);
          response = await api.put(decodedUrl, this.estudiante);
        } else {
          response = await api.post("estudiantes/", this.estudiante);
        }
        // Redirigir a la página de detalle del estudiante creado/editado
        this.$router.push({
          name: "EstudianteDetail",
          params: { estudianteUrl: response.data.url },
        });
      } catch (err) {
        const errorData = err.response?.data;
        if (errorData) {
          this.error = Object.values(errorData).join(" ");
        } else {
          this.error = "Ocurrió un error inesperado.";
        }
      }
    },
    cancel() {
      if (this.isEditing) {
        this.$router.push({
          name: "EstudianteDetail",
          params: { estudianteUrl: this.estudiante.url },
        });
      } else {
        this.$router.push({ name: "EstudiantesList" });
      }
    },
  },
};
</script>

<style scoped>
.form-container {
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  font-weight: bold;
}
input {
  width: calc(100% - 22px);
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
}
button[type="submit"] {
  background-color: #28a745;
}
button[type="button"] {
  background-color: #6c757d;
}
.error-message {
  color: red;
  margin-top: 15px;
}
</style>
