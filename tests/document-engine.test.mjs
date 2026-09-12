import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

// Exercise real engine callbacks without a browser or additional dependencies.
const slots = [];
let cursor = 0;
const react = {
  useState(initial) { const i=cursor++; if (!(i in slots)) slots[i]=typeof initial==='function'?initial():initial; return [slots[i],value => {slots[i]=typeof value==='function'?value(slots[i]):value;}]; },
  useRef(initial) { const i=cursor++; if (!(i in slots)) slots[i]={current:initial}; return slots[i]; },
  useCallback: fn => fn,
  useEffect() {},
};
const storage=new Map();
const localStorage={getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)};
let clockDate='2026-09-07T15:00:00.000Z';
class TestDate extends Date { constructor(...args){super(...(args.length?args:[clockDate]));} static now(){return Date.now();} }
const cache=new Map();
function load(file) {
  file=path.resolve(file);
  if(cache.has(file))return cache.get(file);
  const module={exports:{}}; cache.set(file,module.exports);
  const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  const require=name=>name==='react'?react:load(path.resolve(path.dirname(file),name+'.ts'));
  vm.runInNewContext(`(function(require,module,exports){${code}\n})`,{console,localStorage,Date:TestDate,structuredClone})(require,module,module.exports);
  return module.exports;
}
const {useDocumentEngine}=load('src/documentEngine/useDocumentEngine.ts');
const {buildDocumentPages}=load('src/documentEngine/pagination.ts');
function engine(){cursor=0;return useDocumentEngine();}
function doc(id){return engine().documents.find(d=>d.id===id);}
const e=engine();
const plan=e.crearNuevoDocumento('PLAN_TRABAJO',{grupo:'Unidad de Titulación'});
const matrix=Array.from({length:25},(_,id)=>({id,nombre:`Actividad ${id}`,desde:'2026-09-10',hasta:'2026-09-11',responsables:['Andrea'],recursos:['Recurso propio'],medios:['Medio propio']}));
const data={justificacion:'Justificación editable',objetivo:'Objetivo',matriz:matrix,tieneAnexos:'no',anexos:[],fuente:'Fuente editable'};
e.generarArtefacto(plan.id,data);
assert.equal(doc(plan.id).currentArtifact.pages.length,9);
assert.equal(doc(plan.id).currentArtifact.signatureSlots[0].pageNumber,9);
e.firmarComoElaborador(plan.id,'demo.p12','Página 9');
assert.equal(doc(plan.id).documentState,'EN REVISIÓN');
const finalized=doc(plan.id).currentArtifact.elaborationFinalizedAt;
assert.equal(finalized,"07/09/2026");
clockDate="2026-09-10T15:00:00.000Z";
assert.equal(doc(plan.id).currentArtifact.historialCambios[0].fecha,finalized);
const signed=JSON.stringify(doc(plan.id).currentArtifact);
e.generarArtefacto(plan.id,{...data,objetivo:'No debe sobrescribirse'});
assert.equal(JSON.stringify(doc(plan.id).currentArtifact),signed);
const anchor={pageNumber:3,x:.1,y:.2,width:.3,height:.1};
e.simularSesionDemo('usr-carlos-02','Ing. Carlos López, Mg.');
e.agregarObservacion(plan.id,3,'Revisar redacción','Objetivo','seccion','Ing. Carlos López, Mg.',anchor);
assert.equal(JSON.stringify(doc(plan.id).currentArtifact),signed);
assert.equal(doc(plan.id).observations[0].anchor.x,.1);
e.devolverDocumento(plan.id,'Ing. Carlos López, Mg.','Corregir objetivo');
e.simularSesionDemo('usr-andrea-01','Ing. Andrea Pérez, Mg.');
e.iniciarCorreccion(plan.id);
e.resolverObservacion(plan.id,doc(plan.id).observations[0].id);
e.prepararNuevaRonda(plan.id);
assert.equal(doc(plan.id).reviewRound,2);
assert.equal(doc(plan.id).formalVersion,'1.0');
assert.equal(doc(plan.id).artifactHistory.length,1);
assert.equal(JSON.stringify(doc(plan.id).artifactHistory[0]),signed);
assert.equal(doc(plan.id).observations[0].estado,'historica');
e.generarArtefacto(plan.id,data);
e.firmarComoElaborador(plan.id,'demo.p12','Página 9');
assert.equal(doc(plan.id).currentArtifact.elaborationFinalizedAt,finalized);
e.simularSesionDemo('usr-carlos-02','Ing. Carlos López, Mg.');
e.aprobarYFirmarRevisor(plan.id,'Ing. Carlos López, Mg.','Revisor','Página 9');
assert.equal(doc(plan.id).documentState,'EN VALIDACIÓN FINAL');
e.simularSesionDemo('usr-patricia-03','Ing. Patricia Salazar, Mg.');
e.validarYFirmarFinal(plan.id,'Ing. Patricia Salazar, Mg.','Coordinadora','Página 9');
assert.equal(doc(plan.id).documentState,'VALIDADO');
assert.equal(doc(plan.id).operationalState,'EN EJECUCIÓN');
assert.equal(doc(plan.id).currentArtifact.signatures.length,3);
const planSnapshot=JSON.stringify(doc(plan.id));
const report=e.crearNuevoDocumento('INFORME',{grupo:plan.grupo,documentoRelacionadoId:plan.id});
e.generarArtefactoInforme(report.id,{titulo:'INFORME DE: Seguimiento',grupo:plan.grupo,periodo:plan.periodo,informeOrigen:'DERIVADO_PLAN',relatedPlanId:plan.id,antecedentes:'Antecedentes',actividadesInforme:matrix.map(a=>({id:a.id,actividad:a.nombre,mediosVerificacion:a.medios.join(', '),porcentajeEjecucion:85,observaciones:''})),conclusiones:'Conclusiones',oportunidadesMejora:'Mejoras',aplicaRegistroContactos:false,tieneAnexos:'no',anexos:[]});
e.simularSesionDemo('usr-andrea-01','Ing. Andrea Pérez, Mg.');
e.firmarComoElaborador(report.id,'demo.p12','Página 8');
assert.equal(doc(report.id).documentState,'EN REVISIÓN');
assert.equal(doc(report.id).currentArtifact.informeData.actividadesInforme.length,25);
assert.equal(JSON.stringify(doc(plan.id)),planSnapshot);
assert.equal(doc(report.id).currentArtifact.titulo,'SEGUIMIENTO');
assert.equal(doc(report.id).currentArtifact.pages.length,9);
for(const n of [0,1,6,7,25,60]) {
 const pages=buildDocumentPages('PLAN_TRABAJO',n,doc(plan.id).flowStages);
 assert.equal(pages.length,4+Math.max(1,Math.ceil(n/6)));
}
console.log('PASS: finalización, fecha estable, aislamiento T1/T2, artefacto inmutable, ancla, devolución, corrección, ronda, historial, revisión, validación y paginación N.');

// An organization can register approval without an invented personal signature.
e.simularSesionDemo('usr-andrea-01','Ing. Andrea Pérez, Mg.');
const organizationPlan=e.crearNuevoDocumento('PLAN_TRABAJO',{grupo:'Club DEMO'});
const stages=[{...doc(plan.id).flowStages[0],estado:'PENDIENTE',signature:undefined}, {id:'registration',actorName:'Órgano configurado DEMO',actorCargo:'',actorRole:'validador',stageName:'Registro',estado:'PENDIENTE',actionMode:'APPROVE_ONLY'}];
e.configurarFlujoDocumento(organizationPlan.id,stages);
e.generarArtefacto(organizationPlan.id,data);
assert.equal(doc(organizationPlan.id).currentArtifact.signatureSlots.length,1);
e.simularSesionDemo('usr-carlos-02','Ing. Carlos López, Mg.');
e.firmarComoElaborador(organizationPlan.id,'demo.p12');
assert.equal(doc(organizationPlan.id).currentArtifact.signatures.length,0,'otra sesión no firma por el elaborador');
e.simularSesionDemo('usr-andrea-01','Ing. Andrea Pérez, Mg.');
e.firmarComoElaborador(organizationPlan.id,'demo.p12');
e.aprobarSinFirma(organizationPlan.id,'registration');
assert.equal(doc(organizationPlan.id).documentState,'VALIDADO');
assert.equal(doc(organizationPlan.id).currentArtifact.signatures.length,1);
const immutable=JSON.stringify(doc(organizationPlan.id));
e.configurarFlujoDocumento(organizationPlan.id,[]);
assert.equal(JSON.stringify(doc(organizationPlan.id)),immutable,'no cambiar flujo de un documento finalizado');
console.log('PASS: flujo por documento, etapa sin firma personal, identidad del elaborador y flujo finalizado inmutable.');
