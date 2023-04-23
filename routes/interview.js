const express = require('express');
const router = express.Router();
const Article = require('../models/article');
const Company = require('../models/company');

router.get('/:company',async (req,res)=>{
    console.log(req.params.company);
    const article = await Article.find({company:req.params.company});
    console.log(article);
    res.render('interview/interview',{articles: article});
})


module.exports = router;
