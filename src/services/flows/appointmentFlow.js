import stateService from '../state/stateService.js';
import appendToSheet from '../googleSheetsService.js';
import whatsappService from '../whatsappService.js';
import { appointmentSummaryButtons } from '../responses/botResponses.js';

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
                response = "Gracias, Ahora, ¿Cuál es el nombre de tu Mascota?";
                break;
            case 'petName':
                state.petName = message;
                state.step = 'petType';
                response = '¿Qué tipo de mascota es? (por ejemplo: perro, gato, huron, etc.)';
                break;
            case 'petType':
                state.petType = message;
                state.step = 'reason';
                response = '¿Cuál es el motivo de la Consulta?';
                break;
            case 'reason':
                state.reason = message;
                const summary = this.completeAppointment(to, state);
                await whatsappService.sendMessage(to, summary);
                await whatsappService.sendInteractiveButtons(to, "¿Qué deseas hacer ahora?", appointmentSummaryButtons);
                return;
            default:
                response = "Hubo un error en el flujo de agendamiento.";
                stateService.clearAppointmentState(to);
        }

        await whatsappService.sendMessage(to, response);
    }

    completeAppointment(to, appointment) {
        stateService.clearAppointmentState(to);

        const userData = [
            to,
            appointment.name,
            appointment.petName,
            appointment.petType,
            appointment.reason,
            new Date().toISOString()
        ];

        appendToSheet(userData);

        return `Gracias por agendar tu cita. \nResumen de tu cita:\n\nNombre: ${appointment.name}\nNombre de la mascota: ${appointment.petName}\nTipo de mascota: ${appointment.petType}\nMotivo: ${appointment.reason}`;
    }
}

export default new AppointmentFlow();
