const express = require('express');
const route = express.Router();
const homeController = require('./src/controllers/homeController');
const processor = require('./src/middlewares/processor');
const processedController = require('./src/controllers/processedController')
const path = require('path');

const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({ dest: 'uploads/' });
 
// Rotas da home
route.get('/', homeController.paginaInicial);
route.post('/', upload.single('arquivoHTML'), processor.htmlProcessorCheck, processor.htmlProcessor, processedController.processedFile);
// route.get('/contato', homeController.paginaInicial)

route.get('/download/:file', (req, res) => {
    const file = req.params.file;
    const filesDirectory = path.resolve(process.cwd(), 'processedFiles');
    const filePath = path.join(filesDirectory, file);
  
    res.download(filePath, (err) => {
      if (err) {
        return res.send('Error downloading file');
      }
    });
  });

// Rotas de contato
// route.get('/contato', contatoController.paginaInicial);

module.exports = route;