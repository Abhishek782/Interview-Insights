// Show article ,edit article,delete article
const express = require('express');
const router = express.Router();
const Article = require('../models/article')
const Company = require('../models/company')
const check = require('../middleware/authMiddleware')
router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() });
})


router.get('/edit/:id',check.requireAuth, async (req, res) => {
    const article = await Article.findById(req.params.id);
    res.render('articles/edit', { article: article });
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

router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next();
}, saveArticleAndRedirect('edit'))


router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/home');
})



function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article
        article.name = req.body.name;
        article.phoneno = req.body.phoneno;
        article.company = req.body.company;
        article.title = req.body.title
        article.description = req.body.description


        try {
            article = await article.save();
            // const company = await Company.find({title:req.body.company});

            // console.log(company);

            // let initalcount = company.count;
            // initalcount+=1;
            // await Company.findOneAndUpdate({title:req.body.company},{$inc: {count: 1}}); 

            Company.findOne({ 'title': req.body.company }, function (err, subDoc) {
                // If there is an error in finding the document, catch them
                if (err) {
                    // Handle errors
                    console.log(err);
                }
                // If you find a document, increment the `count` and save
                if (subDoc) {
                    subDoc.count += 1;
                    subDoc.save(function (err2) {
                        if (err2) {
                            // Handle errors
                            console.log(err2);
                        } else {
                            console.log("Success");
                        }
                    });
                }
                // If no document is found, create a new one
                else {
                    // Populate the values to create the object
                    var data = {
                        "title": req.body.company,
                        "count": 1
                    };
                    Company.create(data, function (err3, subDoc) {
                        if (err3) {
                            // Handle errors
                            console.log(err3);
                        }
                        // Else return success
                        console.log("Success");
                    });
                }
            });

            res.redirect(`/articles/${article.slug}`);
        } catch (e) {
            console.log(e);
            res.render(`articles/${path}`, { article: article });
        }
    }
}
module.exports = router;