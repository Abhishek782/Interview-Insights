// Show article ,edit article,delete article
const express = require('express');
const router = express.Router();
const Article = require('../models/article')
const check  = require('../middleware/authMiddleware')
const Company = require('../models/company')

router.get('/dashboard',check.requireAuth,async(req,res)=>{
    const articles = await Article.find().sort({createdAt: 'desc'});
    res.render('articles/index',{articles: articles});
})



router.get('/edit/:id',check.requireAuth,async(req,res)=>{
    const article = await Article.findById(req.params.id);
    res.render('articles/edit',{article: article});
})





router.put('/:id',async (req,res,next)=>{
    req.article = await  Article.findById(req.params.id);
    next();
},saveArticleAndRedirect('edit'))


router.delete('/:id',check.requireAuth,async(req,res)=>{
    let article = await Article.findById({ _id: req.params.id });
    let y = article.company;

    let count = await Article.countDocuments({
        company: y
       });

    if(count>1)
    {
        const result = await Company.findOneAndUpdate(
            { title: y },
            { $inc: { count: -1 } },
            { new: true }
          );
          console.log(result);
    }
    else if(count<=1)
    {
        const result = await Company.deleteOne({ title: y });
        console.log(result);
    }   




    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/');
})



function saveArticleAndRedirect(path){
    return async(req,res)=>{
        let article = req.article
            article.name = req.body.name;
            article.email = req.body.email;
            article.title = req.body.title
            article.description = req.body.description
            article.company = req.body.company
            article.currentDate= "0"



        
    
        try{
            article = await article.save();
            let cuser = await Article.findOne({title:req.body.title});
            let cdate = cuser.createdAt;
            await Article.updateOne( { title: req.body.title },
            {
              $set: {
              currentDate: cdate.toJSON().slice(0, 10)
              }
            });

        //     if(path!='edit'){
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
        //         // If no document is found, create a new one
        //         else {
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
        }catch(e){
            res.render(`articles/new/${path}`,{article:article});
        }
    }
}
module.exports = router;