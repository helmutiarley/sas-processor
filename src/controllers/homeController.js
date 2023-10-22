exports.paginaInicial = (req, res, next) => {
    req.session.usuario = { nome: 'Luiz', logado: true };
    res.render('index', {
        titulo: 'SAS - HTML Processor'
    });
    return;
}

exports.trataPost = (req, res) => {
    res.send('Passei por todos os middlewares!');
    return;
}