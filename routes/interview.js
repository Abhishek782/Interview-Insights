const express = require('express');
const router = express.Router();
const Article = require('../models/article');
const Company = require('../models/company');

router.get('/:company', async (req, res) => {
    const article = await Article.find({ $and: [{ company: req.params.company }, { confirm: true }] });
    res.render('interview/interview', { articles: article });
})


module.exports = router;
