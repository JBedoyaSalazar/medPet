import stateService from '../state/stateService.js';
import appendToSheet, { getExistingAppointments } from '../googleSheetsService.js';
import whatsappService from '../whatsappService.js';
import { appointmentSummaryButtons } from '../responses/botResponses.js';
import { proposeAppointmentsWithGemini, validateAppointment, parseDateWithGemini } from '../schedulingService.js';

/**
 * Handles the step-by-step dialog for booking a veterinary appointment.
 */
class AppointmentFlow {
    /**
     * Processes text input during the appointment booking flow.
     * @param {string} to - User's WhatsApp ID.
     * @param {string} message - User's text input.
     */
    async handleFlow(to, message) {
        const state = stateService.getAppointmentState(to);
        let response;

        switch (state.step) {
            case 'name':
                state.name = message;
                state.step = 'petName';
                response = "Gracias. Ahora, ¿cuál es el nombre de tu mascota?";
                break;
            case 'petName':
                state.petName = message;
                state.step = 'petType';
                response = '¿Qué tipo de mascota es? (por ejemplo: perro, gato, hurón, etc.)';
                break;
            case 'petType':
                state.petType = message;
                state.step = 'reason';
                response = '¿Cuál es el motivo de la consulta?';
                break;
            case 'reason':
                state.reason = message;
                state.step = 'askWishDate';
                
                response = "¿Qué día y hora prefieres tener la cita? Trataremos de priorizar tu solicitud.";
                break;
            case 'askWishDate':
                state.wishDate = message;
                state.step = 'proposeDate';
                
                response = "Buscando disponibilidad con nuestros profesionales... ⏳";
                await whatsappService.sendMessage(to, response);
                
                const existingAppointmentsForAI = await getExistingAppointments();
                const aiProposal = await proposeAppointmentsWithGemini(state.reason, state.wishDate, existingAppointmentsForAI);
                
                response = aiProposal + "\n\nPor favor, responde confirmando la fecha y hora final que eliges (ej: 'El martes a las 14:00').";
                break;
            case 'proposeDate':
                // Utilizamos Gemini para interpretar el lenguaje natural (ej: "el martes a las 3")
                response = "Procesando tu fecha... ⏳";
                await whatsappService.sendMessage(to, response);

                const requestedDateString = await parseDateWithGemini(message);
                
                if (!requestedDateString) {
                    response = "No logré entender bien la fecha u hora que deseas. ¿Podrías indicarla más claro? (Ej: 'Mañana a las 10:00 AM' o '20 de mayo a las 14:00')";
                    break;
                }
                const existingAppointments = await getExistingAppointments();
                
                const validation = validateAppointment(requestedDateString, existingAppointments);
                
                if (!validation.valid) {
                    response = validation.message + "\n\nPor favor ingresa otra fecha y hora:";
                    break;
                }
                
                state.appointmentDate = requestedDateString; // This is the final parsed ISO date
                
                const summary = await this.completeAppointment(to, state);
                await whatsappService.sendMessage(to, summary);
                await whatsappService.sendInteractiveButtons(to, "¿Qué deseas hacer ahora?", appointmentSummaryButtons);
                return;
            default:
                response = "Hubo un error en el flujo de agendamiento.";
                stateService.clearAppointmentState(to);
        }

        await whatsappService.sendMessage(to, response);
    }

    async completeAppointment(to, appointment) {
        stateService.clearAppointmentState(to);

        const formattedDate = new Date(appointment.appointmentDate).toLocaleString();

        const userData = [
            to,
            appointment.name,
            appointment.petName,
            appointment.petType,
            appointment.reason,
            new Date().toISOString(), // Columna F: Fecha de la solicitud
            appointment.wishDate,     // Columna G: wishDate (lo que el usuario pidió inicialmente)
            appointment.appointmentDate // Columna H: appointmentDate (la fecha final pactada e interpretada por la IA)
        ];

        await appendToSheet(userData);

        return `Gracias por agendar tu cita.\n\nResumen de tu cita:\n\nNombre: ${appointment.name}\nMascota: ${appointment.petName} (${appointment.petType})\nMotivo: ${appointment.reason}\nFecha y hora: ${formattedDate}`;
    }
}

export default new AppointmentFlow();
