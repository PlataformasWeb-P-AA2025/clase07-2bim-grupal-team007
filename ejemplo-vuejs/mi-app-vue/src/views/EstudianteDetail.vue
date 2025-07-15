<!-- src/views/EstudianteDetail.vue -->
<template>
  <div class="estudiante-detail-container">
    <p v-if="loading">Cargando detalles...</p>
    <p v-if="error" class="error-message">{{ error }}</p>

    <div v-if="estudiante">
      <div class="header">
        <h3>{{ estudiante.nombre }} {{ estudiante.apellido }}</h3>
        <div class="actions">
          <router-link
            :to="{
              name: 'EstudianteEdit',
              params: { estudianteUrl: estudiante.url },
            }"
            class="action-button edit-button"
            >Editar Estudiante</router-link
          >
        </div>
      </div>
      <p><strong>Cédula:</strong> {{ estudiante.cedula }}</p>
      <p><strong>Correo:</strong> {{ estudiante.correo }}</p>

      <hr />

      <h4>Números Telefónicos</h4>
      <ul v-if="numerosTelefonicos.length">
        <li v-for="numero in numerosTelefonicos" :key="numero.url">
          <span>{{ numero.telefono }} ({{ numero.tipo }})</span>
          <div class="phone-actions">
            <button @click="startEditPhone(numero)" class="btn-sm btn-edit">
              Editar
            </button>
            <button @click="deletePhone(numero)" class="btn-sm btn-delete">
              Eliminar
            </button>
          </div>
        </li>
      </ul>
      <p v-else>No tiene números telefónicos registrados.</p>

      <div class="phone-form">
        <h5>{{ editingPhoneUrl ? "Editar Teléfono" : "Agregar Teléfono" }}</h5>
        <form @submit.prevent="submitPhoneForm">
          <input
            v-model="phoneFormData.telefono"
            type="text"
            placeholder="Número"
            required
          />
          <input
            v-model="phoneFormData.tipo"
            type="text"
            placeholder="Tipo (Móvil, Casa...)"
            required
          />
          <button type="submit">
            {{ editingPhoneUrl ? "Actualizar" : "Agregar" }}
          </button>
          <button v-if="editingPhoneUrl" type="button" @click="cancelEdit">
            Cancelar
          </button>
        </form>
        <p v-if="phoneError" class="error-message">{{ phoneError }}</p>
      </div>

      <router-link :to="{ name: 'EstudiantesList' }" class="back-button">
        Volver al Listado
      </router-link>
    </div>
  </div>
</template>

<script>
import api from "@/api/axios";

export default {
  name: "EstudianteDetail",
  props: ["estudianteUrl"],
  data() {
    return {
      estudiante: null,
      numerosTelefonicos: [],
      loading: true,
      error: null,
      phoneError: null,
      editingPhoneUrl: null,
      phoneFormData: {
        telefono: "",
        tipo: "",
      },
    };
  },
  async created() {
    const decodedUrl = decodeURIComponent(this.estudianteUrl);
    await this.fetchEstudianteDetail(decodedUrl);
    if (this.estudiante) {
      await this.fetchNumerosTelefonicos(this.estudiante.url);
    }
  },
  methods: {
    async fetchEstudianteDetail(url) {
      try {
        this.loading = true;
        const response = await api.get(url);
        this.estudiante = response.data;
      } catch (err) {
        this.error = "No se pudo cargar el detalle del estudiante.";
      } finally {
        this.loading = false;
      }
    },
    async fetchNumerosTelefonicos(estudianteApiUrl) {
      try {
        const response = await api.get("numerosts/");
        this.numerosTelefonicos = response.data.results.filter(
          (numero) => numero.estudiante === estudianteApiUrl
        );
      } catch (err) {
        this.error = "Error al cargar los números telefónicos.";
      }
    },
    async submitPhoneForm() {
      if (this.editingPhoneUrl) {
        await this.updatePhone();
      } else {
        await this.createPhone();
      }
    },
    async createPhone() {
      this.phoneError = null;
      try {
        const payload = {
          ...this.phoneFormData,
          estudiante: this.estudiante.url,
        };
        await api.post("numerosts/", payload);
        this.resetPhoneForm();
        await this.fetchNumerosTelefonicos(this.estudiante.url);
      } catch (err) {
        this.phoneError = "Error al agregar el teléfono.";
      }
    },
    startEditPhone(numero) {
      this.editingPhoneUrl = numero.url;
      this.phoneFormData = { ...numero };
    },
    cancelEdit() {
      this.resetPhoneForm();
    },
    async updatePhone() {
      this.phoneError = null;
      try {
        const payload = {
          telefono: this.phoneFormData.telefono,
          tipo: this.phoneFormData.tipo,
          estudiante: this.estudiante.url,
        };
        await api.put(this.editingPhoneUrl, payload);
        this.resetPhoneForm();
        await this.fetchNumerosTelefonicos(this.estudiante.url);
      } catch (err) {
        this.phoneError = "Error al actualizar el teléfono.";
      }
    },
    async deletePhone(numero) {
      if (
        window.confirm(
          `¿Seguro que quieres eliminar el teléfono ${numero.telefono}?`
        )
      ) {
        try {
          await api.delete(numero.url);
          await this.fetchNumerosTelefonicos(this.estudiante.url);
        } catch (err) {
          this.phoneError = "Error al eliminar el teléfono.";
        }
      }
    },
    resetPhoneForm() {
      this.editingPhoneUrl = null;
      this.phoneFormData.telefono = "";
      this.phoneFormData.tipo = "";
      this.phoneError = null;
    },
  },
};
</script>

<style scoped>
.estudiante-detail-container {
  max-width: 700px;
  margin: 50px auto;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 15px;
  margin-bottom: 15px;
}
.actions {
  display: flex;
  gap: 10px;
}
.action-button {
  padding: 8px 15px;
  border-radius: 5px;
  text-decoration: none;
  color: white;
  border: none;
  cursor: pointer;
  background-color: #007bff;
}
.action-button:hover {
  background-color: #0056b3;
}
hr {
  border: 0;
  border-top: 1px solid #eee;
  margin: 20px 0;
}
h4 {
  margin-top: 20px;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #f0f0f0;
}
.phone-actions {
  display: flex;
  gap: 8px;
}
.btn-sm {
  padding: 4px 8px;
  font-size: 0.8em;
  border-radius: 3px;
  border: none;
  color: white;
  cursor: pointer;
}
.btn-edit {
  background-color: #ffc107;
  color: #333;
}
.btn-delete {
  background-color: #dc3545;
}
.phone-form {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 5px;
}
.phone-form form {
  display: flex;
  gap: 10px;
  align-items: center;
}
.phone-form input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 3px;
}
.phone-form button {
  padding: 8px 12px;
  border: none;
  border-radius: 3px;
  color: white;
  background-color: #28a745;
  cursor: pointer;
}
.phone-form button[type="button"] {
  background-color: #6c757d;
}
.back-button {
  display: block;
  width: fit-content;
  margin: 30px auto 0;
  padding: 10px 20px;
  background-color: #17a2b8;
  color: white;
  border-radius: 5px;
  text-decoration: none;
}
.error-message {
  color: red;
  text-align: center;
  margin-top: 10px;
}
</style>
