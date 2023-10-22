const fs = require('fs');
const $ = require('cheerio');
const path = require('path');

const classes = [
  '.titulo--1',
  '.titulo--2',
  '.titulo--3',
  '.titulo--4',
  '.titulo--5',
  '.titulo--6',
  '.texto--titulo',
  '.texto--titulo-poesia'
];

exports.htmlProcessorCheck = (req, res, next) => {
  
  console.log('Processando...');
  setTimeout(() => {
    next();
  }, 2000) 

}

exports.htmlProcessor = (req, res, next) => {

  const fileName = req.file.filename;

  const htmlFile = path.resolve(process.cwd(), `uploads/${fileName}`);

  const processedFile = path.resolve(process.cwd(), `processedFiles/${fileName}.html`);

  fs.readFile(htmlFile, 'utf8', (err, data) => {
    if (err) 
      throw err;
    const $html = $.load(data);
  
    // Remover tags strong de títulos
    classes.forEach(className => {
      $html(className).each(function () {
        const $strong = $html(this).find('strong');
        if ($strong.length > 0) {
          const strongText = $strong.html();
          $strong.remove();
          $html(this).append(strongText);
        }
      });
    });

    // Remover spans vazios 
    $html('span:not([class])').each(function () {
      const spanText = $html(this).html();
      $html(this).replaceWith(spanText);
    });
    
    // Remover strong/em/span/sub/sup de imagens
    $html('img').each(function () {
      const parentTag = $html(this)
        .parent()
        .get(0)
        .name;
      if (parentTag === 'strong' || parentTag === 'em' || parentTag === 'span' || parentTag === 'sub' || parentTag === 'sup') {
        $html(this).unwrap();
      }
    });
  
    // Alterar "imagem_referencia" para "texto_referencia"
    $html('.imagem_referencia').each(function() {
      $html(this).removeClass('imagem_referencia').addClass('texto_referencia');
    });
  
  
    $html("*").contents().filter(function() {
      return this.type === 'text' && this.data.includes('--');
    }).each(function() {
      let text = $html(this).text();
      text = text.replace(/--/g, '-');
      $html(this).replaceWith(text);
    });
    $html("*").contents().filter(function() {
      return this.type === 'text' && this.data.includes('- -');
    }).each(function() {
      let text = $html(this).text();
      text = text.replace(/- -/g, '-');
      $html(this).replaceWith(text);
    });
    
    fs.writeFile(processedFile, $html.html(), 'utf8', err => {
      if (err) 
        throw err;
        console.log('Processado com sucesso!');
        req.newFileName = req.file.filename;
        req.originalName = req.file.originalname;
        next();
    });
    }); 
}