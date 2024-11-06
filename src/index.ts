import express from 'express';
import compression from 'compression';
import cors from 'cors';
import path from 'path';
import expressLayouts from 'express-ejs-layouts';
import { uploadRouter } from './routes/upload';
import { viewRouter } from './routes/views';
import { setupFolders } from './utils/setup';
import { config } from './config';

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Add this after view engine setup
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Middleware
app.use(cors());
app.use(compression());
app.use(express.raw({ type: 'application/octet-stream', limit: '5mb' }));
app.use(express.static('public'));

// Setup upload folders
setupFolders();

// Routes
app.use('/', viewRouter);
app.use('/api', uploadRouter);

app.listen(config.port, () => {
  console.log(`Server is running on http://localhost:${config.port}`);
});
