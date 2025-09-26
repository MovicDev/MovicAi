const express = require('express');
const app = express();
const dotenv = require('dotenv');
const aiRouter = require('./Routes/aiRoute');

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('cors')({ origin: '*' }));

app.use('/api', aiRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});