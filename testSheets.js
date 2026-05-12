import appendToSheet from './src/services/googleSheetsService.js';

const mockData = [
  new Date().toLocaleString(), // Fecha (A)
  "Usuario de Prueba",         // Nombre (B)
  "Pelusa",                    // Mascota (C)
  "Vacunación",                // Servicio (D)
  "10:00 AM",                  // Hora (E)
  "Prueba Exitosa"             // Estado (F)
];

async function testGoogleSheets() {
  console.log("Iniciando prueba de Google Sheets...");
  console.log("Enviando los siguientes datos de prueba:", mockData);
  
  try {
    await appendToSheet(mockData);
    console.log("Prueba de Google Sheets finalizada.");
  } catch (error) {
    console.error("Falló la prueba con error:", error);
  }
}

testGoogleSheets();
