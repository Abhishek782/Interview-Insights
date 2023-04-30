
const express = require('express');
const router = express.Router();
const Article = require('../models/article')
const Company = require('../models/company')

router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() });
})


router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug })
    if (article == null) {
        res.redirect('/')

    }
    res.render('articles/show', { article: article });
})

router.post('/', async (req, res, next) => {
    req.article = new Article();
    next();
}, saveArticleAndRedirect('new'))




function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article
        article.name = req.body.name;
        article.email = req.body.email;
        article.title = req.body.title
        article.description = req.body.description
        article.company = req.body.company
        article.currentDate = "0"


        try {
            article = await article.save();
            let cuser = await Article.findOne({ title: req.body.title });
            let cdate = cuser.createdAt;
            await Article.updateOne({ title: req.body.title },
                {
                    $set: {
                        currentDate: cdate.toJSON().slice(0, 10)
                    }
                });

            res.redirect(`/articles/${article.slug}`);
        } catch (e) {


            res.render(`articles/${path}`, { article: article, msg: "Please use some other unique title" });
        }
    }
}
module.exports = router;