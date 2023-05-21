
const express = require('express');
const router = express.Router();
const Article = require('../models/article')
const Company = require('../models/company')
const fs = require('fs');

// profanityengine
class ProfanityEngine1 {
  constructor(config) {
    let path;
    if (config && config.test) {
      path = 'data/list.txt'
    } else {
      path = './node_modules/@coffeeandfun/google-profanity-words/data/list.txt';
    }

    this.terms = fs.readFileSync(`${path}`, 'utf8').split('\n');
  }

  all() {
    return this.terms;
  }

  search(term) {
    let result = this.terms.indexOf(term);
    return result > -1 ? true : false;
  }

  checkAbusiveWords(paragraph) {
    const words = paragraph.split(' ');
    const abusiveWords = [];

    for (let i = 0; i < words.length; i++) {
      const word = words[i].toLowerCase().replace(/[^\w\s]/gi, ''); // Remove punctuation and convert to lowercase
      if (this.search(word)) {
        abusiveWords.push(word);
      }
    }

    return abusiveWords;
  }
}

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


    // insert abusive detector

    let profanity = new ProfanityEngine1();
    const paragraph = article.description;

    const abusiveWords = profanity.checkAbusiveWords(paragraph);
    if (abusiveWords.length > 0) {
      console.log(`Abusive words found: ${abusiveWords.join(', ')}`);
      return res.send(`
      <html>
  <script src="https://kit.fontawesome.com/57d7b546f7.js" crossorigin="anonymous"></script>
  <link
    href="https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap"
    rel="stylesheet"
  />
  <head>
    <style>
      * {
        background-color: #b6def7;
        font-family: 'poppins';
        margin: 0;
        padding: 0;
      }

      .popup {
        z-index: 9999;
        background-color: white;
        padding: 16px;
        border-radius: 5px;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        gap: 10px;
        opacity: 0; /* Start with 0 opacity */
        animation: fadeIn 0.5s ease forwards; /* Apply fade-in animation */
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      h3,
      p,
      i {
        background-color: white;
      }

      i {
        color: rgb(248, 74, 74);
      }

      .buttons {
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: end;
        gap: 10px;
      }

      #popup-button {
        background-color: rgb(248, 74, 74);
        padding: 8px 20px;
        border-radius: 3px;
        border: none;
        font-size: 1rem;
        font-weight: 700;
        cursor: pointer;
      }

      .alert {
        background-color: white;
        display: flex;
        gap: 10px;
        align-items: center;
      }
    </style>
    <script>
      function closePopup() {
        document.getElementById('popup').style.display = 'none';
        window.location.href = '/articles/new'; // Redirect to write article page
      }
    </script>
  </head>
  <body>
    <div class="popup" id="popup">
      <div class="alert">
        <h3><i class="fa-solid fa-triangle-exclamation"></i></h3>
        <h3>Abusive words found!</h3>
      </div>

      <p>
        Content Violation Detected! Please ensure your article contains appropriate language for an educational website.
        Remove any abusive words before submitting.
      </p>
      <div class="buttons">
        <button id="popup-button" onclick="closePopup()">Continue</button>
      </div>
    </div>
  </body>
</html>

      `);
    } else {
      console.log("No abusive words found.");
    }


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