import db from "../../db.js";

class ReservationModel {

    async getAll() {

        const [rows] = await db.execute(
            `SELECT 
                r.*,
                c.nameCli,
                c.surnameCli,
                c.dniCli,
                l.name AS loungeName,
                lt.nameLoungeType,
                cd.menuStage,
                cd.detail AS cardDetailDetail,
                cd.budget AS cardDetailBudget
            FROM reservation r
            LEFT JOIN client c 
                ON r.idCli = c.idCli
            LEFT JOIN lounge l 
                ON r.idLounge = l.idLounge
            LEFT JOIN loungeType lt 
                ON r.idLoungeType = lt.idLoungeType
            LEFT JOIN cardDetail cd 
                ON r.idCardDetail = cd.idCardDetail`
        );

        return rows;
    }

    async getByClient(idCli) {

        const [rows] = await db.execute(
            `SELECT 
                r.idReservation,
                r.dateReservation,
                r.dateEvent,
                r.status,
                r.cantInvit,
                r.idCli,
                r.idLounge,
                r.idLoungeType,
                r.idCardDetail,
                cd.menuStage,
                cd.detail,
                cd.budget
            FROM reservation r
            LEFT JOIN cardDetail cd 
                ON cd.idCardDetail = r.idCardDetail
            WHERE r.idCli = ?
            ORDER BY r.dateEvent`,
            [idCli]
        );

        for (const reservation of rows) {

            const [services] = await db.execute(
                `SELECT 
                    es.idService,
                    es.nameService,
                    es.detailService,
                    es.cost
                FROM reservationextraservice res
                INNER JOIN extraservice es
                    ON res.idService = es.idService
                WHERE res.idReservation = ?`,
                [reservation.idReservation]
            );

            reservation.extraServices = services;
        }

        return rows;
    }

    async getById(id) {

        const [rows] = await db.execute(
            `SELECT 
                r.*,
                c.nameCli,
                c.surnameCli,
                c.dniCli,
                l.name AS loungeName,
                lt.nameLoungeType,
                cd.menuStage,
                cd.detail AS cardDetailDetail,
                cd.budget AS cardDetailBudget
            FROM reservation r
            LEFT JOIN client c 
                ON r.idCli = c.idCli
            LEFT JOIN lounge l 
                ON r.idLounge = l.idLounge
            LEFT JOIN loungeType lt 
                ON r.idLoungeType = lt.idLoungeType
            LEFT JOIN cardDetail cd 
                ON r.idCardDetail = cd.idCardDetail
            WHERE r.idReservation = ?`,
            [id]
        );

        return rows[0];
    }

    async create(reservation, idCli) {

        const {
            dateEvent,
            status,
            cantInvit,
            idLounge,
            idLoungeType,
            idCardDetail,
            idServices
        } = reservation;

        const [result] = await db.execute(
            `INSERT INTO reservation
            (
                dateReservation,
                dateEvent,
                status,
                cantInvit,
                idCli,
                idLounge,
                idLoungeType,
                idCardDetail
            )
            VALUES
            (
                CURDATE(),
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?
            )`,
            [
                dateEvent,
                status,
                cantInvit,
                idCli,
                idLounge,
                idLoungeType,
                idCardDetail
            ]
        );

        const idReservation = result.insertId;

        if (idServices && idServices.length > 0) {

            for (const idService of idServices) {

                await db.execute(
                    `INSERT INTO reservationextraservice
                    (idReservation, idService)
                    VALUES (?, ?)`,
                    [idReservation, idService]
                );
            }
        }

        return {
            idReservation,
            dateReservation: new Date().toISOString().split("T")[0],
            dateEvent,
            status,
            cantInvit,
            idCli,
            idLounge,
            idLoungeType,
            idCardDetail,
            idServices: idServices || []
        };
    }

    async update(id, reservation) {

        const {
            dateEvent,
            status,
            cantInvit,
            idCli,
            idLounge,
            idLoungeType,
            idCardDetail
        } = reservation;

        const [result] = await db.execute(
            `UPDATE reservation
            SET 
                dateEvent = ?,
                status = ?,
                cantInvit = ?,
                idCli = ?,
                idLounge = ?,
                idLoungeType = ?,
                idCardDetail = ?
            WHERE idReservation = ?`,
            [
                dateEvent,
                status,
                cantInvit,
                idCli,
                idLounge,
                idLoungeType,
                idCardDetail,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return null;
        }

        return this.getById(id);
    }

    async updateStatus(id, status) {

        const [result] = await db.execute(
            `UPDATE reservation
            SET status = ?
            WHERE idReservation = ?`,
            [status, id]
        );

        if (result.affectedRows === 0) {
            return null;
        }

        return this.getById(id);
    }

    async delete(id) {

        const [result] = await db.execute(
            `UPDATE reservation
            SET status = ?
            WHERE idReservation = ?`,
            ["cancelada", id]
        );

        if (result.affectedRows === 0) {
            return null;
        }

        return true;
    }
}

export default new ReservationModel();