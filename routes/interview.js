const express = require('express');
const router = express.Router();
const Article = require('../models/article');
const Company = require('../models/company');
const axios = require("axios");
const cheerio = require("cheerio");
let topLinks = [];
router.get('/:company', async (req, res) => {
    const keyword = `${req.params.company} Interview`;
    const searchURL = `https://www.google.com/search?q=${encodeURIComponent(
    keyword
  )}`;
  await axios
    .get(searchURL)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const links = [];
      $("a").each((index, element) => {
        const link = $(element).attr("href");
        if (link.startsWith("/url?q=http")) {
          const decodedLink = decodeURIComponent(
            link.split("/url?q=")[1].split("&sa=")[0]
          );
          links.push(decodedLink);
        }
      });
      topLinks = links.slice(0, 5);
    })
    .catch((error) => {
      console.log("Error:", error);
    });
    const article = await Article.find({ $and: [{ company: req.params.company }, { confirm: true }] });
    let company = req.params.company;
    res.render('interview/interview', { articles: article ,company:company, topLinks:topLinks});
})


module.exports = router;
