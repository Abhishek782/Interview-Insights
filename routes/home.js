const express = require('express');
const router = express.Router();
const Article = require('../models/article');
const Company = require('../models/company');

router.get('/',async (req,res)=>{
    const article = await Article.find({confirm:true}).sort({createdAt: 'desc'})
    const company = await Company.find({confirm:true}).sort({ title: 1 }).collation({ locale: "en", caseLevel: true });

    res.render('home/home',{articles: article , company: company});
})


module.exports = router;
