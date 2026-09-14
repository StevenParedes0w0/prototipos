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
const {useDocumentEngine,normalizeInformeTitle}=load('src/documentEngine/useDocumentEngine.ts');
const {buildDocumentPages}=load('src/documentEngine/pagination.ts');
const {emptySignatureCredential,demoSignatureCredential,canSubmitSignatureCredential}=load('src/documentEngine/signatureCredential.ts');
const {findPlanByIdentity}=load('src/documentEngine/documentIdentity.ts');
const {documentInconsistencies}=load('src/documentEngine/invariants.ts');
const {T1_FOOTER_TEXT,T1_FORMAT_TEXT,t1FooterStyle,t1CoverStyle,t1CoverMainBlockStyle}=load('src/documentEngine/t1Layout.ts');
const {getResponsibleDisplayLabel}=load('src/documentEngine/responsibleDisplay.ts');
const {parseFechaDMY,estadoActividadDesdeMedios}=load('src/modulo5/useActividadesState.ts');
const {esResponsableDeActividad}=load('src/modulo6/useSeguimientoState.ts');
function engine(){cursor=0;return useDocumentEngine();}
function doc(id){return engine().documents.find(d=>d.id===id);}
let e=engine();
const controlDocumentId=e.documents[0].id;
const controlDocumentSnapshot=JSON.stringify(doc(controlDocumentId));
const plan=e.crearNuevoDocumento('PLAN_TRABAJO',{grupo:'Unidad de Titulación — escenario de prueba'});
const matrix=Array.from({length:25},(_,id)=>({id,nombre:`Actividad ${id}`,desde:'2026-09-10',hasta:'2026-09-11',responsables:['Andrea'],recursos:['Recurso propio'],medios:['Medio propio']}));
const data={justificacion:'Justificación editable',objetivo:'Objetivo',matriz:matrix,tieneAnexos:'no',anexos:[],fuente:'Fuente editable'};
e.generarArtefacto(plan.id,data);
assert.ok(doc(plan.id).currentArtifact.pages.length >= 7);
const planSignaturePage=doc(plan.id).currentArtifact.signatureSlots[0].pageNumber;
assert.ok(planSignaturePage <= doc(plan.id).currentArtifact.pages.length);
const demoCredential=demoSignatureCredential('Ing. Andrea Pérez, Mg.');
assert.equal(canSubmitSignatureCredential(demoCredential,true,true),false,'B: DEMO sin confirmación se rechaza');
demoCredential.confirmed=true;
assert.equal(canSubmitSignatureCredential(demoCredential,true,true),true,'A: credencial DEMO válida');
e.firmarComoElaborador(plan.id,demoCredential.fileName,`Página ${planSignaturePage}`,'demo');
assert.equal(doc(plan.id).documentState,'EN REVISIÓN','A: firmar y finalizar envía automáticamente a revisión');
assert.equal(doc(plan.id).currentArtifact.signatures.length,1,'A: Andrea firma y queda una firma canónica');
assert.equal(doc(plan.id).currentArtifact.signatures[0].isDemo,true);
assert.equal(e.firmarComoElaborador(plan.id,demoCredential.fileName,'','demo'),false,'F: no ofrece una segunda firma');
assert.equal(e.enviarARevision(plan.id),false,'B: no admite un segundo envío después de la transición automática');
const finalized=doc(plan.id).currentArtifact.elaborationFinalizedAt;
assert.equal(finalized,"07/09/2026");
clockDate="2026-09-10T15:00:00.000Z";
assert.equal(doc(plan.id).currentArtifact.historialCambios[0].fecha,finalized);
const signed=JSON.stringify(doc(plan.id).currentArtifact);
e.generarArtefacto(plan.id,{...data,objetivo:'No debe sobrescribirse'});
assert.equal(JSON.stringify(doc(plan.id).currentArtifact),signed);
const anchor={pageNumber:3,x:.1,y:.2,width:.3,height:.1};
e.simularSesionDemo('usr-carlos-02','Ing. Carlos López, Mg.');
assert.equal(doc(plan.id).documentState,'EN REVISIÓN','C: abrir/cambiar a Carlos conserva el estado');
assert.equal(doc(plan.id).currentArtifact.signatures.length,1,'C: Carlos recibe el mismo artefacto firmado');
assert.equal(doc(plan.id).flowStages.find(s=>s.actorRole==='docente').estado,'FIRMADO','C: elaboración sigue completada');
assert.equal(documentInconsistencies(doc(plan.id)).length,0,'C: el estado canónico enviado satisface las invariantes');
const impossibleReview=structuredClone(doc(plan.id));
impossibleReview.currentArtifact.signatures=[];
assert.ok(documentInconsistencies(impossibleReview).some(issue=>issue.includes('sin la firma')),'guarda: detecta revisión sin firma del elaborador');
e.agregarObservacion(plan.id,3,'Revisar redacción','Objetivo','seccion','Ing. Carlos López, Mg.',anchor);
assert.equal(JSON.stringify(doc(plan.id).currentArtifact),signed);
assert.equal(doc(plan.id).observations[0].anchor.x,.1);
assert.equal(doc(plan.id).observations.length,1,'D: la observación se agrega al documento canónico');
assert.equal(doc(plan.id).observations[0].artifactId,doc(plan.id).currentArtifact.id,'D: la observación referencia el artefacto exacto');
assert.equal(doc(plan.id).observations.length,1,'E: navegar de página no crea ni pierde observaciones');
e.seleccionarDocumento(controlDocumentId);
e.seleccionarDocumento(plan.id);
assert.equal(doc(plan.id).observations.length,1,'F: salir y reabrir conserva la observación');
slots.length=0;
e=engine();
assert.equal(doc(plan.id).observations.length,1,'F: recargar desde localStorage conserva la observación canónica');
e.simularSesionDemo('usr-andrea-01','Ing. Andrea Pérez, Mg.');
e.simularSesionDemo('usr-carlos-02','Ing. Carlos López, Mg.');
assert.equal(doc(plan.id).observations.length,1,'G: cambiar la sesión conserva la observación');
e.devolverDocumento(plan.id,'Ing. Carlos López, Mg.','Corregir objetivo');
assert.equal(doc(plan.id).documentState,'EN CORRECCIÓN','H: devolver habilita corrección sin volver a borrador');
assert.equal(doc(plan.id).formalVersion,'1.0','J: la devolución conserva la versión formal');
assert.equal(doc(plan.id).reviewRound,1,'K: la devolución conserva la ronda actual');
assert.equal(doc(plan.id).artifactHistory.length,1,'L: el artefacto firmado queda disponible en historial al devolver');
assert.equal(JSON.stringify(doc(plan.id).artifactHistory[0]),signed,'L: el artefacto histórico es inmutable e idéntico al firmado');
e.simularSesionDemo('usr-andrea-01','Ing. Andrea Pérez, Mg.');
e.iniciarCorreccion(plan.id);
assert.equal(doc(plan.id).observations[0].texto,'Revisar redacción','I: Andrea ve exactamente la observación de Carlos');
e.resolverObservacion(plan.id,doc(plan.id).observations[0].id);
e.prepararNuevaRonda(plan.id);
assert.equal(doc(plan.id).reviewRound,2,'M: terminar la corrección inicia la ronda 2');
assert.equal(doc(plan.id).formalVersion,'1.0','M: la ronda 2 conserva la versión formal');
assert.equal(doc(plan.id).artifactHistory.length,1);
assert.equal(JSON.stringify(doc(plan.id).artifactHistory[0]),signed);
assert.equal(doc(plan.id).observations[0].estado,'historica','N: observaciones de ronda 1 quedan históricas');
assert.equal(doc(plan.id).observations[0].status,'HISTORICAL','N: observaciones históricas no quedan activas');
assert.equal(doc(plan.id).currentArtifact.signatures.length,0,'O: firmas de ronda 1 no cuentan en ronda 2');
e.generarArtefacto(plan.id,data);
assert.equal(doc(plan.id).currentArtifact.historialCambios[0].descripcion,'Elaboración del Plan de Trabajo');
e.firmarComoElaborador(plan.id,'demo.p12',`Página ${doc(plan.id).currentArtifact.signatureSlots[0].pageNumber}`,'demo');
assert.equal(doc(plan.id).currentArtifact.elaborationFinalizedAt,finalized);
assert.equal(doc(plan.id).reviewRound,2,'M: reenviar conserva la ronda 2 preparada');
assert.equal(doc(plan.id).formalVersion,'1.0','M: reenviar no incrementa la versión formal');
assert.equal(doc(plan.id).observations.filter(o=>o.estado==='activa'&&o.ronda===2).length,0,'N: la ronda 1 no bloquea el reenvío');
e.simularSesionDemo('usr-carlos-02','Ing. Carlos López, Mg.');
e.aprobarYFirmarRevisor(plan.id,'Ing. Carlos López, Mg.','Revisor','Página 9');
assert.equal(doc(plan.id).documentState,'EN VALIDACIÓN FINAL');
e.simularSesionDemo('usr-patricia-03','Ing. Patricia Salazar, Mg.');
e.validarYFirmarFinal(plan.id,'Ing. Patricia Salazar, Mg.','Coordinadora','Página 9');
assert.equal(doc(plan.id).documentState,'VALIDADO');
assert.equal(doc(plan.id).operationalState,'EN EJECUCIÓN');
assert.equal(doc(plan.id).currentArtifact.signatures.length,3);
assert.equal(JSON.stringify(doc(controlDocumentId)),controlDocumentSnapshot,'P: el flujo completo no modifica otro documento');
const planSnapshot=JSON.stringify(doc(plan.id));
e.simularSesionDemo('usr-andrea-01','Ing. Andrea Pérez, Mg.');
const report=e.crearNuevoDocumento('INFORME',{grupo:plan.grupo,documentoRelacionadoId:plan.id});
e.generarArtefactoInforme(report.id,{titulo:'INFORME DE: Seguimiento',grupo:plan.grupo,periodo:plan.periodo,informeOrigen:'DERIVADO_PLAN',relatedPlanId:plan.id,antecedentes:'Antecedentes',actividadesInforme:matrix.map(a=>({id:a.id,actividad:a.nombre,mediosVerificacion:a.medios.join(', '),porcentajeEjecucion:85,observaciones:''})),conclusiones:'Conclusiones',oportunidadesMejora:'Mejoras',aplicaRegistroContactos:false,tieneAnexos:'no',anexos:[]});
e.firmarComoElaborador(report.id,'demo.p12',`Página ${doc(report.id).currentArtifact.signatureSlots[0].pageNumber}`,'demo');
assert.equal(doc(report.id).documentState,'EN REVISIÓN');
assert.equal(doc(report.id).documentState,'EN REVISIÓN');
assert.equal(doc(report.id).currentArtifact.informeData.actividadesInforme.length,25);
assert.equal(JSON.stringify(doc(plan.id)),planSnapshot);
assert.equal(doc(report.id).currentArtifact.titulo,'SEGUIMIENTO');
assert.equal(normalizeInformeTitle('INFORME DE: INFORME DE seguimiento'),'SEGUIMIENTO','normaliza títulos legacy sin duplicar el rótulo T2');
assert.ok(doc(report.id).currentArtifact.pages.length >= 5);
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
assert.equal(e.firmarComoElaborador(organizationPlan.id,'demo.p12','','demo'),false,'C: otro actor no firma');
assert.equal(doc(organizationPlan.id).currentArtifact.signatures.length,0,'otra sesión no firma por el elaborador');
e.simularSesionDemo('usr-andrea-01','Ing. Andrea Pérez, Mg.');
e.firmarComoElaborador(organizationPlan.id,'demo.p12','','demo');
assert.equal(e.firmarComoElaborador(organizationPlan.id,'demo.p12','','demo'),false,'D/F: etapa ya firmada no admite firma');
e.aprobarSinFirma(organizationPlan.id,'registration');
assert.equal(doc(organizationPlan.id).documentState,'VALIDADO');
assert.equal(doc(organizationPlan.id).currentArtifact.signatures.length,1);
const immutable=JSON.stringify(doc(organizationPlan.id));
e.configurarFlujoDocumento(organizationPlan.id,[]);
assert.equal(JSON.stringify(doc(organizationPlan.id)),immutable,'no cambiar flujo de un documento finalizado');
console.log('PASS: flujo por documento, etapa sin firma personal, identidad del elaborador y flujo finalizado inmutable.');

e.simularSesionDemo('usr-andrea-01','Ing. Andrea Pérez, Mg.');
const parallel=e.crearNuevoDocumento('PLAN_TRABAJO',{teacherId:'usr-andrea-01',groupId:'parallel-group',periodId:'parallel-period',grupo:'Unidad de Titulación — revisores paralelos',periodo:'Julio – Diciembre 2026'});
const parallelStages=[
  {...doc(plan.id).flowStages[0],id:'parallel-author',actorId:'usr-andrea-01',actorName:'Ing. Andrea Pérez, Mg.',estado:'PENDIENTE',signature:undefined},
  {...doc(plan.id).flowStages[1],id:'parallel-a',actorId:'usr-carlos-02',actorName:'Ing. Carlos López, Mg.',approvalGroup:'parallel-review',approvalRule:'TODOS DEBEN APROBAR',estado:'PENDIENTE',signature:undefined},
  {...doc(plan.id).flowStages[1],id:'parallel-b',actorId:'usr-roberto-04',actorName:'Ing. Roberto Vega, Mg.',approvalGroup:'parallel-review',approvalRule:'TODOS DEBEN APROBAR',estado:'PENDIENTE',signature:undefined},
  {...doc(plan.id).flowStages[2],id:'parallel-final',actorId:'usr-patricia-03',actorName:'Ing. Patricia Salazar, Mg.',approvalGroup:'parallel-final',estado:'PENDIENTE',signature:undefined},
];
e.configurarFlujoDocumento(parallel.id,parallelStages);
e.generarArtefacto(parallel.id,data);
e.firmarComoElaborador(parallel.id,'demo.p12','','demo');
assert.equal(doc(parallel.id).flowStages.filter(s=>s.estado==='EN_CURSO').length,2,'revisores obligatorios se activan en paralelo');
e.simularSesionDemo('usr-carlos-02','Ing. Carlos López, Mg.');
e.aprobarYFirmarRevisor(parallel.id,'Ing. Carlos López, Mg.');
assert.equal(doc(parallel.id).documentState,'EN REVISIÓN','un revisor no completa la etapa paralela');
e.simularSesionDemo('usr-roberto-04','Ing. Roberto Vega, Mg.');
e.aprobarYFirmarRevisor(parallel.id,'Ing. Roberto Vega, Mg.');
assert.equal(doc(parallel.id).documentState,'EN VALIDACIÓN FINAL','la siguiente etapa inicia tras aprobar todos');
console.log('PASS: revisores paralelos y avance secuencial.');

const resetCredential=emptySignatureCredential();
assert.equal(resetCredential.password,'');
assert.equal(resetCredential.fileName,'');
assert.equal(resetCredential.hasManualFile,false,'E: el estado temporal queda limpio');

e.simularSesionDemo('usr-andrea-01','Ing. Andrea Pérez, Mg.');
const incomplete=e.crearNuevoDocumento('PLAN_TRABAJO',{grupo:'Club Académico de Software — sin flujo'});
e.configurarFlujoDocumento(incomplete.id,[{...doc(plan.id).flowStages[0],estado:'PENDIENTE',signature:undefined},{id:'pending',actorName:'Responsable pendiente de configuración',actorCargo:'',actorRole:'revisor',stageName:'Etapa pendiente de configuración',estado:'PENDIENTE',actionMode:'SIGN_AND_APPROVE'}]);
e.generarArtefacto(incomplete.id,data);
const beforeOther=JSON.stringify(doc(report.id));
assert.equal(e.firmarComoElaborador(incomplete.id,'demo.p12','','demo'),false,'G: flujo incompleto bloquea la firma normal');
assert.notEqual(doc(incomplete.id).documentState,'EN REVISIÓN','G: nunca pasa a revisión sin siguiente etapa');
assert.equal(JSON.stringify(doc(report.id)),beforeOther,'H: firmar un documento no modifica otro');
console.log('PASS: casos A-H de firma DEMO, identidad, etapa, limpieza, flujo incompleto y aislamiento.');

const identityEngine=engine();
const occupied={teacherId:'usr-andrea-01',groupId:'grp-2',periodId:'per-1'};
assert.ok(findPlanByIdentity(identityEngine.documents,occupied),'bloquea Andrea + Comisión de Eventos Académicos + Jul–Dic 2026');
const occupiedCount=identityEngine.documents.length;
identityEngine.crearNuevoDocumento('PLAN_TRABAJO',{...occupied,grupo:'Comisión de Eventos Académicos',periodo:'Julio – Diciembre 2026'});
assert.equal(engine().documents.length,occupiedCount,'no crea un segundo Plan para la identidad exacta');
const freeUnit=identityEngine.crearNuevoDocumento('PLAN_TRABAJO',{teacherId:'usr-andrea-01',groupId:'grp-1',periodId:'per-1',grupo:'Unidad de Titulación',periodo:'Julio – Diciembre 2026'});
assert.equal(freeUnit.groupId,'grp-1','permite Unidad + Jul–Dic cuando está libre');
const freeHistorical=identityEngine.crearNuevoDocumento('PLAN_TRABAJO',{teacherId:'usr-andrea-01',groupId:'grp-1',periodId:'per-2',grupo:'Unidad de Titulación',periodo:'Enero – Junio 2026'});
assert.equal(freeHistorical.periodId,'per-2','permite Unidad + Ene–Jun cuando está libre');
const reportOnly=identityEngine.crearNuevoDocumento('INFORME',{teacherId:'usr-andrea-01',groupId:'grp-4',periodId:'per-1',grupo:'Comisión de Vinculación con la Sociedad',periodo:'Julio – Diciembre 2026'});
const planAfterReport=identityEngine.crearNuevoDocumento('PLAN_TRABAJO',{teacherId:'usr-andrea-01',groupId:'grp-4',periodId:'per-1',grupo:'Comisión de Vinculación con la Sociedad',periodo:'Julio – Diciembre 2026'});
assert.notEqual(reportOnly.id,planAfterReport.id,'un Informe T2 no ocupa la identidad de un Plan T1');
assert.ok(findPlanByIdentity(engine().documents,{teacherId:'usr-andrea-01',groupId:'grp-1',periodId:'per-1'}),'la combinación creada queda ocupada');
identityEngine.restablecerDemo();
assert.equal(findPlanByIdentity(engine().documents,{teacherId:'usr-andrea-01',groupId:'grp-1',periodId:'per-1'}),undefined,'reset elimina Planes creados durante la sesión');
assert.ok(!findPlanByIdentity(engine().documents,{teacherId:'usr-andrea-01',groupId:'grp-1',periodId:'per-1'}),'el dataset canónico conserva una combinación libre');

assert.equal(T1_FOOTER_TEXT,'Documento de uso interno controlado por la Universidad Técnica de Ambato');
assert.equal(T1_FORMAT_TEXT,'Formato Nº: UTA-SGC-A-2-1-P7-T1');
assert.equal(t1FooterStyle.borderTop,undefined,'el footer T1 no dibuja línea superior');
assert.equal(t1FooterStyle.whiteSpace,'nowrap','el footer T1 permanece en una fila');
assert.equal(t1CoverStyle.justifyContent,undefined,'la portada no empuja el bloque central hacia el borde inferior');
assert.equal(t1CoverMainBlockStyle.margin,'0 auto');
const canonicalPlan=engine().documents.find(d=>d.id==='doc-plan-titulacion-2026');
assert.equal(canonicalPlan.currentArtifact.pageCount,canonicalPlan.currentArtifact.pages.length,'pageCount deriva de pages.length');
assert.deepEqual(canonicalPlan.currentArtifact.signatureSlots.map(s=>s.pageNumber),canonicalPlan.currentArtifact.pages.flatMap((p,i)=>(p.signatureSlots||[]).map(()=>i+1)),'signatureSlots derivan de las páginas compuestas');
const planStates=engine().documents.filter(d=>d.documentType==='PLAN_TRABAJO').map(d=>d.documentState);
for(const required of ['BORRADOR','EN REVISIÓN','EN CORRECCIÓN','VALIDADO'])assert.ok(planStates.includes(required),`dataset DEMO incluye ${required}`);
assert.equal(parseFechaDMY('2026-09-18').getHours(),23,'las fechas ISO de matriz conservan el límite 23:59');
const twoMedia={id:'evi-test',nombre:'Actividad',categoria:'POA',tipo:'opcional',planNombre:'Plan',grupo:'Unidad',periodo:'Período',desde:'2026-09-01',hasta:'2026-09-18',fechaLimiteExacta:'2026-09-18 — 23:59',responsables:['Nombre visible'],responsableIds:['usr-owner'],recursos:[],estado:'EN CURSO',medios:[{id:'a',nombre:'Acta',estado:'PENDIENTE DE VALIDACIÓN',archivoVigente:{nombre:'a.pdf',tamano:'1 MB',fechaCarga:'hoy',cargadoPor:'Nombre visible'},historialVersiones:[]},{id:'b',nombre:'Informe',estado:'PENDIENTE',historialVersiones:[]}]};
assert.equal(estadoActividadDesdeMedios(twoMedia),'EN CURSO','un medio faltante mantiene la actividad incompleta');
twoMedia.medios[1].archivoVigente={nombre:'b.pdf',tamano:'1 MB',fechaCarga:'hoy',cargadoPor:'Nombre visible'};
assert.equal(estadoActividadDesdeMedios(twoMedia),'EVIDENCIAS COMPLETAS','cada medio con un PDF completa documentalmente');
assert.equal(esResponsableDeActividad({id:'usr-owner',nombre:'Otro nombre'},twoMedia),true,'permisos de evidencia usan ID responsable');
assert.equal(esResponsableDeActividad({id:'usr-other',nombre:'Nombre visible'},twoMedia),false,'el ID prevalece sobre coincidencias de nombre');
console.log('PASS: unicidad por IDs, reset DEMO, combinación libre, footer T1, portada y metadata dinámica.');

const allIds=['a','b','c'];
assert.equal(getResponsibleDisplayLabel({groupType:'Comisión',selectedResponsibleIds:allIds,allGroupMemberIds:allIds,selectedResponsibleNames:['Andrea','Carlos','Patricia']}),'Responsable de la comisión');
assert.equal(getResponsibleDisplayLabel({groupType:'Unidad',selectedResponsibleIds:allIds,allGroupMemberIds:allIds,selectedResponsibleNames:['Andrea','Carlos','Patricia']}),'Responsable de la unidad');
assert.equal(getResponsibleDisplayLabel({groupType:'Club',selectedResponsibleIds:allIds,allGroupMemberIds:allIds,selectedResponsibleNames:['Andrea','Carlos','Patricia']}),'Responsable del club');
assert.equal(getResponsibleDisplayLabel({groupType:'Otro',selectedResponsibleIds:allIds,allGroupMemberIds:allIds,selectedResponsibleNames:['Andrea','Carlos','Patricia']}),'Responsable del grupo');
assert.equal(getResponsibleDisplayLabel({groupType:'Unidad',selectedResponsibleIds:['a','b'],allGroupMemberIds:allIds,selectedResponsibleNames:['Andrea','Carlos']}),'Andrea, Carlos');
console.log('PASS: denominación colectiva central, responsables parciales e historial inicial T1.');
