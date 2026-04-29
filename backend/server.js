require('dotenv').config();

const app = require('./app');
const { initializeApplication } = require('./services/schemaService');

const PORT = process.env.PORT || 3000;

initializeApplication()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize backend:', error);
    process.exit(1);
  });
