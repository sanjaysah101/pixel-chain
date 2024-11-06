import { Router } from 'express';

const viewRouter = Router();

viewRouter.get('/', (req, res) => {
  res.render('pages/index', {
    title: 'HEIC Converter'
  });
});

viewRouter.get('/result', (req, res) => {
  const { url, message } = req.query;
  res.render('pages/result', {
    title: 'Conversion Result',
    url,
    message
  });
});

export { viewRouter }; 