import db from "../../db.js";

class LoungeService {

  async create(data) {

    const { typeLoungeId } = data;

    const type = await db.LoungeType.findByPk(typeLoungeId);

    if (!type) {
      throw new Error("El tipo de salón indicado no existe.");
    }

    const lounge = await db.Lounge.create(data);

    return lounge;
  }

}

export default new LoungeService();
