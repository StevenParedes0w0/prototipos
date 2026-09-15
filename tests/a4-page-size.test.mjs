import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

const cache=new Map();
function load(file){
  file=path.resolve(file);if(cache.has(file))return cache.get(file);
  const module={exports:{}};cache.set(file,module.exports);
  const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
  const require=name=>load(path.resolve(path.dirname(file),name+'.ts'));
  vm.runInNewContext(`(function(require,module,exports){${code}\n})`,{structuredClone})(require,module,module.exports);return module.exports;
}
const {composeArtifactPages,PAGE_SIZE_A4}=load('src/documentEngine/pagination.ts');
const stages=[{id:'author',stageName:'Elaboración',actorName:'Andrea',actorCargo:'Docente',actorRole:'docente',estado:'PENDIENTE',actionLabel:'ELABORADO_POR'}];
const base={id:'a',formalVersion:'1.0',reviewRound:1,pageCount:0,generatedAt:'14/09/2026 10:00',generatedBy:'Andrea',grupo:'Unidad',carrera:'Software',periodo:'2026',unidadAcademica:'FISEI',elaborador:{nombre:'Andrea',cargo:'Docente',email:''},tieneAnexos:'no',anexos:[],signatures:[],historialCambios:[]};
const t1={...base,documentType:'PLAN_TRABAJO',justificacion:'Justificación',objetivo:'Objetivo',matriz:[{id:1,nombre:'Actividad',desde:'2026-09-01',hasta:'2026-09-02',responsables:['Andrea'],recursos:['Equipo'],medios:['Informe']}],templateConfiguration:{sectionOrder:['general','justification','objective','matrix','annexes','signatures','history'],activeSectionIds:['general','justification','objective','matrix','annexes','signatures','history'],capturedAt:'hoy'}};
const t2={...base,documentType:'INFORME',informeData:{informeOrigen:'DERIVADO_PLAN',antecedentes:'Antecedentes',actividadesInforme:[{id:1,actividad:'Actividad',mediosVerificacion:'Informe',porcentajeEjecucion:100,observaciones:''}],conclusiones:'Conclusiones',oportunidadesMejora:'Oportunidades',aplicaRegistroContactos:false},templateConfiguration:{sectionOrder:['general','background','development','conclusions','opportunities','contacts','annexes','signatures','history'],activeSectionIds:['general','background','development','conclusions','opportunities','contacts','annexes','signatures','history'],capturedAt:'hoy'}};
const t1Pages=composeArtifactPages(t1,stages);const t2Pages=composeArtifactPages(t2,stages);
assert.equal(JSON.stringify(PAGE_SIZE_A4.portrait),JSON.stringify({widthMm:210,heightMm:297,widthPx:794,heightPx:1123}));
assert.equal(JSON.stringify(PAGE_SIZE_A4.landscape),JSON.stringify({widthMm:297,heightMm:210,widthPx:1123,heightPx:794}));
assert.equal(t1Pages.find(page=>page.contentSections?.includes('matrix')).orientation,'landscape');
assert.ok(t1Pages.filter(page=>page.orientation==='portrait').length>0);
assert.ok(t2Pages.every(page=>page.orientation==='portrait'||page.orientation==='landscape'));
console.log('PASS: T1 y T2 usan A4 portrait/landscape y la matriz T1 conserva A4 horizontal.');
