# 🎮 Sala de Juegos — TP #1

**Alumno:** Alejandro Voutsina Labrin

**Materia:** Programación IV — 4º Cuatrimestre — UTN Avellaneda

**🔗 Deploy:** [https://sala-de-juegos-beta.vercel.app/home](https://sala-de-juegos-beta.vercel.app/home)

---

## 🛠️ Tecnologías utilizadas

| Tecnología                                    | Uso                                                 |
| --------------------------------------------- | --------------------------------------------------- |
| [Angular](https://angular.io/)                | Framework frontend (standalone components)          |
| [TypeScript](https://www.typescriptlang.org/) | Lenguaje principal                                  |
| [Supabase](https://supabase.com/)             | Backend: autenticación, base de datos y tiempo real |
| [Bootstrap](https://getbootstrap.com/)        | Estilos y componentes UI                            |
| [Vercel](https://vercel.com/)                 | Hosting y deploy continuo                           |

---

## 🚀 Sprints

### Sprint #1 — Estructura base del proyecto

Se creó el proyecto Angular con su deploy inicial en Vercel. Se implementaron los componentes base: **Login**, **Registro**, **Home/Bienvenida** y **Quién Soy**. La página _Quién Soy_ consume la API pública de GitHub para mostrar datos del alumno (nombre, avatar y bio). Se configuró la navegación entre componentes y se agregó un favicon personalizado. En esta etapa la navegación es libre, sin restricciones de acceso.

---

### Sprint #2 — Autenticación y formularios

Se integró **Supabase** para la autenticación de usuarios. El componente **Login** valida credenciales contra Supabase, muestra errores descriptivos en caso de fallo y redirige automáticamente al Home si el login es exitoso. Incluye tres botones de acceso rápido con usuarios de prueba preregistrados. El componente **Registro** cuenta con un formulario reactivo (`ReactiveFormsModule`) con validaciones de email, nombre, apellido, edad y contraseña; al registrarse correctamente, inicia sesión y redirige al Home. El **Home** muestra distintos botones según el estado de sesión del usuario (logueado / no logueado).

---

### Sprint #3 — Juegos: Ahorcado y Mayor o Menor + Chat

Se implementaron los juegos **Ahorcado** (con botones de letras del abecedario, sin teclado) y **Mayor o Menor** (con baraja de naipes). Ambos guardan los resultados en Supabase al finalizar la partida (usuario, tiempo, aciertos, etc.). Se desarrolló la **Sala de Chat** global en tiempo real: los usuarios logueados pueden enviar mensajes que se guardan en la base de datos y se distribuyen automáticamente a todos los clientes mediante suscripción en tiempo real de Supabase.

---

### Sprint #4 — Juegos: Preguntados y Juego propio + Resultados

Se implementó el juego **Preguntados**, que obtiene preguntas desde una API externa y presenta las opciones como botones. Se desarrolló el **juego propio** (descripto en la página _Quién Soy_), con su lógica, condiciones de victoria/derrota y guardado de resultados en Supabase. Se creó la página de **Resultados** con cuatro tablas, una por juego, ordenadas de mejor a peor desempeño por jugador.

---

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── pages/
│   │   ├── login/
│   │   ├── sign-up/
│   │   ├── home/
│   │   ├── quien-soy/
│   │   ├── chat/
│   │   ├── resultados/
│   │   └── games/
│   │       ├── ahorcado/
│   │       ├── mayor-o-menor/
│   │       ├── preguntados/
│   │       └── juego-propio/
│   └── services/
│       └── supabase.service.ts
```
