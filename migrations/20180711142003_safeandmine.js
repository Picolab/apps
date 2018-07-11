exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('SafeAndMine', function(table) {
      table.string('tagID').primary().notNullable();
      table.string('DID').notNullable();
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('SafeAndMine'),
  ]);
};
