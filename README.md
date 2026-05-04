# MedPet WhatsApp Chatbot 🐾

Este es un Chatbot profesional para WhatsApp diseñado para la gestión de una veterinaria llamada **MedPet**. El sistema permite agendar citas, realizar consultas médicas asistidas por Inteligencia Artificial (Gemini) y proporcionar información de contacto/ubicación de forma automatizada.

## 🚀 Arquitectura del Proyecto

El proyecto sigue una arquitectura modular y limpia (Clean Architecture) para facilitar el mantenimiento y la escalabilidad.

### Estructura de Directorios

- `src/app.js`: Punto de entrada de la aplicación Express.
- `src/config/`: Configuraciones globales y variables de entorno.
- `src/controllers/`: Controladores para manejar las peticiones HTTP (Webhooks).
- `src/routes/`: Definición de rutas del servidor.
- `src/services/`: Lógica de negocio principal.
  - `flows/`: Flujos conversacionales específicos (Citas, Asistente IA).
  - `responses/`: Respuestas estáticas y plantillas de mensajes.
  - `state/`: Gestión del estado/memoria temporal de los usuarios.
  - `httpRequest/`: Capa de comunicación externa (WhatsApp API).

## 🛠️ Funcionalidades Principales

1. **Gestión de Citas**: Flujo paso a paso para recolectar datos del usuario y la mascota, guardándolos automáticamente en una hoja de **Google Sheets**.
2. **Asistente IA (Gemini)**: Integración con Google Gemini (modelo 2.0-flash) para resolver dudas veterinarias con un lenguaje sencillo y técnico.
3. **Información de Sucursal**: Envío automatizado de mensajes de contacto y ubicación geográfica.
4. **Resiliencia**: Manejo inteligente de errores de la API de IA con mensajes amigables y menús de contingencia.

## ⚙️ Configuración del Entorno (.env)

El proyecto utiliza las siguientes variables de entorno:

| Variable | Descripción |
|----------|-------------|
| `API_TOKEN` | Token de acceso permanente de la API de WhatsApp (Meta). |
| `BUSINESS_PHONE` | ID del número de teléfono configurado en Meta. |
| `WEBHOOK_VERIFY_TOKEN` | Token para validar el webhook con Meta. |
| `GEMINI_API_KEY` | Llave de API para el servicio de Google Gemini. |
| `SPREADSHEET_ID` | ID de la hoja de Google Sheets donde se guardan las citas. |
| `GOOGLE_CLIENT_EMAIL` | Email del Service Account de Google Cloud. |
| `GOOGLE_PRIVATE_KEY` | Llave privada del Service Account (formato string). |

## 📦 Instalación y Ejecución

1. Clonar el repositorio.
2. Instalar dependencias: `npm install`
3. Configurar el archivo `.env`.
4. Iniciar en modo desarrollo: `npm run start` (usa nodemon).
5. Exponer el puerto local (ej: ngrok): `npm run link`

---
Desarrollado con ❤️ para MedPet.
