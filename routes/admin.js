const express = require('express');
const router = express.Router();
const Article = require('../models/article')
const check = require('../middleware/authMiddleware')
const Company = require('../models/company')

router.get('/dashboard', check.requireAuth, async (req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' });
    res.render('articles/index', { articles: articles });
})



router.get('/edit/:id', check.requireAuth, async (req, res) => {
    const article = await Article.findById(req.params.id);
    res.render('articles/edit', { article: article });
})





router.put('/:id', check.requireAuth, async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next();
}, saveArticleAndRedirect('edit'))


router.delete('/:id', check.requireAuth, async (req, res) => {
    let article = await Article.findById({ _id: req.params.id });
    let y = article.company;

    let count = await Article.countDocuments({
        company: y
    });

    if (count > 1) {
        const result = await Company.findOneAndUpdate(
            { title: y },
            { $inc: { count: -1 } },
            { new: true }
        );
    }
    else if (count <= 1) {
        const result = await Company.deleteOne({ title: y });
    }




    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/');
})



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
            res.render(`articles/new/${path}`, { article: article });
        }
    }
}
module.exports = router;