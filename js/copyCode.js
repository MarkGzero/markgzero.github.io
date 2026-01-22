// https://www.aleksandrhovhannisyan.com/blog/jekyll-copy-to-clipboard/
// // This assumes that you're using Rouge; if not, update the selector
const codeBlocks = document.querySelectorAll('.code-header + .highlighter-rouge');
const copyCodeButtons = document.querySelectorAll('.copy-code-button');

// Auto-detect and set language for all code headers
document.addEventListener('DOMContentLoaded', function() {
  const headers = document.querySelectorAll('.code-header[data-language="code"]');
  headers.forEach(function(header) {
    const codeBlock = header.nextElementSibling;
    if (codeBlock && codeBlock.classList.contains('highlighter-rouge')) {
      const pre = codeBlock.querySelector('pre');
      if (pre) {
        const code = pre.querySelector('code');
        if (code) {
          const classes = code.className.split(' ');
          for (let i = 0; i < classes.length; i++) {
            if (classes[i].startsWith('language-')) {
              const lang = classes[i].replace('language-', '');
              header.setAttribute('data-language', lang);
              break;
            }
          }
        }
      }
    }
  });
});

document.querySelectorAll('.copy-code-button').forEach((button) => {
  button.addEventListener('click', () => {
    // Find the next code block after the header
    const codeBlock = button.closest('.code-header').nextElementSibling;
    if (!codeBlock) return;
    const code = codeBlock.innerText;

    window.navigator.clipboard.writeText(code);

    const original = button.querySelector('.copy-label').innerText;
    button.querySelector('.copy-label').innerText = 'Copied!';
    button.classList.add('copied');

    setTimeout(() => {
      button.querySelector('.copy-label').innerText = original;
      button.classList.remove('copied');
    }, 2000);
  });
});