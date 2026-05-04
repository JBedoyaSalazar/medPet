/**
 * Manages the temporary conversation state for users.
 */
class StateService {
    constructor() {
        this.appointmentState = {};
        this.assistandState = {};
    }

    /**
     * Gets the current appointment dialog state for a user.
     * @param {string} to - User's WhatsApp ID.
     */
    getAppointmentState(to) {
        return this.appointmentState[to];
    }

    setAppointmentState(to, state) {
        this.appointmentState[to] = state;
    }

    clearAppointmentState(to) {
        delete this.appointmentState[to];
    }

    getAssistandState(to) {
        return this.assistandState[to];
    }

    setAssistandState(to, state) {
        this.assistandState[to] = state;
    }

    clearAssistandState(to) {
        delete this.assistandState[to];
    }
}

export default new StateService();
