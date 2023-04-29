const express = require('express');
const router = express.Router();
const Article = require('../models/article');
const Company = require('../models/company');

router.get('/:company',async (req,res)=>{
    console.log(req.params.company);
    const article = await Article.find({$and:[{company:req.params.company},{confirm:true}]});
    // const article = await Article.find({confirm:true})
    console.log(article);
    res.render('interview/interview',{articles: article});
})


module.exports = router;
