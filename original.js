async function cheat() {

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
    

};

function stopCheat() {
    rodando = false;
}

async function avanco() {
    let verifytest = isTestOnScreen();

    while (verifytest == null) {
        if (verifytest != null) {
            break;
        } else {
            await aguardar(300);
            callnexbutton();
            verifytest = isTestOnScreen();


            console.log(verifytest);

        };
    };
    await aguardar(3000)
}


function getQuestion() {
    const question = document.querySelector('.question-quiz-text').innerHTML;
    console.log(question);
    return question;
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
    nextButton.click();
};


function isTestOnScreen() {
    let teste = document.querySelector('.md-dialog-container md-dialog[aria-label="Teste "]');
    return teste;
};

async function askgemini(question, answerList) {
    const apiKey = userAPI;
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
        console.log(respostaIA);
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
    const closeButton = document.querySelector('button[aria-label=" Fechar"][ng-click="close()"]');
    console.log(closeButton);
    closeButton.click();
};

function selectCorrectAnswer(AIresponse) {
    const correctbutton = document.querySelectorAll('md-radio-button.choice-radio-button[aria-label=" Resposta correta"]');

    correctbutton[AIresponse - 1].click();
}

