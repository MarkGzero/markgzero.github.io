// https://www.aleksandrhovhannisyan.com/blog/jekyll-copy-to-clipboard/
// // This assumes that you're using Rouge; if not, update the selector
const codeBlocks = document.querySelectorAll('.code-header + .highlighter-rouge');
const copyCodeButtons = document.querySelectorAll('.copy-code-button');

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