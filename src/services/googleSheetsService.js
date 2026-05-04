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
      range: "'Hoja 1'!A:F", // El nombre de la pestaña tiene un espacio, por lo que debe ir entre comillas simples dentro del string
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

export default appendToSheet;