const express = require('express');
const router = express.Router();
const Article = require('../models/article');
const Company = require('../models/company');

router.get('/:company',async (req,res)=>{
    const article = await Article.find({title:req.params.company});

    res.render('interview/interview',{articles: article});
})


module.exports = router;
