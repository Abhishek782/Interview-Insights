const express = require('express');
const router = express.Router();
const Article = require('../models/article')



router.post('/:id', async (req, res) => {

    let id = req.params.id;
    await Article.updateOne({ _id: id }, { $set: { confirm: true } });
    res.redirect('/home');
})

module.exports = router;
