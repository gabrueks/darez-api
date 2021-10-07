module.exports = {
  up: async (queryInterface) => {
    const [{ constraintName }] = await queryInterface.getForeignKeyReferencesForTable('company_visits');
    await queryInterface.removeConstraint('company_visits', constraintName);
  },

  down: async (queryInterface) => {
    await queryInterface.addConstraint('company_visits', {
      fields: ['company_id'],
      type: 'foreign key',
      references: {
        table: 'companies',
        field: 'id',
      },
    });
  },
};
