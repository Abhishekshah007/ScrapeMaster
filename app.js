const form = document.querySelector('#input-form');
const clickList = document.querySelector('#click-list');
const scrapedList = document.querySelector('#scraped-list');
const scrapeButton = document.querySelector('#scrape-button');
let currentUrl = '';

form.addEventListener('submit', event => {
  event.preventDefault();
  const url = document.querySelector('#website-url-input').value;
  if (!url) {
    alert('Please enter a URL');
    return;
  }
  currentUrl = url;
  displayWebsite();
});

scrapeButton.addEventListener('click', event => {
  scrapePage();
});

function displayWebsite() {
  const frameset = document.createElement('frameset');
  const frame = document.createElement('frame');
  frame.setAttribute('src', currentUrl);
  frameset.appendChild(frame);
  const div = document.createElement('div');
  div.classList.add('click-container');
  div.appendChild(frameset);
  const div2 = document.createElement('div');
  div2.classList.add('scraped-container');
  div2.appendChild(document.createElement('h2').appendChild(document.createTextNode('Scraped Elements')));
  const ul = document.createElement('ul');
  ul.id = 'scraped-list';
  div2.appendChild(ul);
  document.body.appendChild(div);
  document.body.appendChild(div2);
  frameset.addEventListener('load', () => {
    frameset.contentDocument.addEventListener('click', (event) => {
      event.preventDefault();
      const target = event.target;
      const isElement = target.nodeType === 1;
      const alreadyClicked = clickList.querySelector(`li[data-path="${getDomPath(target)}"]`);
      if (isElement && !alreadyClicked) {
        const li = document.createElement('li');
        li.classList.add('liw');
        li.dataset.path = getDomPath(target);
        const h3 = document.createElement('h3');
        h3.appendChild(document.createTextNode(target.nodeName));
        li.appendChild(h3);
        const p = document.createElement('p');
        p.appendChild(document.createTextNode(target.textContent.trim()));
        li.appendChild(p);
        clickList.appendChild(li);
      }
    });
  });
}

async function scrapePage() {
  const response = await fetch(`/scrape?url=${currentUrl}`);
  if (!response.ok) {
    console.error(response);
    alert('Error scraping website');
    return;
  }
  const data = await response.json();
  displayElements(data);
}

function displayElements(elements) {
  for (const element of elements) {
    const li = document.createElement('li');
    li.classList.add('liw');
    const h3 = document.createElement('h3');
    h3.classList.add('scraped-heading');
    h3.appendChild(document.createTextNode(element.heading));
    li.appendChild(h3);
    if (element.text) {
      const p = document.createElement('p');
      p.classList.add('scraped-text');
      p.innerHTML = element.text;
      li.appendChild(p);
    }
    if (element.src) {
      const img = document.createElement('img');
      img.src = element.src;
      img.alt = element.alt;
      li.appendChild(img);
    }
    scrapedList.appendChild(li);
  }
}

function getDomPath(el) {
  const stack = [];
  while (el.parentNode !== null) {
    let sibCount = 0;
    let sibIndex = 0;
    for (let i = 0; i < el.parentNode.childNodes.length; i++) {
      const sib = el.parentNode.childNodes[i];
      if (sib.nodeName === el.nodeName) {
        if (sib === el) {
          sibIndex = sibCount;
        }
        sibCount++;
      }
    }
    if (sibCount > 1) {
      stack.unshift(`${el.nodeName}:eq(${sibIndex})`);
    } else {
      stack.unshift(el.nodeName);
    }
    el = el.parentNode;
  }
  return stack.slice(1).join(' > ');
}