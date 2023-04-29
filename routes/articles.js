
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

            // if (path != 'edit') {
            //     Company.findOne({ 'title': req.body.company }, function (err, subDoc) {
            //         // If there is an error in finding the document, catch them
            //         if (err) {
            //             // Handle errors
            //             console.log(err);
            //         }
            //         // If you find a document, increment the `count` and save
            //         if (subDoc) {
            //             subDoc.count += 1;
            //             subDoc.save(function (err2) {
            //                 if (err2) {
            //                     // Handle errors
            //                     console.log(err2);
            //                 } else {
            //                     console.log("Success");
            //                 }
            //             });
            //         }
            //         else {
            //             // If no document is found, create a new one
            //             // Populate the values to create the object
            //             var data = {
            //                 "title": req.body.company,
            //                 "count": 1
            //             };
            //             Company.create(data, function (err3, subDoc) {
            //                 if (err3) {
            //                     // Handle errors
            //                     console.log(err3);
            //                 }
            //                 // Else return success
            //                 console.log("Success");
            //             });
            //         }
            //     });
            // }




            res.redirect(`/articles/${article.slug}`);
        } catch (e) {
            res.render(`articles/${path}`, { article: article });
        }
    }
}
module.exports = router;