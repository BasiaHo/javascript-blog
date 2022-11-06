'use strict';
const templates = {
  articleLink: Handlebars.compile(
    document.querySelector('#template-article-link').innerHTML
  ),
  tagLink: Handlebars.compile(
    document.querySelector('#template-tag-link').innerHTML
  ),
  authorLink: Handlebars.compile(
    document.querySelector('#template-author-link').innerHTML
  ),
  tagCloudLink: Handlebars.compile(
    document.querySelector('#template-tagCloud-link').innerHTML
  ),
  authorListLink: Handlebars.compile(
    document.querySelector('#template-authorList-link').innerHTML
  ),
};

function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');

  /*remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  /*add class 'active' to the clicked link */
  clickedElement.classList.add('active');
  console.log('clickedElement:', clickedElement);

  /*remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.post.active');
  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');
  console.log('article selected:', articleSelector);

  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);
  console.log(targetArticle);

  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
  console.log('targetElement:', targetArticle);
}

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  optTagsListSelector = '.tags.list',
  optCloudClassCount = '5',
  optCloudClassPrefix = 'tag-size-',
  optAuthorsListSelector = '.authors.list';

function generateTitleLinks(customSelector = '') {
  console.log('New title link generated');

  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);

  clearInnerHTML(titleList);

  /* for each article */
  const articles = document.querySelectorAll(
    optArticleSelector + customSelector
  );
  console.log(
    'customSelector+optArticleSelector',
    optArticleSelector + customSelector
  );

  for (let article of articles) {
    /* get the article id */
    const articleId = article.getAttribute('id');
    console.log('articleId', articleId);

    /* find the title element */
    /* get the title from the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    /* create HTML of the link */
    const linkHTMLData = { id: articleId, title: articleTitle };
    const linkHTML = templates.articleLink(linkHTMLData);

    console.log('HTML of the link:', linkHTML);
    /* insert link into titleList */
    titleList.insertAdjacentHTML('beforeend', linkHTML);
  }

  const links = document.querySelectorAll('.titles a');

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function clearInnerHTML(element) {
  element.innerHTML = '';
}

function calculateTagClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);

  return optCloudClassPrefix + classNumber;
}

function generateTags() {
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);

  /* START LOOP: for every article: */
  for (let article of articles) {
    console.log(article);
    /* find tags wrapper */
    const tagsWrapper = article.querySelector(optArticleTagsSelector);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    console.log(articleTags);
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');

    /* START LOOP: for each tag */
    for (let tag of articleTagsArray) {
      console.log(tag);

      /* generate HTML of the link */
      const linkHTMLData = { tag, tagTitle: tag };
      const linkHTML = templates.tagLink(linkHTMLData);
      console.log('HTML of the link:', linkHTML);

      /* add generated code to html variable */
      html = html + linkHTML;
      /* [NEW] check if this link is NOT already in allTags */
      if (!allTags.hasOwnProperty(tag)) {
        /* [NEW] add generated code to allTags array */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    }
    /* END LOOP: for each tag */

    /* insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html;

    /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(optTagsListSelector);

  /* [NEW] add html from allTags to tagList */

  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams:', tagsParams);

  //let allTagsHTML = '';
  const allTagsData = { tags: [] };

  for (let tag in allTags) {
    const tagLinkHTML =
      '<li><a class="' +
      calculateTagClass(allTags[tag], tagsParams) +
      '" href="#tag-' +
      tag +
      '">' +
      tag +
      '</a></li>';

    console.log('taglinkHTML:', tagLinkHTML);

    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams),
    });
  }

  tagList.innerHTML = templates.tagCloudLink(allTagsData);
  console.log(allTagsData, 'allTagsData');
}

generateTags();

function tagClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  console.log('Tag was clicked!');

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  console.log('href', href);

  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  console.log('tag extracted', tag);
  /* find all tag links with class active */
  const tagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  console.log(tagLinks);
  /* START LOOP: for each active tag link */
  for (const tagLink of tagLinks) {
    /* remove class active */
    tagLink.classList.remove('active');

    /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagLinksWithHref = document.querySelectorAll('a[href="' + href + '"]');

  /* START LOOP: for each found tag link */
  for (const tagLink of tagLinksWithHref) {
    /* add class active */
    tagLink.classList.add('active');
    /* END LOOP: for each found tag link */
  }

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {
  /* find all links to tags */
  const linksToTags = document.querySelectorAll('a[href^="#tag-"]');
  console.log(linksToTags);
  /* START LOOP: for each link */
  for (const linkToTags of linksToTags) {
    /* add tagClickHandler as event listener for that link */
    linkToTags.addEventListener('click', tagClickHandler);
    /* END LOOP: for each link */
  }
}

addClickListenersToTags();

/*Adding an author to the article */

function generateAuthors() {
  const allAuthors = [];
  const allAuthorsData = { authors: [] };

  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  console.log('articles', articles);

  /* START LOOP: for every article: */
  for (let article of articles) {
    console.log('article', article);
    /* find authors wrapper */
    const authorWrapper = article.querySelector(optArticleAuthorSelector);
    console.log(authorWrapper, 'wrapper');

    /* get author from data-author attribute */
    const articleAuthor = article.getAttribute('data-author');
    console.log(articleAuthor, 'data author');

    /* generate HTML of the link */
    const linkHTMLData = { author: articleAuthor, authorTitle: articleAuthor };
    const linkAuthorHTML = templates.authorLink(linkHTMLData);

    /* insert HTML of all the links into the author wrapper */
    authorWrapper.innerHTML = linkAuthorHTML;

    /* [NEW] check if this link is NOT already in allAuthors */
    if (allAuthors.indexOf(articleAuthor) == -1) {
      /* [NEW] add generated code to allAuthors array */
      allAuthors.push(articleAuthor);
    }
  }

  for (let author of allAuthors) {
    /* generate HTML of the link */
    allAuthorsData.authors.push({
      author,
    });
  }

  /* [NEW] find list of authors in right column */
  const authorsList = document.querySelector(optAuthorsListSelector);
  authorsList.innerHTML = templates.authorListLink(allAuthorsData);
  console.log(allAuthorsData, 'allAuthorsData');
}

generateAuthors();

function authorClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  console.log('Tag was clicked!');

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  console.log('href', href);

  /* make a new constant "author" and extract tag from the "href" constant */
  const author = href.replace('#author-', '');
  console.log('author extracted', author);

  /* find all author links with class active */
  const authorLinks = document.querySelectorAll('a.active[href^="#author-"]');
  console.log(authorLinks);
  /* START LOOP: for each active tag link */
  for (const authorLink of authorLinks) {
    /* remove class active */
    authorLink.classList.remove('active');

    /* END LOOP: for each active tag link */
  }

  /* find all author links with "href" attribute equal to the "href" constant */
  const authorLinksWithHref = document.querySelectorAll(
    'a[href="' + href + '"]'
  );

  /* START LOOP: for each found author link */
  for (const authorLink of authorLinksWithHref) {
    /* add class active */
    authorLink.classList.add('active');
    /* END LOOP: for each found author link */
  }

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors() {
  /* find all links to authors */
  const linksToAuthors = document.querySelectorAll('a[href^="#author-"]');
  console.log(linksToAuthors);
  /* START LOOP: for each link */
  for (const linksToAuthor of linksToAuthors) {
    /* add tagClickHandler as event listener for that link */
    linksToAuthor.addEventListener('click', authorClickHandler);
    /* END LOOP: for each link */
  }
}

addClickListenersToAuthors();

function calculateTagsParams(tags) {
  const params = {
    min: 999999,
    max: 0,
  };

  for (let tag in tags) {
    params.max = Math.max(tags[tag], params.max);
    params.min = Math.min(tags[tag], params.min);

    console.log(tag + ' is used ' + tags[tag] + ' times');
  }

  return params;
}
