```js
import db from "../../db.js";

class ReservationService {

    async getAll() {
        const [rows] = await db.execute(
            "SELECT * FROM Reservation"
        );

        return rows;
    }

    async getById(id) {
        const [rows] = await db.execute(
            "SELECT * FROM Reservation WHERE idReservation = ?",
            [id]
        );

        return rows[0];
    }

    async create(reservation) {
        const {
            dateReservation,
            status,
            guestQuantity
        } = reservation;

        const [result] = await db.execute(
            `INSERT INTO Reservation
            (dateReservation, status, guestQuantity)
            VALUES (?, ?, ?)`,
            [
                dateReservation,
                status,
                guestQuantity
            ]
        );

        return {
            idReservation: result.insertId,
            dateReservation,
            status,
            guestQuantity
        };
    }

    async update(id, reservation) {
        const {
            dateReservation,
            status,
            guestQuantity
        } = reservation;

        const [result] = await db.execute(
            `UPDATE Reservation
            SET dateReservation = ?,
                status = ?,
                guestQuantity = ?
            WHERE idReservation = ?`,
            [
                dateReservation,
                status,
                guestQuantity,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return null;
        }

        return this.getById(id);
    }

    async delete(id) {
        const [result] = await db.execute(
            "DELETE FROM Reservation WHERE idReservation = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return null;
        }

        return true;
    }
}

export default new ReservationService();
```
