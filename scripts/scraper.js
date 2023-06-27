const cheerio = require('cheerio');

function scrape(html) {
  const $ = cheerio.load(html);
  const scrapedData = [];
  
  // Example scraping code
  $('h1').each((i, el) => {
    const heading = $(el).text();
    const text = $(el).next().text();
    scrapedData.push({
      tag: 'h3',
      heading,
      text
    });
  });
  $('img').each((i, el) => {
    const src = $(el).attr('src');
    const alt = $(el).attr('alt');
    scrapedData.push({
      tag: 'img',
      src,
      alt
    });
  });
  
  return scrapedData;
}

module.exports = {scrape};
