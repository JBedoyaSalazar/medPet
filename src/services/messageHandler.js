import whatsappService from './whatsappService.js';
import stateService from './state/stateService.js';
import appointmentFlow from './flows/appointmentFlow.js';
import assistantFlow from './flows/assistantFlow.js';
import { 
    welcomeMessage, 
    menuMessage, 
    welcomeButtons, 
    contactInfo, 
    locationInfo,
    appointmentWaitMessage,
    goodbyeMessage,
    goodbyeButtons
} from './responses/botResponses.js';

/**
 * Orchestrates incoming WhatsApp messages and routes them to the appropriate flow.
 */
class MessageHandler {
    /**
     * Entry point for all incoming WhatsApp events.
     * @param {Object} message - The WhatsApp message object.
     * @param {Object} senderInfo - Metadata about the sender.
     */
    async handleIncomingMessage(message, senderInfo) {
        if (message?.type === 'text') {
            const incomingMessage = message.text.body.toLowerCase().trim(); 

            if (this.isGreeting(incomingMessage)) {
                await this.sendWelcome(message.from, message.id, senderInfo);
            } else if (incomingMessage === 'media') {
                await this.sendMedia(message.from);
            } else if (stateService.getAppointmentState(message.from)) {
                await appointmentFlow.handleFlow(message.from, incomingMessage);
            } else if (stateService.getAssistandState(message.from)) {
                await assistantFlow.handleFlow(message.from, incomingMessage);
            } else {
                await this.handleMenuOption(message.from, incomingMessage);
            }
            await whatsappService.markAsRead(message.id);
        } else if (message?.type === 'interactive') {
            const option = message?.interactive?.button_reply?.id;
            await this.handleMenuOption(message.from, option);
            await whatsappService.markAsRead(message.id);
        }
    }

    isGreeting(message) {
        const greetings = ["hola", "hello", "hi", "buenas tardes", "buenas noches", "buenos dias"];
        return greetings.some(greeting => message.includes(greeting));
    }

    getSenderName(senderInfo) {
        return senderInfo.profile?.name || senderInfo.wa_id;
    }

    async sendWelcome(to, messageId, senderInfo) {
        const name = this.getSenderName(senderInfo);
        await whatsappService.sendMessage(to, welcomeMessage(name), messageId);
        await whatsappService.sendInteractiveButtons(to, menuMessage, welcomeButtons);
    }

    async handleMenuOption(to, option) {
        let response;
        switch (option) {
            case 'option_1':
                stateService.setAppointmentState(to, { step: 'name' });
                response = "Por favor, ingresa tu nombre:";
                break;
            case 'option_2':
            case 'option_5':
                stateService.setAssistandState(to, { step: 'question' });
                response = "Realiza tu consulta";
                break;
            case 'option_3':
                response = 'Te esperamos en nuestra sucursal.';
                await whatsappService.sendMessage(to, response);
                await whatsappService.sendLocationMessage(to, locationInfo.latitude, locationInfo.longitude, locationInfo.name, locationInfo.address);
                return;
            case 'option_7':
                response = appointmentWaitMessage;
                break;
            case 'option_4':
                await whatsappService.sendInteractiveButtons(to, goodbyeMessage, goodbyeButtons);
                return;
            case 'option_8':
                response = "Chao, espero tengas un buen día";
                await whatsappService.sendMessage(to, response);
                return;
            case 'option_6':
                response = "Si esto es una emergencia, te invitamos a llamar a nuestra linea de atención";
                await whatsappService.sendMessage(to, response);
                await whatsappService.sendContactMessage(to, contactInfo);
                return;
            default:
                response = "Lo siento, no entendí tu selección, Por Favor, elige una de las opciones del menú.";
        }
        await whatsappService.sendMessage(to, response);
    }

    async sendMedia(to) {
        const mediaUrl = 'https://s3.amazonaws.com/gndx.dev/medpet-file.pdf';
        const caption = '¡Esto es un PDF!';
        const type = 'document';
        await whatsappService.sendMediaMessage(to, type, mediaUrl, caption);
    }
}

export default new MessageHandler();