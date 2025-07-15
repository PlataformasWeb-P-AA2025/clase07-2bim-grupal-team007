// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Login from "../views/Login.vue";
import EstudiantesList from "../views/EstudiantesList.vue";
import EstudianteDetail from "../views/EstudianteDetail.vue";
import EstudianteForm from "../views/EstudianteForm.vue"; // Usamos el formulario genérico

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/estudiantes",
    name: "EstudiantesList",
    component: EstudiantesList,
    meta: { requiresAuth: true },
  },
  // Ruta para CREAR un nuevo estudiante
  {
    path: "/estudiantes/nuevo",
    name: "EstudianteCreate",
    component: EstudianteForm, // Reutilizamos el formulario
    meta: { requiresAuth: true },
  },
  // Ruta para VER los detalles de un estudiante
  {
    path: "/estudiantes/detail/:estudianteUrl*",
    name: "EstudianteDetail",
    component: EstudianteDetail,
    props: true,
    meta: { requiresAuth: true },
  },
  // Ruta para EDITAR un estudiante existente
  {
    path: "/estudiantes/editar/:estudianteUrl*",
    name: "EstudianteEdit",
    component: EstudianteForm, // Reutilizamos el formulario
    props: true,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !localStorage.getItem("authToken")) {
    next("/login");
  } else {
    next();
  }
});

export default router;
