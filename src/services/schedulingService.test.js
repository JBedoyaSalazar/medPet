import { isWithinWorkingHours, hasConflict, validateAppointment } from './schedulingService.js';

describe('Scheduling Service - Validaciones de Cita', () => {
    describe('Validación de Horario de Servicio (8 AM a 8 PM)', () => {
        it('debe retornar falso si la cita es antes de las 8 AM', () => {
            // 7:59 AM
            const date = new Date('2023-10-10T07:59:00');
            expect(isWithinWorkingHours(date.toISOString())).toBe(false);
        });

        it('debe retornar falso si la cita es a las 8 PM (20:00) o después', () => {
            // 8:00 PM
            const date1 = new Date('2023-10-10T20:00:00');
            expect(isWithinWorkingHours(date1.toISOString())).toBe(false);
            
            // 9:00 PM
            const date2 = new Date('2023-10-10T21:00:00');
            expect(isWithinWorkingHours(date2.toISOString())).toBe(false);
        });

        it('debe retornar verdadero si la cita es dentro de las horas de servicio (8:00 AM - 7:59 PM)', () => {
            // 8:00 AM
            const date1 = new Date('2023-10-10T08:00:00');
            expect(isWithinWorkingHours(date1.toISOString())).toBe(true);

            // 1:00 PM
            const date2 = new Date('2023-10-10T13:00:00');
            expect(isWithinWorkingHours(date2.toISOString())).toBe(true);
        });
    });

    describe('Validación de Incompatibilidad (Conflictos)', () => {
        const existingAppointments = [
            { date: new Date('2023-10-10T10:00:00').toISOString(), reason: 'Revisión' },
            { date: new Date('2023-10-10T11:00:00').toISOString(), reason: 'Vacunación' }
        ];

        it('debe retornar verdadero (hay conflicto) si se agenda en la misma hora y fecha', () => {
            const requested = new Date('2023-10-10T10:00:00').toISOString();
            expect(hasConflict(requested, existingAppointments)).toBe(true);
        });

        it('debe retornar falso (no hay conflicto) si el horario está libre', () => {
            const requested = new Date('2023-10-10T12:00:00').toISOString();
            expect(hasConflict(requested, existingAppointments)).toBe(false);
        });
    });

    describe('Validación Completa (validateAppointment)', () => {
        const existingAppointments = [
            { date: new Date('2023-10-10T10:00:00').toISOString(), reason: 'Revisión' }
        ];

        it('debe retornar inválido por estar fuera de servicio', () => {
            const requested = new Date('2023-10-10T07:00:00').toISOString();
            const result = validateAppointment(requested, existingAppointments);
            expect(result.valid).toBe(false);
            expect(result.reason).toBe("fuera_de_servicio");
        });

        it('debe retornar inválido por incompatibilidad de horario', () => {
            const requested = new Date('2023-10-10T10:00:00').toISOString();
            const result = validateAppointment(requested, existingAppointments);
            expect(result.valid).toBe(false);
            expect(result.reason).toBe("incompatibilidad");
        });

        it('debe retornar válido si está en horario y no hay conflictos', () => {
            const requested = new Date('2023-10-10T11:00:00').toISOString();
            const result = validateAppointment(requested, existingAppointments);
            expect(result.valid).toBe(true);
        });
    });
});
