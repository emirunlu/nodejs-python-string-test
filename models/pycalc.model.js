module.exports = (sequelize, Sequelize) => {
    const PyCalc = sequelize.define("pycalc",
        {
            id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
            character: { type: Sequelize.STRING, allowNull: false },
            order: { type: Sequelize.INTEGER, allowNull: false },

            createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
            updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        });

    return PyCalc;
}