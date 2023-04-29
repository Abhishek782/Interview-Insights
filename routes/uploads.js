const express = require('express');
const { findById } = require('../models/article');
const router = express.Router();
const Article = require('../models/article')
const Company = require('../models/company');


router.post('/:id', async (req, res) => {

    let id = req.params.id;
    let article = await Article.findById({ _id: req.params.id });
    await Article.updateOne({ _id: id }, { $set: { confirm: true } });
    let y = article.company;  
    

    // Count1 to see how many approved company articles
    let count1 = await Article.countDocuments({
        $and: [
          { company: y },
          { confirm: true }
        ]
      })
// If more than 1 approved article of company, we can save and display company
    if(count1>0)
    {
        // count if any company document exist
        let count2 = await Company.countDocuments({
           title: y
          })

        //if no company document 
         if(count2==0)
         {
            Company.create({
                title: y,
                count: 1,
                confirm : true
              }, (err, result) => {
                if (err) {
                  console.error(err);
                } else {
                  console.log(result);
                }
              });
         }
         else if(count2>0) 
         {
            // if company document exist , just increase the count
            const result = await Company.findOneAndUpdate(
                { title: y },
                { $inc: { count: 1 } },
                { new: true }
              );
              console.log(result);
         }
        
    }
        
        res.redirect('/home');
    })
    
    module.exports = router;
    