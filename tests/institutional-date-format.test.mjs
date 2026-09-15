import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

const file=path.resolve('src/documentEngine/pagination.ts');
const module={exports:{}};
const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const require=name=>{
  if(name==='./responsibleDisplay') return {getActivityResponsibleDisplayLabel:()=>''};
  throw new Error(`Dependencia inesperada: ${name}`);
};
vm.runInNewContext(`(function(require,module,exports){${code}\n})`,{})(require,module,module.exports);

const {formatInstitutionalCalendarDate}=module.exports;
process.env.TZ='America/Guayaquil';
assert.equal(formatInstitutionalCalendarDate('2026-09-02'),'02/09/2026');
assert.equal(formatInstitutionalCalendarDate('2026-12-31'),'31/12/2026');
assert.equal(formatInstitutionalCalendarDate('2026-01-05'),'05/01/2026');
assert.equal(formatInstitutionalCalendarDate(''),'');
assert.equal(formatInstitutionalCalendarDate(undefined),'');
assert.equal(formatInstitutionalCalendarDate('15 de septiembre de 2026'),'15 de septiembre de 2026');
assert.equal(formatInstitutionalCalendarDate('02/09/2026'),'02/09/2026');
assert.equal(formatInstitutionalCalendarDate('fecha-2026-09-02'),'fecha-2026-09-02');
assert.equal(formatInstitutionalCalendarDate('2026-13-02'),'2026-13-02');
console.log('PASS: fechas civiles ISO se presentan DD/MM/YYYY sin Date, desfase de zona horaria ni corrupción de otros textos.');
