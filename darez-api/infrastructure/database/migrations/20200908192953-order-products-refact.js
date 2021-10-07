/* eslint-disable */

module.exports = {
    up: async (queryInterface, Sequelize) => {

        // drop table...
        await queryInterface.dropTable('order_products');
         
        // ..and create it
        await queryInterface.createTable('order_products', {
            id: {
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            order_id: {
                allowNull: false,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV1,
            },
            product_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            product_variation_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            quantity: {
                type: Sequelize.SMALLINT,
                allowNull: false,
            },
            unity_price: {
                type: Sequelize.DECIMAL(19, 2),
                allowNull: false,
            },
            company_id: {
                allowNull: false,
                foreignKey: true,
                type: Sequelize.INTEGER,
                references: {
                    model: 'companies',
                    key: 'id',
                },
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING
            },
            description: {
                allowNull: true,
                type: Sequelize.STRING
            },
            category: {
                allowNull: false,
                type: Sequelize.STRING
            },
            subcategory: {
                allowNull: false,
                type: Sequelize.STRING
            },
            color: {
                allowNull: false,
                type: Sequelize.STRING,
                defaultValue:''
            },
            size: {
                allowNull: false,
                type: Sequelize.STRING,
                defaultValue:''
            },
            active: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        // we do not have rollback in this case.
    }
}