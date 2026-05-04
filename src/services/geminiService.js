import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../config/env.js";

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

const geminiService = async (message) => {
    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            systemInstruction: 'Asistente veterinario de MedPet. Rol: Resolver dudas de mascotas con lenguaje sencillo. REGLAS DE FORMATO (ESTILO WHATSAPP): 1. Usa *asteriscos* para negritas (ej: *término*). 2. Para listas, usa guiones (-) o números seguidos de punto. 3. Prohibido usar encabezados (#), tablas o bloques de código. 4. Prohibido saludar, despedirse o usar cortesías. 5. Si hay síntomas graves (sangrado, asfixia, inconsciencia, convulsiones, veneno), responde únicamente: "*EMERGENCIA: Acuda de inmediato a MedPet o llame a nuestro servicio de urgencias.*". Estilo: Mensaje directo de chat, profesional y fácil de leer en móvil.', 
            generationConfig: {
                temperature: 0.1,
            } 
        });

        const result = await model.generateContent(message);
        return result.response.text();
    } catch (error) {
        console.error("Error en Gemini Service:", error);

        if (error.status === 503 || error.status === 429) {
            return "Muchas solicitudes actualmente, inténtalo más tarde.";
        }

        return "Lo siento, ha ocurrido un error al procesar tu consulta con la IA.";
    }
}

export default geminiService;
