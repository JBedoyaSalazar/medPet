# MedPet WhatsApp Chatbot 🐾 🤖

Un Chatbot profesional, conversacional e inteligente para WhatsApp, diseñado para la gestión clínica integral de la veterinaria **MedPet**. El sistema combina respuestas conversacionales con flujos deterministas, integración a hojas de cálculo en tiempo real y el poder analítico de **Google Gemini 2.5** para ofrecer una experiencia al usuario fluida y sin fricciones.

---

## 🚀 Arquitectura del Proyecto

El proyecto está diseñado bajo los principios de Clean Architecture y Modularidad, garantizando una separación clara entre la interfaz conversacional, la lógica de negocio, las persistencias de datos y las integraciones de IA.

### Estructura de Directorios

- `src/app.js`: Punto de entrada de la aplicación Express y Webhook principal de Meta.
- `src/config/`: Módulo de variables de entorno y configuraciones maestras.
- `src/controllers/`: Controladores para manejar y procesar las peticiones HTTP del Webhook.
- `src/routes/`: Definición y enrutamiento del servidor.
- `src/services/`: Capa de dominio y lógica de negocio.
  - `flows/`: Rutadores conversacionales de contexto (Flujo de Citas, Flujo Asistente IA).
  - `responses/`: Centralización de plantillas de mensajes y botones interactivos.
  - `state/`: Gestor de memoria a corto plazo para manejar el estado de las conversaciones por usuario (Máquinas de Estado).
  - `httpRequest/`: Capa de infraestructura para la comunicación HTTP externa (WhatsApp Cloud API).
- `testFlow.js`: Script utilitario de pruebas manuales y simulación de flujos de IA.

---

## 🛠️ Funcionalidades Principales y Capas de Inteligencia

### 1. Sistema de Agendamiento Autónomo (Auto-Scheduling)
A diferencia de un bot tradicional basado en reglas fijas, MedPet cuenta con un módulo de agendamiento conversacional gestionado por IA:
- **Asignación Óptima:** Analiza semánticamente el "Motivo" de la visita y selecciona de manera inteligente al médico especialista más adecuado (General, Cirugía, Dermatología, Comportamiento).
- **Parséo de Lenguaje Natural:** El usuario puede sugerir horarios de forma natural (ej: *"el martes por la tarde"*). La IA convierte este texto libre en una estructura matemática ISO 8601 de manera transparente (`parseDateWithGemini`).
- **Negociación de Agendas:** Consulta los espacios tomados actualmente y propone alternativas amigables al usuario si su fecha deseada genera conflictos o está fuera del horario laboral.

### 2. Integración Bidireccional con Google Sheets
El sistema no solo escribe datos, sino que utiliza tu base de datos de Sheets como contexto vivo:
- **Lectura en tiempo real:** Antes de confirmar una cita, el bot extrae todo el calendario de `'Hoja 1'!A:H` para blindar el sistema contra citas dobles.
- **Data Estructurada:** Registra 8 columnas completas garantizando el tracking operativo:
  - `A` WhatsApp ID | `B` Nombre | `C` Mascota | `D` Especie | `E` Motivo
  - `F` Marca de tiempo exacta de la solicitud
  - `G` *WishDate*: La fecha que el cliente pidió inicialmente
  - `H` *AppointmentDate*: La fecha oficial pactada en formato estándar.

### 3. Asistente Médico Veterinario (Triage IA)
- **Consultas 24/7:** Actúa como primer anillo de respuesta, usando lenguaje empático para resolver dudas comunes.
- **Detección de Emergencias:** La IA está instruida para detectar palabras clave de riesgo (sangrado, asfixia, convulsión) e interrumpir la conversación para enviar la tarjeta de emergencia y ubicación de la clínica.

### 4. Cobertura de Pruebas (Unit Testing)
- Incorpora un entorno de pruebas robusto usando **Jest** (`schedulingService.test.js`).
- Testea los bordes horarios (8:00 AM a 8:00 PM) y simula concurrencias de agenda (incompatibilidades) asegurando que ninguna regla de negocio pueda romperse en producción.

---

## ⚙️ Configuración del Entorno (.env)

Asegúrate de contar con un archivo `.env` configurado con las siguientes credenciales:

| Variable | Descripción Estratégica |
|----------|-------------|
| `API_TOKEN` | Token de acceso de la API de WhatsApp (Meta Developer). |
| `BUSINESS_PHONE` | ID numérico del remitente de WhatsApp registrado en Meta. |
| `WEBHOOK_VERIFY_TOKEN` | Token de seguridad para el handshake con Meta. |
| `GEMINI_API_KEY` | Llave maestra para el razonamiento de Google Gemini. |
| `SPREADSHEET_ID` | Hash de la hoja de Google Sheets (extraído de la URL). |
| `GOOGLE_CLIENT_EMAIL` | Email de la cuenta de servicio de Google Cloud Console. |
| `GOOGLE_PRIVATE_KEY` | Llave privada RSA de la cuenta de servicio. |

---

## 📦 Despliegue y Ejecución

### Requisitos Previos
- Node.js (v18 o superior).
- Cuenta en Meta for Developers.
- Cuenta en Google Cloud Platform (Sheets API & Vertex AI/Gemini habilitados).

### Comandos Principales
1. **Instalar dependencias:**
   ```bash
   npm install
   ```
2. **Ejecutar Pruebas Unitarias:**
   ```bash
   npm test
   ```
3. **Levantar Entorno de Desarrollo Local:**
   ```bash
   npm run dev
   ```
4. **Exponer Webhook (Ngrok):**
   ```bash
   npm run link
   ```

---
*Desarrollado con altos estándares de calidad de software y Clean Code.* 🚀🐾
