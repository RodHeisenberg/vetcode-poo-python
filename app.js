(() => {
  'use strict';
  const STORAGE = 'vetcode-poo-v1';
  const steps = [
    { title: 'Ler os requisitos', time: '4 min' },
    { title: 'Planejar as classes', time: '4 min' },
    { title: 'Criar a classe Dono', time: '8 min' },
    { title: 'Criar a classe Animal', time: '12 min' },
    { title: 'Instanciar e testar', time: '6 min' },
    { title: 'Revisar o raciocínio', time: '3 min' },
    { title: 'Executar no Colab', time: '3 min' }
  ];
  const starters = {
    codeDono: `class Dono:\n    def __init__(self, nome, telefone, endereco):\n        # TODO: salve os três atributos usando self\n        pass\n\n    def descrever(self):\n        # TODO: retorne uma frase com nome, telefone e endereço\n        pass`,
    codeAnimal: `class Animal:\n    def __init__(self, nome, especie, idade, peso, dono):\n        # TODO: salve nome, especie, idade e dono\n        pass\n        self.peso = peso\n\n    @property\n    def peso(self):\n        # TODO: retorne self.__peso\n        pass\n\n    @peso.setter\n    def peso(self, novo_peso):\n        # TODO: se novo_peso <= 0, lance ValueError\n        # TODO: caso válido, atualize self.__peso\n        pass\n\n    def descrever(self):\n        # TODO: retorne dados do animal e nome do dono\n        pass`,
    codeTeste: `# Crie um dono usando Dono(...).\n\n# Crie dois animais usando Animal(...), vinculados ao dono.\n\n# Mostre as informações com print(...descrever()).\n\n# Atualize o peso do primeiro animal pela propriedade .peso.\n\n# Imprima novamente para confirmar a atualização.`
  };
  const initial = { current: 0, completed: [], answers: {}, code: {...starters}, tested: [false,false,false,false], extraUnlocked: false };
  let state;
  try { state = {...initial,...JSON.parse(localStorage.getItem(STORAGE)||'{}')}; }
  catch { state = {...initial}; }
  if (!Array.isArray(state.completed)) state.completed = [];
  if (!state.answers) state.answers = {};
  if (!state.code) state.code = {...starters};
  state.code = {...starters,...state.code};
  if (!Array.isArray(state.tested)) state.tested = [false,false,false,false];
  let current = Math.max(0,Math.min(6,Number(state.current)||0));
  const $ = (id) => document.getElementById(id);
  const save = () => { try { localStorage.setItem(STORAGE,JSON.stringify(state)); } catch {} };
  const clean = (code) => code.split('\n').map(line => line.replace(/#.*$/,'')).join('\n');
  const hasPass = code => /^\s*pass\s*$/m.test(clean(code));
  const codeError = (...reqs) => reqs.find(([regex]) => !regex.test(reqs.target || ''));
  const item = (regex,message,code) => regex.test(code) ? null : message;
  const codeDonoCheck = (source) => {
    const c = clean(source);
    return [
      item(/class\s+Dono\s*:/,'Mantenham a classe Dono.',c),
      item(/def\s+__init__\s*\(\s*self\s*,\s*nome\s*,\s*telefone\s*,\s*endereco\s*\)/,'O construtor deve receber nome, telefone e endereco.',c),
      item(/self\.nome\s*=\s*nome\b/,'Falta atribuir self.nome = nome.',c),
      item(/self\.telefone\s*=\s*telefone\b/,'Falta atribuir self.telefone = telefone.',c),
      item(/self\.endereco\s*=\s*endereco\b/,'Falta atribuir self.endereco = endereco.',c),
      item(/def\s+descrever\s*\(\s*self\s*\)/,'Criem o método descrever(self).',c),
      item(/\breturn\b/,'O método deve retornar uma frase usando return.',c),
      hasPass(source)?'Removam os comandos pass restantes.':null
    ].find(Boolean) || null;
  };
  const codeAnimalCheck = (source) => {
    const c = clean(source);
    return [
      item(/class\s+Animal\s*:/,'Mantenham a classe Animal.',c),
      item(/def\s+__init__\s*\(\s*self\s*,\s*nome\s*,\s*especie\s*,\s*idade\s*,\s*peso\s*,\s*dono\s*\)/,'O construtor deve receber nome, especie, idade, peso e dono.',c),
      item(/self\.nome\s*=\s*nome\b/,'Falta salvar self.nome.',c),
      item(/self\.especie\s*=\s*especie\b/,'Falta salvar self.especie.',c),
      item(/self\.idade\s*=\s*idade\b/,'Falta salvar self.idade.',c),
      item(/self\.dono\s*=\s*dono\b/,'Falta a associação self.dono = dono.',c),
      item(/self\.peso\s*=\s*peso\b/,'No construtor, use self.peso = peso para validar o valor inicial.',c),
      item(/@property\s*\n\s*def\s+peso\s*\(\s*self\s*\)/,'Falta o getter @property para peso.',c),
      item(/\breturn\s+self\.__peso\b/,'O getter deve retornar self.__peso.',c),
      item(/@peso\.setter\s*\n\s*def\s+peso\s*\(\s*self\s*,\s*novo_peso\s*\)/,'Falta o setter @peso.setter.',c),
      item(/if\s+novo_peso\s*<=\s*0\s*:/,'O setter precisa testar se novo_peso <= 0.',c),
      item(/raise\s+ValueError\s*\(/,'Use raise ValueError(...) para peso inválido.',c),
      item(/self\.__peso\s*=\s*novo_peso\b/,'O setter deve salvar self.__peso = novo_peso.',c),
      item(/def\s+descrever\s*\(\s*self\s*\)/,'Criem o método descrever(self).',c),
      item(/\breturn\b[\s\S]*?self\.dono\.(?:nome|descrever)\b/,'No método descrever(), incluam self.dono.nome (ou self.dono.descrever()).',c),
      hasPass(source)?'Removam os comandos pass restantes.':null
    ].find(Boolean) || null;
  };
  const codeTesteCheck = (source) => {
    const c = clean(source);
    return [
      item(/\bDono\s*\(/,'Criem um objeto com Dono(...).',c),
      (c.match(/\bAnimal\s*\(/g)||[]).length < 2 ? 'Criem dois objetos com Animal(...).' : null,
      item(/\bprint\s*\(/,'Mostrem os resultados com print(...).',c),
      item(/\.descrever\s*\(/,'Chamem o método descrever() dos objetos.',c),
      item(/\w+\.peso\s*=/,'Atualizem o peso de um animal usando .peso = novo_valor.',c),
      hasPass(source)?'Removam os comandos pass restantes.':null
    ].find(Boolean) || null;
  };
  const testBlock = `# ============================================================\n# VERIFICAÇÕES ADICIONAIS (fornecidas pelo laboratório)\n# ============================================================\nprint("\\n--- TESTES AUTOMÁTICOS ---")\n_dono_teste = Dono("Pessoa Teste", "47999990000", "Endereço Teste")\n_animal_teste = Animal("Paciente Teste", "Gato", 2, 3.5, _dono_teste)\nassert _animal_teste.dono is _dono_teste, "Associação animal/dono falhou"\nassert _animal_teste.peso == 3.5, "Peso inicial incorreto"\n_animal_teste.peso = 4.0\nassert _animal_teste.peso == 4.0, "Atualização do peso falhou"\nassert isinstance(_animal_teste.descrever(), str), "descrever() precisa retornar texto"\ntry:\n    _animal_teste.peso = 0\nexcept ValueError:\n    print("OK: peso inválido bloqueado por ValueError")\nelse:\n    raise AssertionError("Peso zero deveria gerar ValueError")\nprint("OK: associação, peso, atualização e retorno do método")`;
  function compiled() { return '# VetCode | Laboratório de POO\n# Código desenvolvido pela equipe\n\n'+state.code.codeDono.trim()+'\n\n\n'+state.code.codeAnimal.trim()+'\n\n\n'+state.code.codeTeste.trim()+'\n\n\n'+testBlock+'\n'; }
  function saveVisible() {
    const editor = $('stepContent').querySelector('textarea.code-editor:not([readonly])');
    if (editor) state.code[editor.id] = editor.value;
    if (current===0) state.answers.step1 = [...$('stepContent').querySelectorAll('.choices input:checked')].map(x=>x.value);
    if (current===1 || current===5) {
      const q = current===1 ? ['q2a','q2b','q2c'] : ['q6a','q6b','q6c'];
      q.forEach(k=> {state.answers[k] = $('stepContent').querySelector(`input[name="${k}"]:checked`)?.value || '';});
    }
    if (current===6) state.tested = [1,2,3,4].map(i=>$('test'+i)?.checked||false);
    state.current=current; save();
  }
  function restoreInputs() {
    if(current===0) (state.answers.step1||[]).forEach(v=> {const node=$('stepContent').querySelector(`input[value="${v}"]`);if(node)node.checked=true;});
    if(current===1||current===5){ (current===1?['q2a','q2b','q2c']:['q6a','q6b','q6c']).forEach(k=>{let node=[...$('stepContent').querySelectorAll(`input[name="${k}"]`)].find(n=>n.value===state.answers[k]);if(node)node.checked=true;}); }
    const editor = $('stepContent').querySelector('textarea.code-editor:not([readonly])');
    if(editor) editor.value = state.code[editor.id];
    if (current===6) {
      [1,2,3,4].forEach(i=>$('test'+i).checked=!!state.tested[i-1]);
      if (state.extraUnlocked) $('extraBox').classList.remove('hidden');
    }
  }
  function refreshNav() {
    const doneCount=state.completed.length, pct=Math.round(doneCount/7*100);
    $('progressPercent').textContent=pct+'%'; $('progressFill').style.width=pct+'%';
    $('progressBar').setAttribute('aria-valuenow',String(pct));
    const maxReached=Math.min(6, Math.max(current, ...state.completed.map(i=>i+1),0));
    $('stepsNav').innerHTML=steps.map((s,i)=>`<button type="button" class="step-nav ${current===i?'active':''} ${state.completed.includes(i)?'done':''}" data-step="${i}" ${i>maxReached?'disabled':''}><span class="step-circle">${state.completed.includes(i)?'✓':String(i+1).padStart(2,'0')}</span><span>${s.title}</span></button>`).join('');
    $('stepsNav').querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>{saveVisible();render(Number(b.dataset.step));}));
  }
  function render(n) {
    current=n; state.current=n; save();
    $('stepContent').replaceChildren($('step'+(n+1)).content.cloneNode(true));
    $('stepNumber').textContent=`ETAPA ${String(n+1).padStart(2,'0')} / 07`;
    $('stepTime').textContent=steps[n].time;
    $('backBtn').classList.toggle('hidden',n===0);
    $('checkBtn').classList.toggle('hidden',n===6||state.completed.includes(n));
    $('nextBtn').classList.toggle('hidden',n===6||!state.completed.includes(n));
    $('feedback').textContent=''; $('feedback').classList.remove('success');
    restoreInputs();
    $('stepContent').querySelectorAll('input,textarea').forEach(el=>el.addEventListener('change',saveVisible));
    $('stepContent').querySelectorAll('textarea.code-editor:not([readonly])').forEach(el=>{
      el.addEventListener('input',saveVisible);
      el.addEventListener('keydown',e=> { if(e.key==='Tab'){e.preventDefault();const a=el.selectionStart,b=el.selectionEnd;el.value=el.value.slice(0,a)+'    '+el.value.slice(b);el.selectionStart=el.selectionEnd=a+4;saveVisible();} });
    });
    $('stepContent').querySelectorAll('[data-hint]').forEach(btn=>btn.addEventListener('click',()=>$(btn.dataset.hint).classList.toggle('hidden')));
    if(n===6) setupFinal();
    refreshNav();
  }
  function validate(n) {
    if (n===0) {
      const a=state.answers.step1||[], expected=['animal','dono','relacao','relatorio'];
      return a.length===4 && expected.every(x=>a.includes(x)) ? null : 'Revisem os requisitos. Há quatro opções corretas e uma fora do escopo.';
    }
    if (n===1) return state.answers.q2a==='classes' && state.answers.q2b==='objeto' && state.answers.q2c==='acao' ? null : 'Conversem novamente sobre a diferença entre classe, objeto e método.';
    if (n===2) return codeDonoCheck(state.code.codeDono);
    if (n===3) return codeAnimalCheck(state.code.codeAnimal);
    if (n===4) return codeTesteCheck(state.code.codeTeste);
    if (n===5) return state.answers.q6a==='relacao'&&state.answers.q6b==='validar'&&state.answers.q6c==='retornar' ? null : 'Uma ou mais respostas precisam de revisão. Expliquem o porquê antes de tentar de novo.';
    return null;
  }
  function passed() {
    if(!state.completed.includes(current)) state.completed.push(current);
    $('feedback').textContent='Etapa conferida!';$('feedback').classList.add('success');
    $('checkBtn').classList.add('hidden');if(current<6)$('nextBtn').classList.remove('hidden');
    save();refreshNav();
  }
  $('checkBtn').addEventListener('click',()=>{
    saveVisible();const err=validate(current);if(err){$('feedback').textContent=err;$('feedback').classList.remove('success');return;}passed();
  });
  $('nextBtn').addEventListener('click',()=>{if(current<6){saveVisible();render(current+1);}});
  $('backBtn').addEventListener('click',()=>{if(current>0){saveVisible();render(current-1);}});
  $('resetBtn').addEventListener('click',()=>{
    if(confirm('Apagar o progresso e os códigos salvos neste navegador?')){state={...initial,answers:{},code:{...starters},completed:[],tested:[false,false,false,false]};render(0);}
  });
  function setupFinal() {
    const ready=()=>{
      const issues=[codeDonoCheck(state.code.codeDono),codeAnimalCheck(state.code.codeAnimal),codeTesteCheck(state.code.codeTeste)].filter(Boolean);
      if(issues.length){$('feedback').textContent='Revisem as etapas de código antes de exportar: '+issues[0];return false;}
      return true;
    };
    const build=()=>{if(!ready())return false;$('finalCode').value=compiled();$('copyBtn').disabled=false;$('downloadBtn').disabled=false;return true;};
    $('generateBtn').addEventListener('click',build);
    $('copyBtn').addEventListener('click',async()=>{
      if(!build())return;
      try {await navigator.clipboard.writeText(compiled());$('feedback').textContent='Código copiado.';$('feedback').classList.add('success');}
      catch { $('finalCode').focus();$('finalCode').select();$('feedback').textContent='Selecione o texto acima e copie manualmente (Ctrl+C).'; }
    });
    $('downloadBtn').addEventListener('click',()=>{
      if(!build())return;const blob=new Blob([compiled()],{type:'text/x-python;charset=utf-8'}),url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='clinica_vet.py';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);
    });
    $('unlockExtraBtn').addEventListener('click',()=>{
      saveVisible();if(!build())return;
      if(!state.tested.every(Boolean)){$('feedback').textContent='Confiram os quatro testes no Colab antes de abrir o extra.';return;}
      state.extraUnlocked=true;state.completed=Array.from(new Set([...state.completed,6]));save();$('extraBox').classList.remove('hidden');$('feedback').textContent='Desafio extra liberado.';$('feedback').classList.add('success');refreshNav();$('extraBox').scrollIntoView({behavior:'smooth',block:'start'});
    });
  }
  render(current);
})();
