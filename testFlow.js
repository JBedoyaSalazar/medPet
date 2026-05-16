import appendToSheet, { getExistingAppointments } from './src/services/googleSheetsService.js';
import { proposeAppointmentsWithGemini, validateAppointment, parseDateWithGemini } from './src/services/schedulingService.js';

async function runTestScenario(name, petName, petType, reason, initialWishDateInput, confirmedDateInput) {
    console.log(`\n===========================================`);
    console.log(`🚀 INICIANDO PRUEBA: ${name}`);
    console.log(`===========================================`);

    try {
        // Simulating the user giving their reason and wish date
        console.log(`1. Motivo: "${reason}"`);
        console.log(`2. User says wishDate: "${initialWishDateInput}"`);

        // Fetch existing appointments
        const existingAppointments = await getExistingAppointments();
        console.log(`3. Citas existentes encontradas: ${existingAppointments.length}`);

        // Gemini proposes dates
        console.log("4. Consultando propuestas a Gemini...");
        const aiProposal = await proposeAppointmentsWithGemini(reason, initialWishDateInput, existingAppointments);
        console.log(`🤖 Gemini dice:\n${aiProposal}\n`);

        // Simulating user answering with a final confirmed date
        console.log(`5. User confirms date: "${confirmedDateInput}"`);
        console.log("6. Analizando fecha con Gemini Parse...");
        
        const parsedDateString = await parseDateWithGemini(confirmedDateInput);
        
        if (!parsedDateString) {
            console.error(`❌ ERROR: Gemini no pudo interpretar la fecha "${confirmedDateInput}". (Respondió INVALID)`);
            return;
        }

        console.log(`✅ Fecha interpretada por Gemini: ${parsedDateString}`);

        // Validation
        const validation = validateAppointment(parsedDateString, existingAppointments);
        if (!validation.valid) {
            console.error(`❌ ERROR DE VALIDACIÓN: ${validation.message}`);
            return;
        }

        console.log(`✅ Validación superada.`);

        // Final Saving
        const userData = [
            "573000000000", // to
            name,
            petName,
            petType,
            reason,
            new Date().toISOString(),
            initialWishDateInput,
            parsedDateString
        ];

        console.log("7. Guardando en Google Sheets...");
        await appendToSheet(userData);
        console.log(`🎉 Cita agendada exitosamente para ${name}!`);

    } catch (error) {
        console.error("Fallo inesperado:", error);
    }
}

async function runAllTests() {
    // Escenario 1: Happy Path
    // Pide un horario normal, en texto natural pero claro.
    await runTestScenario(
        "Carlos Feliz", 
        "Firulais", 
        "Perro", 
        "Revisión general y vacunas anuales", 
        "el próximo viernes a las 10 de la mañana", 
        "el viernes a las 10 am"
    );

    // Escenario 2: Edge Cases (Horario raro, conflicto)
    // El usuario pide un horario de madrugada, Gemini le debe decir que no se puede y ofrecer alternativas, 
    // pero simulamos que el usuario insiste con "a las 3 de la mañana" para forzar la validación estricta, 
    // luego falla y terminamos forzando una cita conflictiva para ver cómo se defiende el bot.
    await runTestScenario(
        "María Problemas", 
        "Garfield", 
        "Gato", 
        "Se torció la pata, necesito un cirujano", 
        "hoy a las 3:00 AM de la madrugada", // Esto va a fallar en la IA y ofrecer alternativas.
        "mañana a las 23:00" // Forzamos falla de validación de horas (23:00 es después de 20:00)
    );

    // Escenario 3: Edge Case Recuperado
    // Probamos si parseDateWithGemini devuelve INVALID ante texto incomprensible.
    await runTestScenario(
        "Pedro Dudoso", 
        "Rex", 
        "Iguana", 
        "Revisión de piel", 
        "no sé, un día de estos", 
        "tal vez cuando llueva" // Fallo de parseo de Gemini
    );
}

runAllTests();
