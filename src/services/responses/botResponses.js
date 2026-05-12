export const welcomeMessage = (name) => `Hola ${name}, Bienvenido a MEDPET, Tu tienda de mascotas en línea. ¿En qué puedo ayudarte hoy?`;

export const menuMessage = "Elige una Opción";
export const welcomeButtons = [
    { type: 'reply', reply: { id: 'option_1', title: 'Agendar' } },
    { type: 'reply', reply: { id: 'option_2', title: 'Consultar' } },
    { type: 'reply', reply: { id: 'option_3', title: 'Ubicación' } }
];

export const assistantButtons = [
    { type: 'reply', reply: { id: 'option_4', title: "Si, Gracias" } },
    { type: 'reply', reply: { id: 'option_5', title: 'Hacer otra pregunta' } },
    { type: 'reply', reply: { id: 'option_6', title: 'Emergencia' } }
];

export const assistantErrorButtons = [
    { type: 'reply', reply: { id: 'option_2', title: 'Volver a preguntar' } },
    { type: 'reply', reply: { id: 'option_1', title: 'Agendar cita' } },
    { type: 'reply', reply: { id: 'option_3', title: 'Ubicación' } }
];

export const contactInfo = {
    addresses: [{
        street: "123 Calle de las Mascotas", city: "Ciudad", state: "Estado",
        zip: "12345", country: "País", country_code: "PA", type: "WORK"
    }],
    emails: [{ email: "contacto@medpet.com", type: "WORK" }],
    name: {
        formatted_name: "MedPet Contacto", first_name: "MedPet", last_name: "Contacto",
        middle_name: "", suffix: "", prefix: ""
    },
    org: { company: "MedPet", department: "Atención al Cliente", title: "Representante" },
    phones: [{ phone: "+1234567890", wa_id: "1234567890", type: "WORK" }],
    urls: [{ url: "https://www.medpet.com", type: "WORK" }]
};

export const locationInfo = {
    latitude: 6.2071694,
    longitude: -75.574607,
    name: 'MedPet',
    address: 'Cra. 43A #5A - 113, El Poblado, Medellín, Antioquia.'
};
export const appointmentSummaryButtons = [
    { type: 'reply', reply: { id: 'option_2', title: 'Hacer una consulta' } },
    { type: 'reply', reply: { id: 'option_7', title: 'Esperar respuesta' } }
];

export const appointmentWaitMessage = "Dentro de los próximos 30 minutos nos pondremos en contacto contigo para programar tu cita.";

export const goodbyeMessage = "¡Gracias por tu consulta! ¿Qué deseas hacer ahora?";
export const goodbyeButtons = [
    { type: 'reply', reply: { id: 'option_8', title: 'Finalizar chat' } },
    { type: 'reply', reply: { id: 'option_3', title: 'Ubicación' } }
];
