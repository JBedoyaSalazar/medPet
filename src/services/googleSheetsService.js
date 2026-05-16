import { google } from 'googleapis';
import path from 'path';
import config from '../config/env.js';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: config.GOOGLE_CLIENT_EMAIL,
    private_key: config.GOOGLE_PRIVATE_KEY,
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

const appendToSheet = async (data) => {
  try {
    const spreadsheetId = config.SPREADSHEET_ID;

    if (!spreadsheetId) {
      throw new Error("SPREADSHEET_ID no está definido en el archivo .env");
    }

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "'Hoja 1'!A:H", // Rango actualizado hasta la columna H
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [data],
      },
    });

    console.log("Datos guardados exitosamente en Google Sheets:", response.data.updates.updatedRange);
    return response.data;
  } catch (error) {
    console.error("Error al guardar en Google Sheets:", error.message);
  }
};

export const getExistingAppointments = async () => {
  try {
    const spreadsheetId = config.SPREADSHEET_ID;

    if (!spreadsheetId) {
      throw new Error("SPREADSHEET_ID no está definido en el archivo .env");
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "'Hoja 1'!A:H",
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return [];
    }

    // Mapeamos las filas. La columna H (índice 7) es la fecha de la cita final confirmada (appointmentDate)
    const appointments = rows.map(row => {
      return {
        date: row[7], // Fecha de la cita confirmada (appointmentDate)
        reason: row[4], // Motivo
        petType: row[3] // Tipo de mascota
      };
    }).filter(appt => appt.date && !isNaN(new Date(appt.date).getTime()));

    return appointments;
  } catch (error) {
    console.error("Error al leer de Google Sheets:", error.message);
    return [];
  }
};

export default appendToSheet;