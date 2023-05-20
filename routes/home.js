const express = require('express');
const router = express.Router();
const Article = require('../models/article');
const Company = require('../models/company');
const Request = require('../models/request');

router.get('/', async (req, res) => {
    const article = await Article.find({ confirm: true }).sort({ createdAt: 'desc' })
    const company = await Company.find({ confirm: true }).sort({ title: 1 }).collation({ locale: "en", caseLevel: true });
    const requests = await Request.find({});


    

    
    res.render('home/home', { articles: article, company: company, requests : requests });
})


module.exports = router;
