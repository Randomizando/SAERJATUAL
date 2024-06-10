// middlewares/checkVoterCategory.js
module.exports = function (req, res, next) {
    const { categoria } = req.user; // Assumindo que a categoria do usuário está no objeto req.user
  
    if (categoria === 'Ativo' || categoria === 'Remido') {
      next(); // O usuário tem permissão para votar
    } else {
      res.status(403).json({ error: 'Você não tem permissão para votar.' });
    }
  };
  