import stateService from '../state/stateService.js';
import whatsappService from '../whatsappService.js';
import geminiService from '../geminiService.js';
import { assistantButtons, assistantErrorButtons } from '../responses/botResponses.js';

/**
 * Handles the AI-assisted medical consultation flow.
 */
class AssistantFlow {
    /**
     * Sends user questions to Gemini and handles responses or errors.
     * @param {string} to - User's WhatsApp ID.
     * @param {string} message - User's question.
     */
    async handleFlow(to, message) {
        const state = stateService.getAssistandState(to);
        let response;

        if (state.step === 'question') {
            response = await geminiService(message);
        }

        stateService.clearAssistandState(to);
        await whatsappService.sendMessage(to, response);

        let menuMessage = "¿La respuesta fue de tu ayuda?";
        let buttons = assistantButtons;

        if (response === "Muchas solicitudes actualmente, inténtalo más tarde." || 
            response === "Lo siento, ha ocurrido un error al procesar tu consulta con la IA.") {
            menuMessage = "¿Qué te gustaría hacer?";
            buttons = assistantErrorButtons;
        }

        await whatsappService.sendInteractiveButtons(to, menuMessage, buttons);
    }
}

export default new AssistantFlow();
