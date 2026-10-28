// This script patches the minified style.css line 1 to fix modal scroll
import fs from 'fs';
const path = './src/style.css';
let css = fs.readFileSync(path, 'utf8');

// Fix modal: ensure display:flex;flex-direction:column and proper height
// Current: .modal{...max-height:min(90vh,900px);display:flex;flex-direction:column...}
// modal-body: overflow:auto; min-height:300px  -> change to flex:1;overflow-y:auto;
css = css.replace(
  '.modal-body{overflow:auto;padding:27px 30px 30px;min-height:300px}',
  '.modal-body{overflow-y:auto;flex:1;padding:27px 30px 30px;min-height:0}'
);

// Also make sure .modal has display:flex;flex-direction:column (it should already)
// If not present, add it
if (!css.includes('flex-direction:column;background:#fffefa')) {
  css = css.replace(
    '.modal{width:min(720px,100%);max-height:min(90vh,900px);display:flex;flex-direction:column;background:#fffefa',
    '.modal{width:min(720px,100%);max-height:min(90vh,900px);display:flex;flex-direction:column;background:#fffefa'
  );
}

fs.writeFileSync(path, css, 'utf8');
console.log('Done patching modal-body scroll');

