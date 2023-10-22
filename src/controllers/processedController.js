const fs = require('fs');
const $ = require('cheerio');
const path = require('path');

exports.processedFile = (req, res, next) => {

    const defaultName = req.originalName;
  
    const filesDirectory = path.resolve(process.cwd(), 'processedFiles');
    
    fs.readdir(filesDirectory, (err, files) => {
      if (err) {
        return res.send('Erro ao ler diretório!');
      }
  
      const fileLink = files.filter(file => {
        if (file.slice(0, -5) === req.newFileName) {
            return `<a href="/download/${file}">${file}</a>`;
        }
        
      });
        //   res.send(`<h1>Files</h1><br>${fileLink}`);
    res.render('processed', {
        titulo: 'Arquivo processado:',
        link: fileLink,
        originalName: defaultName
      });
    });
  }