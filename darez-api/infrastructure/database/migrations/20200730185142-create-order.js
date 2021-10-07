module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      company_id: {
        allowNull: false,
        primaryKey: true,
        foreignKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'companies',
          key: 'id',
        },
      },
      buyer: {
        allowNull: false,
        foreignKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      cep: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      street: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      street_number: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      address_2: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      neighborhood: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      city: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      state: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.DECIMAL(19, 2),
        allowNull: false,
      },
      payment_method: {
        allowNull: false,
        foreignKey: true,
        type: Sequelize.STRING,
        references: {
          model: 'payment_methods',
          key: 'method',
        },
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: 'Criado',
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

    await queryInterface.createTable('order_products', {
      order_id: {
        allowNull: false,
        primaryKey: true,
        foreignKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'orders',
          key: 'id',
        },
      },
      product_id: {
        allowNull: false,
        foreignKey: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'products',
          key: 'id',
        },
      },
      product_variation_id: {
        allowNull: false,
        foreignKey: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        defaultValue: 0,
        references: {
          model: 'product_variations',
          key: 'id',
        },
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

  down: async (queryInterface) => {
    await queryInterface.dropTable('order_products');
    await queryInterface.dropTable('orders');
  },
};
