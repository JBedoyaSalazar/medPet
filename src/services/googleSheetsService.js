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

/**
 * Appends a row of data to the Google Sheets document.
 * 
 * @param {Array<string>} data - An array of values representing a single row to insert into the sheet.
 * @returns {Promise<Object|undefined>} The API response object or undefined if an error occurs.
 */
const appendToSheet = async (data) => {
  try {
    const spreadsheetId = config.SPREADSHEET_ID;

    if (!spreadsheetId) {
      throw new Error("SPREADSHEET_ID no está definido en el archivo .env");
    }

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "'Hoja 1'!A:H",
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

/**
 * Retrieves the current existing appointments from Google Sheets.
 * Extracts the confirmed appointment date, reason, and pet type from the rows to be used
 * for AI context and business validation rules.
 * 
 * @returns {Promise<Array<{date: string, reason: string, petType: string}>>} A list of scheduled appointments.
 */
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

    const appointments = rows.map(row => {
      return {
        date: row[7],
        reason: row[4],
        petType: row[3]
      };
    }).filter(appt => appt.date && !isNaN(new Date(appt.date).getTime()));

    return appointments;
  } catch (error) {
    console.error("Error al leer de Google Sheets:", error.message);
    return [];
  }
};

export default appendToSheet;