/**
 * Painel e código original em um único arquivo.
 * O botão Iniciar chama MainHandler(). Logs originais no console.
 * As funções originais estão abaixo, preservando fluxo, seletores e esperas.
 * Única adaptação interna: askgemini lê a chave do campo do painel.
 * As marcações de Markdown do texto recebido foram removidas.
 * Para interromper, recarregue a página: o código original não tem cancelamento.
 * Execute este arquivo no contexto da página de leitura.
 */
(() => {
  'use strict';
  const id = 'books-automation-panel';
  const existing = document.getElementById(id);
  if (existing) { existing.scrollIntoView({ block: 'nearest' }); return; }
  const host = document.createElement('div');
  host.id = id;
  host.style.cssText = 'position:fixed;top:20px;right:20px;z-index:2147483647';
  const root = host.attachShadow({ mode: 'open' });
  root.innerHTML = `
    <style>
      :host{all:initial}*{box-sizing:border-box}section{width:min(350px,calc(100vw - 24px));font:14px/1.5 system-ui,sans-serif;color:#e9eefb;background:#141b2d;border:1px solid #35415b;border-radius:16px;box-shadow:0 18px 60px #0006;overflow:hidden}
      header{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:#1e2942;cursor:move;touch-action:none}h2{margin:0;font-size:16px}main{padding:16px}label{display:block;margin:10px 0 5px;color:#bdc9df;font-size:12px}input{width:100%;padding:10px;border-radius:8px;border:1px solid #46516b;background:#0e1525;color:#fff;font:inherit}button{border:0;border-radius:8px;padding:10px 13px;font:600 13px system-ui;cursor:pointer;background:#33415c;color:#fff}button:disabled{opacity:.45;cursor:default}header button{padding:4px 9px}nav{display:flex;gap:8px;margin-top:15px}#start{background:#6c5ce7;flex:1}#stop{background:#923f53;flex:1}progress{width:100%;height:10px;accent-color:#8f83ff}#status{margin:12px 0 4px}#log{height:135px;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;background:#0e1525;border-radius:8px;padding:10px;font:12px/1.5 ui-monospace,monospace}small{display:block;color:#aab7ce;font-size:11px;margin-top:8px}
    </style>
    <section aria-label="Automatizador de leitura">
      <header><h2>Automatizador</h2><button id="close" aria-label="Fechar painel">×</button></header>
      <main>
        <label for="key">Chave da API Gemini</label><input id="key" type="password" autocomplete="off" placeholder="Cole uma nova chave">
        <small>A chave fica apenas neste painel e é enviada à API do Google. Perguntas e alternativas também serão enviadas.</small>
        <div id="status" role="status">Pronto para iniciar</div><progress id="progress" max="100" value="0"></progress>
        <nav><button id="start">Iniciar</button></nav>
        <small>Iniciar executa MainHandler(). Para interromper a execução, recarregue a página.</small>
        <pre id="log" aria-label="Registro de atividades"></pre>
      </main>
    </section>`;
  document.documentElement.appendChild(host);
  const $ = (s) => root.querySelector(s);

async function MainHandler() {
let percent = getReadPercent();
while (percent != "100%") {
percent = getReadPercent();
console.log(percent);
await cheat();
}
}

async function cheat() {
await aguardar(2000)
await avanco();
let AIresponse = await askgemini(getQuestion(), getAnswer());
console.log(AIresponse);
selectCorrectAnswer(AIresponse);
await aguardar(300);
finishTest();
await aguardar(2000);
sendTest();
await aguardar(2000);
closeTest();
return console.log("finalizado");
}

function getReadPercent() {
let percent = document.querySelector(".pageNumber").textContent;
return percent;
}

async function avanco() {
let verifytest = isTestOnScreen();
console.log(verifytest);
let loop = true;
while (loop) {
if (verifytest == null) {
if (getReadPercent == "100%") { break; }
await aguardar(700);
verifytest = isTestOnScreen();
await aguardar(300);
callnexbutton();
} else {
loop = false;
    }
}
return "femboys";
}

function getQuestion() {
try {
    const question = document.querySelector('.question-quiz-text').innerHTML;
    return question;
} catch (error) {
    const question1 = document.querySelector('.quiz-text').innerHTML;
    return question1;
}
};

function getAnswer() {
const answer = document.querySelectorAll('span.choice-student');
console.log(answer);
let answerList = "";
for (let i = 0; i < 4; i++) {
const text = answer[i].textContent;
answerList += `opcao: ${i + 1} - ${text} \n`;
}
console.log(answerList);
return answerList;
};

function aguardar(ms) {
return new Promise(resolve => setTimeout(resolve, ms));
};

function callnexbutton() {
const nextButton = document.querySelector('button[ng-click="goToNextPage()"]');
const nextButton1 = document.querySelector('div[ng-click="getNextPage()"]');
if (nextButton == null) {
    nextButton1.click();
} else { nextButton.click(); }
};

function isTestOnScreen() {
let teste = document.querySelector('.md-dialog-container md-dialog[aria-label="Teste "]');
let teste1 = document.querySelector('.md-dialog-container md-dialog[aria-label="Test"]');
return teste || teste1;
};

async function askgemini(question, answerList) {
const apiKey = $('#key').value;
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`;
const prompt = `Responda apenas com o número (1-4) da alternativa correta.\nQ: ${question}\nOpções:\n${answerList}, responda apenas com o numero, nao coloque mais nada, caso voce por mais algo a ferramenta vai quebrar`;

try {
    const resposta = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [{ text: prompt }],
                },
            ],
        }),
    });

    const dados = await resposta.json();
    const respostaIA = dados.candidates[0].content.parts[0].text;
    console.log("resposta da IA: " + respostaIA);
    return respostaIA;
} catch (erro) {
    console.error(
        "ERRO, talvez o gemini tenha caido ou bem provavelmente tu ficou sem token :/",
    );
}
};

function finishTest() {
const finishButton = document.querySelector('button[ng-click="finish()"]')
finishButton.click();
};

function sendTest() {
const sendTestButton = document.querySelector('button[ng-click="sendAnswer()"]')
sendTestButton.click();
}

function closeTest() {
const closeButton = document.querySelector('.md-dialog-container .md-transition-in .md-toolbar-tools button[ng-click="close()"]');
console.log(closeButton);
closeButton.click();
};

function selectCorrectAnswer(AIresponse) {
const correctbutton = document.querySelectorAll('md-radio-button.choice-radio-button[ng-value="answerIndex($index)"]');
correctbutton[AIresponse - 1].click();
}


  let running = false;
  $('#start').onclick = async () => {
    if (running) return;
    if (!$('#key').value.trim()) {
      $('#status').textContent = 'Preencha a chave da API.';
      return;
    }
    running = true;
    $('#start').disabled = true;
    $('#key').disabled = true;
    $('#close').disabled = true;
    $('#status').textContent = 'Executando MainHandler()…';
    $('#log').textContent = 'Código original em execução. Os logs continuam no console do navegador.';
    // Apenas observa o progresso para exibir no painel; não controla o script.
    const monitor = setInterval(() => {
      const text = document.querySelector('.pageNumber')?.textContent || '';
      const value = Number.parseFloat(text.replace(',', '.'));
      if (Number.isFinite(value)) $('#progress').value = value;
    }, 1000);
    try {
      await MainHandler();
      $('#status').textContent = 'MainHandler() terminou.';
    } catch (error) {
      $('#status').textContent = 'Execução encerrada com erro.';
      $('#log').textContent = error?.message || String(error);
      console.error(error);
    } finally {
      clearInterval(monitor);
      running = false;
      $('#start').disabled = false;
      $('#key').disabled = false;
      $('#close').disabled = false;
    }
  };
  $('#close').onclick = () => { if (!running) { $('#key').value = ''; host.remove(); } };
  const header = root.querySelector('header');
  header.onpointerdown = (event) => {
    if (event.target.closest('button')) return;
    const rect = host.getBoundingClientRect();
    const dx = event.clientX - rect.left, dy = event.clientY - rect.top;
    header.setPointerCapture(event.pointerId);
    header.onpointermove = (e) => {
      host.style.right = 'auto';
      host.style.left = Math.max(0, Math.min(innerWidth - host.offsetWidth, e.clientX - dx)) + 'px';
      host.style.top = Math.max(0, Math.min(innerHeight - 50, e.clientY - dy)) + 'px';
    };
    header.onpointerup = header.onpointercancel = () => { header.onpointermove = null; };
  };
})();
