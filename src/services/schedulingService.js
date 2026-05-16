import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../config/env.js";

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY || "dummy-key");

/**
 * Retrieves a mocked list of veterinary professionals, including their specialties and schedules.
 * 
 * @returns {Array<{id: number, name: string, specialty: string, schedule: string}>} List of professionals.
 */
export const getMockProfessionals = () => {
    return [
        { id: 1, name: 'Dr. Smith', specialty: 'Revisión General y Vacunación', schedule: 'Lunes a Miércoles de 8:00 a 20:00' },
        { id: 2, name: 'Dr. Doe', specialty: 'Cirugía y Traumatología', schedule: 'Jueves y Viernes de 8:00 a 20:00' },
        { id: 3, name: 'Dra. Lee', specialty: 'Dermatología', schedule: 'Lunes y Martes de 8:00 a 16:00' },
        { id: 4, name: 'Dr. Gomez', specialty: 'Comportamiento y Nutrición', schedule: 'Miércoles y Jueves de 10:00 a 18:00' }
    ];
};

/**
 * Validates if a given date string falls within the clinic's operating hours (8:00 AM to 8:00 PM).
 * 
 * @param {string} dateString - The ISO date string to validate.
 * @returns {boolean} True if within working hours, false otherwise.
 */
export const isWithinWorkingHours = (dateString) => {
    const date = new Date(dateString);
    const hour = date.getHours();
    return hour >= 8 && hour < 20;
};

/**
 * Checks if a requested appointment time conflicts with any existing scheduled appointments.
 * 
 * @param {string} requestedDateString - The ISO date string of the requested appointment.
 * @param {Array<{date: string, reason: string, petType: string}>} existingAppointments - List of current appointments.
 * @returns {boolean} True if a conflict exists, false otherwise.
 */
export const hasConflict = (requestedDateString, existingAppointments) => {
    const requestedTime = new Date(requestedDateString).getTime();
    return existingAppointments.some(appt => {
        if (!appt.date) return false;
        const apptTime = new Date(appt.date).getTime();
        return apptTime === requestedTime;
    });
};

/**
 * Performs a complete validation of a requested appointment date against business rules and conflicts.
 * 
 * @param {string} requestedDateString - The ISO date string of the requested appointment.
 * @param {Array<{date: string, reason: string, petType: string}>} existingAppointments - List of current appointments.
 * @returns {{valid: boolean, reason?: string, message?: string}} Validation result object.
 */
export const validateAppointment = (requestedDateString, existingAppointments) => {
    if (!isWithinWorkingHours(requestedDateString)) {
        return { valid: false, reason: "fuera_de_servicio", message: "El horario está fuera de servicio. Nuestro horario de atención es de 8:00 AM a 8:00 PM." };
    }
    if (hasConflict(requestedDateString, existingAppointments)) {
        return { valid: false, reason: "incompatibilidad", message: "Lo sentimos, ya existe una cita programada para esa fecha y hora. Por favor, elige otro horario." };
    }
    return { valid: true };
};

/**
 * Uses Google's Gemini AI to analyze a patient's reason for visiting, identify the optimal specialist,
 * and propose two available appointment slots considering the user's preferred date and existing schedules.
 * 
 * @param {string} reason - The reason for the veterinary consultation.
 * @param {string} wishDate - The user's preferred date and time for the appointment in natural language.
 * @param {Array<{date: string, reason: string, petType: string}>} existingAppointments - Current booked slots.
 * @returns {Promise<string>} AI-generated response presenting two appointment proposals.
 */
export const proposeAppointmentsWithGemini = async (reason, wishDate, existingAppointments) => {
    try {
        const professionals = getMockProfessionals();
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: 'Eres un asistente de agendamiento para la veterinaria MedPet. Tu tarea principal es analizar el motivo de la cita y seleccionar al especialista más óptimo para el caso entre los profesionales disponibles. El usuario ha sugerido una fecha y hora preferida (wishDate). Dadas las citas existentes y el horario de dicho especialista, intenta darle prioridad a esa fecha sugerida si está disponible y concuerda con el especialista. Si está disponible, ofrécela como primera opción y da una segunda alternativa. Si la fecha sugerida NO está disponible o choca con el horario del especialista o con otra cita, ofrécele cordialmente 2 opciones alternativas y motívalo a que las tome. REGLAS: 1. Selecciona el especialista correcto según el motivo. 2. No propongas fechas/horas agendadas. 3. La hora debe ser entre las 8:00 y las 19:59. 4. Menciona el nombre del especialista seleccionado y por qué es el más óptimo.',
        });

        const hoy = new Date().toLocaleString();

        const prompt = `
            Fecha y hora actual: ${hoy}
            Motivo de la cita: ${reason}
            Fecha y hora preferida por el usuario (wishDate): ${wishDate}
            Profesionales disponibles y sus horarios: ${JSON.stringify(professionals)}
            Citas ya agendadas (no proponer estos horarios): ${JSON.stringify(existingAppointments)}
            
            Analiza la disponibilidad y responde amigablemente brindando 2 opciones de fecha y hora.
        `;

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Error proponiendo citas con Gemini:", error);
        return "Tuvimos un problema al buscar horarios automáticos. ¿Para qué fecha y hora te gustaría agendar tu cita? (Ejemplo: Mañana a las 10:00 AM)";
    }
};

/**
 * Uses Google's Gemini AI strictly as a parser to convert natural language date expressions
 * into standard ISO 8601 date strings.
 * 
 * @param {string} userInput - The natural language date input provided by the user.
 * @returns {Promise<string|null>} Parsed ISO 8601 date string, or null if parsing fails.
 */
export const parseDateWithGemini = async (userInput) => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: 'Eres un conversor de fechas experto. Tu única tarea es convertir la intención de fecha y hora del usuario a un formato ISO 8601 estricto (YYYY-MM-DDTHH:mm:ss). No uses zonas horarias (Z al final), solo la fecha local. Si no puedes deducir una fecha y hora razonable, responde únicamente con la palabra "INVALID". No digas ninguna otra palabra, solo la fecha ISO o INVALID.',
            generationConfig: {
                temperature: 0.1,
            }
        });

        const hoy = new Date().toLocaleString();
        const prompt = `Fecha y hora actual del sistema: ${hoy}\nTexto proporcionado por el usuario: "${userInput}"\n\nDevuelve únicamente la fecha en formato ISO.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        
        if (text === "INVALID") return null;
        
        const parsedDate = new Date(text);
        if (isNaN(parsedDate.getTime())) return null;
        
        return parsedDate.toISOString();
    } catch (error) {
        console.error("Error parseando fecha con Gemini:", error);
        return null;
    }
};
