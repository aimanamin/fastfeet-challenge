module.exports = {
  dialect: 'sqlite',
  storage: 'database.sqlite',
  // host: 'localhost',
  // username: 'postgres',
  // database: 'gobarber',
  // password: 'docker',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
