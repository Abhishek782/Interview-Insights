const express = require('express');
const { findById } = require('../models/article');
const router = express.Router();
const Article = require('../models/article')
const Company = require('../models/company');


router.post('/:id', async (req, res) => {

    let id = req.params.id;
    let article = await Article.findById({_id:req.params.id});
    await Article.updateOne({ _id: id }, { $set: { confirm: true } });
    let y = article.company;
    let x = await Company.updateOne({title:y},{ $set: { confirm: true }})
    res.redirect('/home');
})

module.exports = router;
