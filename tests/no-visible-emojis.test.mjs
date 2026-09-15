import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const files=[];
function walk(directory){
  for(const entry of fs.readdirSync(directory,{withFileTypes:true})){
    const file=path.join(directory,entry.name);
    if(entry.isDirectory()) { if(entry.name!=='imports') walk(file); }
    else if(/\.(ts|tsx)$/.test(entry.name)) files.push(file);
  }
}
walk('src');
const findings=[];
for(const file of files){
  const matches=[...fs.readFileSync(file,'utf8').matchAll(/\p{Extended_Pictographic}/gu)].map(match=>match[0]).filter(character=>character!=='©');
  if(matches.length) findings.push(`${file}: ${[...new Set(matches)].join(' ')}`);
}
assert.deepEqual(findings,[],`No se permiten emojis como iconografía visible:\n${findings.join('\n')}`);
console.log(`PASS: ${files.length} archivos TS/TSX sin emojis visibles.`);
