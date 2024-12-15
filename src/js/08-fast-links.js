'use strict';

// document.body.addEventListener('click', ev => {
//   const { target } = ev;

//   if (isLocalLink(target)) {
//     ev.preventDefault();

//     return loadPage(target.href);
//   }
// });

/**
 *
 * @param {HTMLAnchorElement} linkElement
 * @returns {boolean}
 */
const isLocalLink = linkElement => {
  if (linkElement?.tagName !== 'A') return false;

  try {
    const url = new URL(linkElement.href);
    const [sameOrigin, sameHost, samePath] = [
      url.origin === window.location.origin,
      url.hostname === window.location.hostname,
      url.pathname === window.location.pathname
    ];

    return sameOrigin && sameHost && !samePath;
  } catch (e) {
    return false;
  }
};

const loadPage = async href => {
  const url = new URL(href);
  const response = await fetch(url, {
    headers: { 'Content-Type': 'text/html' }
  });

  if (response.ok) {
    const blob = await response.blob();
    const text = await blob.text();
    const html = Document.parseHTMLUnsafe(text);
    const bodyElement = html.documentElement;
    const title = html.querySelector('title').innerText;

    document.documentElement.innerHTML = bodyElement.innerHTML;
    document.title = title;

    history.pushState({ title, href }, '', url);
  } else {
    window.location.href = href;
  }
};
