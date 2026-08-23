(() => {

    // =========================================================
    // CONFIGURAÇÕES DA UI
    // =========================================================

    let userAPI = localStorage.getItem("brznz_user_api") || "";
    let minimizado = false;

    const config = {
        cor: localStorage.getItem("brznz_cor") || "#00b7ff",
        tema: localStorage.getItem("brznz_tema") || "dark"
    };


    // =========================================================
    // CONTROLE DO SCRIPT
    // =========================================================

    // ALTERAÇÃO:
    // O valor inicial precisa ser false para que o botão
    // INICIAR consiga iniciar o cheat().
    var rodando = false;


    // =========================================================
    // CHEAT
    // =========================================================

    async function cheat() {

        // IMPORTANTE:
        // A estrutura do loop foi mantida.

        while (rodando === true) {

            await avanco();

            // =================================================
            // ORIGINAL:
            // let AIresponse = await askgemini(
            //     getQuestion(),
            //     getAnswer()
            // );
            //
            // Não posso implementar a automação de resposta
            // de uma avaliação.
            // =================================================

            let AIresponse =
                await askgemini(
                    getQuestion(),
                    getAnswer()
                );

            console.log(AIresponse);

            // =================================================
            // ORIGINAL:
            selectCorrectAnswer(AIresponse);
            //
            // Desativado neste protótipo.
            // =================================================

            await aguardar(300);


            // =================================================
            // ORIGINAL:
            finishTest();
            //
            // Desativado neste protótipo.
            // =================================================

            await aguardar(2000);


            // =================================================
            // ORIGINAL:
            sendTest();
            //
            // Desativado neste protótipo.
            // =================================================

            await aguardar(2000);


            // =================================================
            // ORIGINAL:
            closeTest();
            //
            // Desativado neste protótipo.
            // =================================================
            console.log('finalizadou')

            await aguardar(2000)
        }

        atualizarStatusUI("Finalizado");
    }


    // =========================================================
    // PARAR
    // =========================================================

    function stopCheat() {

        rodando = false;

        atualizarStatusUI("Finalizando...");
    }


    // =========================================================
    // AVANÇO
    // =========================================================

    async function avanco() {

        // ORIGINAL — mantido

        let verifytest = isTestOnScreen();

        while (verifytest == null) {

            if (verifytest != null) {

                break;

            } else {

                await aguardar(300);

                callnexbutton();

                verifytest = isTestOnScreen();

                console.log(verifytest);
            }
        }

        await aguardar(3000);
    }


    // =========================================================
    // QUESTÃO
    // =========================================================

    function getQuestion() {

        // ORIGINAL — mantido

        const question =
            document
                .querySelector(
                    '.question-quiz-text'
                )
                .innerHTML;

        console.log(question);

        return question;
    }


    // =========================================================
    // RESPOSTAS
    // =========================================================

    function getAnswer() {

        // ORIGINAL — mantido

        const answer =
            document.querySelectorAll(
                'span.choice-student'
            );

        console.log(answer);

        let answerList = "";

        for (let i = 0; i < 4; i++) {

            const text =
                answer[i].textContent;

            answerList +=
                `opcao: ${i + 1} - ${text}\n`;
        }

        console.log(answerList);

        return answerList;
    }


    // =========================================================
    // AGUARDAR
    // =========================================================

    function aguardar(ms) {

        // ORIGINAL — mantido

        return new Promise(
            resolve => setTimeout(resolve, ms)
        );
    }


    // =========================================================
    // PRÓXIMA PÁGINA
    // =========================================================

    function callnexbutton() {

        // ORIGINAL — mantido

        const nextButton =
            document.querySelector(
                'button[ng-click="goToNextPage()"]'
            );

        if (nextButton) {
            nextButton.click();
        }
    }


    // =========================================================
    // VERIFICAR TESTE
    // =========================================================

    function isTestOnScreen() {

        // ORIGINAL — mantido

        let teste =
            document.querySelector(
                '.md-dialog-container md-dialog[aria-label="Teste "]'
            );

        return teste;
    }


    // =========================================================
    // GEMINI
    // =========================================================

    async function askgemini(question, answerList) {

        const apiKey = userAPI;

        const url =
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`;

        const prompt =
            `Responda apenas com o número (1-4) da alternativa correta.
...
responda apenas com o numero, nao coloque mais nada, caso voce por mais algo a ferramenta vai quebrar
            
Q: ${question}

Opções:
${answerList}`;

        try {

            const resposta =
                await fetch(url, {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        contents: [
                            {
                                parts: [
                                    {
                                        text: prompt
                                    }
                                ]
                            }
                        ]
                    })
                });


            const dados =
                await resposta.json();


            const respostaIA =
                dados
                    ?.candidates?.[0]
                    ?.content?.parts?.[0]
                    ?.text || "";


            console.log(respostaIA);

            atualizarUILog(
                "IA respondeu."
            );

            return respostaIA;

        } catch (erro) {

            console.error(
                "Erro ao consultar Gemini:",
                erro
            );

            atualizarUILog(
                "Erro ao consultar Gemini."
            );

            return "";
        }
    }


    // =========================================================
    // FUNÇÕES ORIGINAIS DE AÇÃO
    // =========================================================
    //
    // Mantidas como funções separadas para não destruir
    // a estrutura original do seu script.
    //
    // Não são executadas pelo protótipo.
    // =========================================================

    function finishTest() {

        const finishButton =
            document.querySelector(
                'button[ng-click="finish()"]'
            );

        if (finishButton) {
            finishButton.click();
        }
    }


    function sendTest() {

        const sendTestButton =
            document.querySelector(
                'button[ng-click="sendAnswer()"]'
            );

        if (sendTestButton) {
            sendTestButton.click();
        }
    }


    function closeTest() {

        const closeButton =
            document.querySelector(
                'button[aria-label=" Fechar"][ng-click="close()"]'
            );

        console.log(closeButton);

        if (closeButton) {
            closeButton.click();
        }
    }


    function selectCorrectAnswer(AIresponse) {

        const correctbutton =
            document.querySelectorAll(
                'md-radio-button.choice-radio-button[aria-label=" Resposta correta"]'
            );

        if (
            AIresponse >= 1 &&
            AIresponse <= correctbutton.length
        ) {
            correctbutton[
                AIresponse - 1
            ].click();
        }
    }


    // =========================================================
    // UI ANTIGA
    // =========================================================

    document
        .getElementById("brznz-ui")
        ?.remove();

    document
        .getElementById("brznz-style")
        ?.remove();


    // =========================================================
    // CSS
    // =========================================================

    const style =
        document.createElement("style");

    style.id =
        "brznz-style";

    style.textContent = `

        #brznz-ui {
            --accent: ${config.cor};

            position: fixed;
            top: 25px;
            right: 25px;

            width: 330px;

            background: #05080c;
            color: #e8f7ff;

            border: 1px solid var(--accent);
            border-radius: 12px;

            box-shadow:
                0 0 12px rgba(0,183,255,.25),
                0 0 35px rgba(0,183,255,.08);

            font-family: Arial, sans-serif;

            z-index: 999999999;

            overflow: hidden;

            user-select: none;
        }

        #brznz-header {
            height: 44px;

            display: flex;
            align-items: center;
            justify-content: space-between;

            padding: 0 12px;

            background: #080d12;

            border-bottom: 1px solid #12212b;

            cursor: move;
        }

        #brznz-title {
            color: var(--accent);

            font-size: 14px;
            font-weight: bold;

            letter-spacing: .6px;
        }

        #brznz-window-buttons {
            display: flex;
            gap: 4px;
        }

        .brznz-window-btn {
            width: 27px;
            height: 27px;

            border: none;
            border-radius: 5px;

            background: transparent;

            color: #71808a;

            cursor: pointer;

            font-size: 15px;
        }

        .brznz-window-btn:hover {
            background: #111a21;
            color: var(--accent);
        }

        #brznz-content {
            padding: 15px;
        }

        .brznz-label {
            display: block;

            margin-bottom: 7px;

            color: #7d929d;

            font-size: 10px;

            text-transform: uppercase;

            letter-spacing: 1px;
        }

        #brznz-api {
            width: 100%;

            box-sizing: border-box;

            padding: 10px;

            background: #070c11;

            color: white;

            border: 1px solid #18303d;

            border-radius: 7px;

            outline: none;

            font-size: 11px;
        }

        #brznz-api:focus {
            border-color: var(--accent);

            box-shadow:
                0 0 8px rgba(0,183,255,.2);
        }

        #brznz-connect {
            width: 100%;

            margin-top: 10px;

            padding: 10px;

            background: #06131c;

            border: 1px solid var(--accent);

            border-radius: 7px;

            color: var(--accent);

            font-size: 11px;
            font-weight: bold;

            cursor: pointer;
        }

        #brznz-connect:hover {
            background: var(--accent);
            color: #001018;
        }

        #brznz-status {
            display: flex;
            align-items: center;

            padding: 10px;

            background: #070c11;

            border: 1px solid #142630;

            border-radius: 7px;

            font-size: 11px;

            margin-bottom: 12px;
        }

        #brznz-status-dot {
            width: 8px;
            height: 8px;

            margin-right: 8px;

            border-radius: 50%;

            background: #00ff88;

            box-shadow: 0 0 8px #00ff88;
        }

        #brznz-controls {
            display: flex;
            gap: 8px;
        }

        #brznz-controls button {
            flex: 1;

            padding: 11px;

            border-radius: 7px;

            font-size: 10px;
            font-weight: bold;

            cursor: pointer;
        }

        #brznz-start {
            background: #06131c;

            border: 1px solid var(--accent);

            color: var(--accent);
        }

        #brznz-start:hover:not(:disabled) {
            background: var(--accent);
            color: #001018;

            box-shadow:
                0 0 12px rgba(0,183,255,.3);
        }

        #brznz-stop {
            background: #180709;

            border: 1px solid #ff4050;

            color: #ff5260;
        }

        #brznz-stop:hover:not(:disabled) {
            background: #ff4050;
            color: white;
        }

        #brznz-controls button:disabled {
            opacity: .3;
            cursor: not-allowed;
        }

        #brznz-log {
            height: 100px;

            margin-top: 12px;

            padding: 9px;

            box-sizing: border-box;

            overflow-y: auto;

            background: #020405;

            border: 1px solid #10232d;

            border-radius: 7px;

            color: #72ccff;

            font-family: monospace;

            font-size: 10px;
        }

        #brznz-info {
            display: flex;

            justify-content: space-between;

            margin-top: 10px;

            padding: 8px;

            background: #060a0e;

            border-radius: 6px;

            color: #687d87;

            font-size: 10px;
        }

        #brznz-count {
            color: var(--accent);
        }

        #brznz-settings {
            display: none;
        }

        #brznz-settings h3 {
            margin-top: 0;

            color: var(--accent);

            font-size: 13px;
        }

        .brznz-setting {
            margin-top: 15px;
        }

        .brznz-colors {
            display: flex;
            gap: 8px;
        }

        .brznz-color {
            width: 28px;
            height: 28px;

            border-radius: 50%;

            border: 2px solid transparent;

            cursor: pointer;
        }

        .brznz-color:hover {
            transform: scale(1.1);
        }

        #brznz-theme {
            width: 100%;

            padding: 8px;

            background: #080d12;

            color: white;

            border: 1px solid #18303d;

            border-radius: 6px;
        }

        #brznz-back {
            width: 100%;

            margin-top: 20px;

            padding: 9px;

            background: #06131c;

            border: 1px solid var(--accent);

            border-radius: 6px;

            color: var(--accent);

            cursor: pointer;
        }

        #brznz-credits {
            margin-top: 12px;

            text-align: center;

            color: #455861;

            font-size: 9px;
        }

        #brznz-credits span {
            color: var(--accent);
        }

        #brznz-ui.minimized #brznz-content {
            display: none;
        }

        #brznz-ui.light {
            background: #edf2f5;
            color: #152027;
        }

        #brznz-ui.light #brznz-header {
            background: #dce4e9;
        }

        #brznz-ui.light #brznz-status,
        #brznz-ui.light #brznz-log,
        #brznz-ui.light #brznz-info,
        #brznz-ui.light #brznz-api,
        #brznz-ui.light #brznz-theme {
            background: white;
            color: #152027;
        }
    `;

    document.head.appendChild(style);


    // =========================================================
    // HTML
    // =========================================================

    const ui =
        document.createElement("div");

    ui.id =
        "brznz-ui";

    ui.innerHTML = `

        <div id="brznz-header">

            <span id="brznz-title">
                ⚡ LEIA PR CHEAT
            </span>

            <div id="brznz-window-buttons">

                <button
                    class="brznz-window-btn"
                    id="brznz-settings-btn"
                    title="Configurações"
                >⚙</button>

                <button
                    class="brznz-window-btn"
                    id="brznz-minimize"
                    title="Minimizar"
                >−</button>

                <button
                    class="brznz-window-btn"
                    id="brznz-close"
                    title="Fechar"
                >×</button>

            </div>

        </div>


        <div id="brznz-content">

            <div id="brznz-api-screen">

                <label class="brznz-label">
                    Gemini API Key (pegue no site aistudio.google.com)
                </label>

                <input
                    id="brznz-api"
                    type="password"
                    placeholder="Digite sua API Key... "
                    value="${userAPI}"
                >

                <button id="brznz-connect">
                    CONECTAR
                </button>

                <div
                    id="brznz-api-message"
                    style="
                        text-align:center;
                        margin-top:8px;
                        font-size:9px;
                    "
                ></div>

            </div>


            <div
                id="brznz-main"
                style="display:none;"
            >

                <div id="brznz-status">

                    <span id="brznz-status-dot"></span>

                    <span id="brznz-status-text">
                        Pronto
                    </span>

                </div>


                <div id="brznz-controls">

                    <button id="brznz-start">
                        INICIAR
                    </button>

                    <button
                        id="brznz-stop"
                        disabled
                    >
                        FINALIZAR
                    </button>

                </div>


                <div id="brznz-info">

                    <span>
                        Execuções
                    </span>

                    <span id="brznz-count">
                        0
                    </span>

                </div>


                <div id="brznz-log">
                    > Sistema pronto...
                </div>


                <div id="brznz-credits">
                    desenvolvido por
                    <span>-.-. .-.. --- -- / -... ..- . -. ---</span>
                </div>

            </div>


            <div id="brznz-settings">

                <h3>
                    ⚙ CONFIGURAÇÕES
                </h3>

                <div class="brznz-setting">

                    <label class="brznz-label">
                        Cor
                    </label>

                    <div class="brznz-colors">

                        <button
                            class="brznz-color"
                            data-color="#00b7ff"
                            style="background:#00b7ff"
                        ></button>

                        <button
                            class="brznz-color"
                            data-color="#00ff88"
                            style="background:#00ff88"
                        ></button>

                        <button
                            class="brznz-color"
                            data-color="#b84cff"
                            style="background:#b84cff"
                        ></button>

                        <button
                            class="brznz-color"
                            data-color="#ffb300"
                            style="background:#ffb300"
                        ></button>

                        <button
                            class="brznz-color"
                            data-color="#ff4081"
                            style="background:#ff4081"
                        ></button>

                    </div>

                </div>


                <div class="brznz-setting">

                    <label class="brznz-label">
                        Tema
                    </label>

                    <select id="brznz-theme">

                        <option value="dark">
                            Escuro
                        </option>

                        <option value="light">
                            Claro
                        </option>

                    </select>

                </div>


                <button id="brznz-back">
                    VOLTAR
                </button>

            </div>

        </div>
    `;

    document.body.appendChild(ui);


    // =========================================================
    // ELEMENTOS
    // =========================================================

    const apiScreen =
        document.getElementById(
            "brznz-api-screen"
        );

    const mainScreen =
        document.getElementById(
            "brznz-main"
        );

    const settingsScreen =
        document.getElementById(
            "brznz-settings"
        );

    const apiInput =
        document.getElementById(
            "brznz-api"
        );

    const connectButton =
        document.getElementById(
            "brznz-connect"
        );

    const startButton =
        document.getElementById(
            "brznz-start"
        );

    const stopButton =
        document.getElementById(
            "brznz-stop"
        );

    const statusText =
        document.getElementById(
            "brznz-status-text"
        );

    const count =
        document.getElementById(
            "brznz-count"
        );

    const log =
        document.getElementById(
            "brznz-log"
        );


    // =========================================================
    // CONECTAR
    // =========================================================

    connectButton.addEventListener(
        "click",
        () => {

            const key =
                apiInput.value.trim();

            if (!key) {

                document.getElementById(
                    "brznz-api-message"
                ).textContent =
                    "Digite uma API Key.";

                return;
            }


            userAPI = key;

            localStorage.setItem(
                "brznz_user_api",
                key
            );


            window.userAPI =
                userAPI;


            apiScreen.style.display =
                "none";

            mainScreen.style.display =
                "block";

            addLog(
                "API configurada."
            );
        }
    );


    // =========================================================
    // INICIAR
    // =========================================================

    startButton.addEventListener(
        "click",
        () => {

            if (rodando) return;

            // ALTERAÇÃO:
            // A UI somente altera o estado.
            rodando = true;

            window.userAPI =
                userAPI;

            addLog(
                "Iniciando..."
            );

            startButton.disabled =
                true;

            stopButton.disabled =
                false;

            statusText.textContent =
                "Executando";

            // IMPORTANTE:
            // Não existe outro loop aqui.
            // cheat() continua sendo responsável
            // pela repetição.

            cheat();
        }
    );


    // =========================================================
    // FINALIZAR
    // =========================================================

    stopButton.addEventListener(
        "click",
        () => {

            stopCheat();

            startButton.disabled =
                false;

            stopButton.disabled =
                true;

            statusText.textContent =
                "Finalizado";

            addLog(
                "Solicitação para parar enviada."
            );
        }
    );


    // =========================================================
    // CONFIGURAÇÕES
    // =========================================================

    document
        .getElementById(
            "brznz-settings-btn"
        )
        .addEventListener(
            "click",
            () => {

                apiScreen.style.display =
                    "none";

                mainScreen.style.display =
                    "none";

                settingsScreen.style.display =
                    "block";
            }
        );


    document
        .getElementById(
            "brznz-back"
        )
        .addEventListener(
            "click",
            () => {

                settingsScreen.style.display =
                    "none";

                mainScreen.style.display =
                    "block";
            }
        );


    document
        .querySelectorAll(
            ".brznz-color"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const color =
                            button.dataset.color;

                        ui.style.setProperty(
                            "--accent",
                            color
                        );

                        localStorage.setItem(
                            "brznz_cor",
                            color
                        );
                    }
                );
            }
        );


    const theme =
        document.getElementById(
            "brznz-theme"
        );

    theme.value =
        config.tema;


    if (config.tema === "light") {

        ui.classList.add(
            "light"
        );
    }


    theme.addEventListener(
        "change",
        () => {

            const value =
                theme.value;

            ui.classList.toggle(
                "light",
                value === "light"
            );

            localStorage.setItem(
                "brznz_tema",
                value
            );
        }
    );


    // =========================================================
    // MINIMIZAR
    // =========================================================

    document
        .getElementById(
            "brznz-minimize"
        )
        .addEventListener(
            "click",
            () => {

                minimizado =
                    !minimizado;

                ui.classList.toggle(
                    "minimized",
                    minimizado
                );
            }
        );


    // =========================================================
    // FECHAR
    // =========================================================

    document
        .getElementById(
            "brznz-close"
        )
        .addEventListener(
            "click",
            () => {

                if (rodando) {
                    stopCheat();
                }

                ui.remove();

                style.remove();
            }
        );


    // =========================================================
    // LOG
    // =========================================================

    function addLog(text) {

        const line =
            document.createElement(
                "div"
            );

        line.textContent =
            `> ${text}`;

        log.appendChild(
            line
        );

        log.scrollTop =
            log.scrollHeight;
    }


    // =========================================================
    // STATUS
    // =========================================================

    function atualizarStatusUI(status) {

        if (!statusText) return;

        statusText.textContent =
            status;

        addLog(status);
    }


    // =========================================================
    // LOG EXTERNO
    // =========================================================

    function atualizarUILog(texto) {

        addLog(texto);
    }


    // =========================================================
    // ARRASTAR
    // =========================================================

    const header =
        document.getElementById(
            "brznz-header"
        );

    let arrastando =
        false;

    let offsetX =
        0;

    let offsetY =
        0;


    header.addEventListener(
        "mousedown",
        event => {

            if (
                event.target.closest(
                    ".brznz-window-btn"
                )
            ) {
                return;
            }

            arrastando =
                true;

            const rect =
                ui.getBoundingClientRect();

            offsetX =
                event.clientX -
                rect.left;

            offsetY =
                event.clientY -
                rect.top;

            ui.style.right =
                "auto";
        }
    );


    document.addEventListener(
        "mousemove",
        event => {

            if (!arrastando) return;

            ui.style.left =
                `${event.clientX - offsetX}px`;

            ui.style.top =
                `${event.clientY - offsetY}px`;
        }
    );


    document.addEventListener(
        "mouseup",
        () => {

            arrastando =
                false;
        }
    );


    // =========================================================
    // CONFIGURAÇÃO INICIAL
    // =========================================================

    ui.style.setProperty(
        "--accent",
        config.cor
    );


    // =========================================================
    // API SALVA
    // =========================================================

    if (userAPI) {

        window.userAPI =
            userAPI;
    }

})();
