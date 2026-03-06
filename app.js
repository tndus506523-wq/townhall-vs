// State Definitions
const STATES = {
    INIT: 0,
    INTRO_GREETING: 1,
    ASK_NAME: 2,
    INTRO_COMFORT: 3,
    Q1_COMFORT: 4,
    Q2_GROWTH: 5,
    Q3_RESOLUTION: 6,
    PRIZE_EP_ID: 7,
    OUTRO: 8
};

// Global Data Store
const surveyData = {
    name: '',
    epId: '誘몄엯??,
    comfortZoneChoice: '',
    q1Answer: '',
    q2Answer: '',
    q3Answer: ''
};

let currentState = STATES.INIT;

// DOM Elements
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const choiceContainer = document.getElementById('choice-input-container');
const dynamicInputContainer = document.getElementById('dynamic-input-container');
const sendButton = document.getElementById('send-button');

// Mock Data for EP Lookup
const mockEmployeeDB = {
    '12345': '?띻만??,
    '99999': '源?섏?',
    'admin': '愿由ъ옄'
};

// Progress Bar
function updateProgress(percentage) {
    const bar = document.getElementById('progress-bar');
    if (bar) {
        bar.style.width = percentage + '%';
    }
}

// Initialization
function initChat() {
    updateProgress(5);

    // System message style entry
    const sysMsgHTML = `<div class="system-message">VS援ъ꽦?먮떂???낆옣?섏뀲?듬땲??</div>`;
    chatMessages.insertAdjacentHTML('beforeend', sysMsgHTML);
    scrollToBottom();

    showTyping();
    setTimeout(() => {
        removeTyping();
        addBotMessage('Step out of your Comfort Zone, <strong>VS蹂몃? 援ъ꽦?먮떂!</strong>');

        showTyping();
        setTimeout(() => {
            removeTyping();
            addBotMessage('?몝 ?덈뀞?섏꽭?? ???VS蹂몃? ??댄? 誘명똿 ?뺣낫瑜??덈궡?대뱶由?<strong>"?섏씠"</strong>?먯슂!');

            setTimeout(() => {
                showChoices([
                    { text: '諛섍????섏씠! ?몝', value: 'hello' },
                    { text: '洹몃옒?????꾧뎔?? ??', value: 'who' }
                ], handleGreetingChoice);
                currentState = STATES.INTRO_GREETING;
            }, 500);
        }, 800);
    }, 600);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChat);
} else {
    initChat();
}

// Event Listeners
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = userInput.value.trim();
    if (!text) return;

    addUserMessage(text);
    userInput.value = '';

    // Process input based on state
    processUserInput(text);
});

// Logic functions
function processUserInput(text) {
    showTyping();
    dynamicInputContainer.classList.add('hidden'); // Hide input while bot is typing

    setTimeout(() => {
        removeTyping();

        switch (currentState) {
            case STATES.ASK_NAME:
                handleNameState(text);
                break;
            case STATES.Q1_COMFORT:
                handleQ1State(text);
                break;
            case STATES.Q2_GROWTH:
                handleQ2State(text);
                break;
            case STATES.Q3_RESOLUTION:
                handleQ3State(text);
                break;
            case STATES.PRIZE_EP_ID:
                handlePrizeEpIdState(text);
                break;
        }
    }, 500); // Simulate bot typing delay
}

function handleGreetingChoice(choiceData) {
    addUserMessage(choiceData.text);
    hideChoices();
    showTyping();
    updateProgress(15);

    setTimeout(() => {
        removeTyping();
        addBotMessage('3/30???덉쓣 ??댄? 誘명똿??????뺣낫瑜??쒕━怨? ?щ윭遺꾩쓽 ?섍껄??誘몃━ ?ㅼ뼱蹂닿린 ?꾪빐 ?붿뼱??');

        setTimeout(() => {
            showTyping();
            setTimeout(() => {
                removeTyping();
                addBotMessage('癒쇱?, ?쒓? 萸먮씪怨?遺瑜대㈃ ?좉퉴?? (?깊븿 ?먮뒗 ?됰꽕?꾩쓣 ?낅젰?댁＜?몄슂!)<br><span style="color:#888; font-size:13px;">?몛 ?? VS諛뺣낫寃, ?섎뒗?쇱퐫?⑹솗, 留덇끝?숈뒋?쇰㎤ ??/span>');
                currentState = STATES.ASK_NAME;
                showTextInput();
            }, 600);
        }, 500);
    }, 500);
}

function handleNameState(nickname) {
    surveyData.name = nickname;
    updateProgress(30);

    setTimeout(() => {
        showTyping();
        setTimeout(() => {
            removeTyping();
            addBotMessage(`?쁽 諛섍??뚯슂, <strong>${nickname}</strong>??<br>?붿쬁 ?곕━ 蹂몃? ?ㅼ썙?쒓? <strong>?쏞omfort Zone ?덉텧??/strong>?멸굅 ?꾩떆?섏슂?<br>?щ━?숈옄 Judith Bardwick? ?멸컙???몄븞?⑥뿉 ?ㅻ옒 癒몃Ъ硫??덉젙? ?앷린吏留? ?깆옣? 硫덉텣?ㅺ퀬 留먰빐??<br>洹몃옒???대쾲 ??댄??먯꽌??br>?몛 <strong>?쒖슦由щ뒗 ?대뼡 Comfort Zone???덇퀬, ?대뼸寃???諛????꾩빟??寃껋씤媛???/strong><br>?닿구 ?④퍡 ?댁빞湲고븯?ㅺ퀬 ?⑸땲??<br>洹??꾩뿉!<br>蹂멸꺽?곸씤 ?좊줎? ??댄??먯꽌 ?섍퀬,<br>?ъ쟾 ?뚮컢?낆? ? <strong>?섏씠</strong>? ?④퍡 媛蹂띻쾶 ?대낵源뚯슂? ?삇`);

            setTimeout(() => {
                showTyping();
                setTimeout(() => {
                    removeTyping();
                    showChoices([
                        { text: '醫뗭븘 媛숈씠 ?대낫?? ??', value: 'yes' },
                        { text: '??..?대뵒 ?쒕쾲 ?대킄 ?쨺', value: 'maybe' }
                    ], handleComfortChoice);
                    currentState = STATES.INTRO_COMFORT;
                }, 600);
            }, 800);
        }, 600);
    }, 400);
}

function handleComfortChoice(choiceData) {
    addUserMessage(choiceData.text);
    surveyData.comfortZoneChoice = choiceData.text;
    hideChoices();
    showTyping();
    updateProgress(50);

    setTimeout(() => {
        removeTyping();
        addBotMessage('醫뗭븘?? 洹몃읆 ?댁젣 吏덈Ц ?ㅼ뼱媛묐땲??<br><br>?쪇 <strong>Q1. ?곕━ 蹂몃???Comfort Zone, ?대뵒???덈떎怨??먮겮?몄슂?</strong><br>?붿쭅?섍쾶 ?곸뼱二쇱꽭??<br><br><span style="color:#888; font-size:13px;">?뱷 ??<br>?쒕ℓ踰?媛숈? 蹂닿퀬,,,鍮꾩듂??諛⑹떇留?諛섎났?댁슂??br>?쏛I ?⑥빞 ?섎뒗 嫄??꾨뒗?겸?洹李?븘???몄젙 ?쁾)??br>?쒖닔二?寃쎌웳??媛쒖꽑???꾩슂?댁슂??/span>');
        currentState = STATES.Q1_COMFORT;
        showTextInput();
    }, 500);
}

function handleQ1State(text) {
    surveyData.q1Answer = text;
    updateProgress(65);
    addBotMessage('?몟 醫뗭븘?? 洹몃읆 ??踰덉㎏ 吏덈Ц 媛묐땲??');

    setTimeout(() => {
        showTyping();
        setTimeout(() => {
            removeTyping();
            addBotMessage('?? <strong>Q2. 蹂몃?媛 Comfort Zone??踰쀬뼱?쒕떎硫? ?꾩갑?섍퀬 ?띠? ?쁆rowth Zone?숈? ?대뵒?멸???</strong> (利? ?곕━媛 轅덇씀??紐⑥뒿!)<br><br><span style="color:#888; font-size:13px;">?뱷 ??<br>?쒕뜑 鍮좊Ⅴ怨??⑥쑉?곸씤 ?ㅽ뻾????br>?쒖닔二?寃쎌웳??媛뺥솕!??br>?쒖깉濡쒖슫 湲곗닠 ?숈뒿怨??꾩쟾 臾명솕!??/span>');
            currentState = STATES.Q2_GROWTH;
            showTextInput();
        }, 800);
    }, 500);
}

function handleQ2State(text) {
    surveyData.q2Answer = text;
    updateProgress(80);
    addBotMessage('?뵦 醫뗭? 紐⑺몴?덉슂! ?? ?댁젣 留덉?留?吏덈Ц?댁뿉??議곌툑留????붿씠??');

    setTimeout(() => {
        showTyping();
        setTimeout(() => {
            removeTyping();
            addBotMessage(`?뙮 <strong>Q3. ${surveyData.name}?섏씠 ?ы빐 踰쀬뼱?섎낫怨??띠? 媛쒖씤 ?뱀? ?낅Т Comfort Zone? 臾댁뾿?멸???</strong> ?섏븘二??묒? ??嫄몄쓬?숇룄 醫뗭븘??<br><br><span style="color:#888; font-size:13px;">?뱷 ??<br>?쏛I ?꾧뎄 留ㅼ씪 10遺??⑤낫湲???br>?쒗쉶?섏뿉????踰덉? ???섍껄 留먰븯湲???br>?쒖깉濡쒖슫 ?꾨줈?몄뒪 ?쒕쾾 ?곸슜!??/span>`);
            currentState = STATES.Q3_RESOLUTION;
            showTextInput();
        }, 800);
    }, 500);
}

function handleQ3State(text) {
    surveyData.q3Answer = text;
    updateProgress(90);

    setTimeout(() => {
        showTyping();
        setTimeout(() => {
            removeTyping();
            addBotMessage(`?뮍 ${surveyData.name}?섏씠?쇰㈃ ?뺣쭚 ???대궪 ???덉쓣 寃?媛숈븘?? ?꾩쟾 湲곕??쇱슂! ?삃<br><br>留덉?留됱쑝濡?<br>?????붾? ?섎닠二쇱떊 遺?以묒뿉 ??먭쾶 ?섑빐二쇱떊 遺꾧퍡???럞 <strong>異붿꺼???꾪븳 ?좊Ъ</strong>???쒕━?ㅺ퀬 ?댁슂. ?좊Ъ 諛쏄퀬 ?띠쑝??遺꾩? <strong>EP ID(?щ쾲)</strong>瑜??낅젰?댁＜?몄슂!<br><span style="color:#888; font-size:13px;">(媛쒖씤?뺣낫???ㅼ쭅 ?좊Ъ異붿꺼???꾪빐 ?쒖슜?⑸땲?? ?먯튂 ?딆쑝硫??쒓굔?덈쎇湲? 踰꾪듉???뚮윭二쇱꽭??</span>`);

            showChoices([
                { text: '嫄대꼫?곌린 ??툘', value: 'skip' }
            ], handlePrizeEpIdState);

            currentState = STATES.PRIZE_EP_ID;
            showTextInput(); // allow both text input or choice button
        }, 1000);
    }, 700);
}

function handlePrizeEpIdState(input) {
    const text = typeof input === 'string' ? input : input.value;
    if (typeof input !== 'string') {
        addUserMessage(input.text);
    }

    hideChoices();

    if (text !== 'skip' && text.trim() && text.trim() !== "嫄대꼫?곌린" && text.trim() !== "嫄대꼫?곌린 ??툘") {
        surveyData.epId = text;
    } else {
        surveyData.epId = "嫄대꼫?곌린";
    }

    updateProgress(100);

    userInput.disabled = true;
    sendButton.disabled = true;
    userInput.placeholder = "?쒕쿋?닿? ?꾨즺?섏뿀?듬땲??";
    showTextInput();

    setTimeout(() => {
        showTyping();
        setTimeout(() => {
            removeTyping();
            addBotMessage('?? 李? 留덉?留됯퉴吏 ?二쇱떊 ?щ윭遺꾨뱾猿섎쭔 ??댄? 誘명똿 ?뺣낫瑜??뚮젮?쒕┫寃뚯슂(?띾떏) ?ㄻ<br><br>?뱟 <strong>[??댄? 誘명똿 ?덈궡]</strong><br>?쇱떆: 3??30???붿슂??14:00~15:30<br>?μ냼: 留덇끝 ?ъ씠?몄뒪?뚰겕 B1 ?ㅻ뵒?좊━?<br><span style="color:#888; font-size:13px;">?⑤씪???묒냽 ?μ냼 異뷀썑 ?덈궡 ?덉젙</span><br><br>?꾩옣?먯꽌 <strong>' + surveyData.name + '</strong>?섎쭔??Growth Zone ?좎뼵, 瑗??ㅻ젮二쇱꽭?? ???뮋');

            setTimeout(() => {
                showTyping();
                setTimeout(() => {
                    removeTyping();
                    addBotMessage('?묒꽦?댁＜???쒕쿋???댁슜???덉쟾?섍쾶 ?꾩넚?섍퀬 ?덉뼱??.. ??);
                    submitSurveyData();
                }, 1000);
            }, 2000);
        }, 1000);
    }, 800);
}

// UI Helpers
function showChoices(choices, callback) {
    dynamicInputContainer.classList.add('hidden');
    choiceContainer.innerHTML = '';

    choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.innerHTML = choice.text;
        btn.onclick = () => callback(choice);
        choiceContainer.appendChild(btn);
    });

    choiceContainer.classList.remove('hidden');
    scrollToBottom();
}

function hideChoices() {
    choiceContainer.classList.add('hidden');
}

function showTextInput() {
    dynamicInputContainer.classList.remove('hidden');
    if (!userInput.disabled) {
        // slight delay to focus after UI transitions
        setTimeout(() => userInput.focus(), 100);
    }
    scrollToBottom();
}

function addBotMessage(text) {
    const msgHTML = `
        <div class="message-wrapper message-bot">
            <div class="message-content-wrapper">
                <div class="bot-avatar" style="font-size: 22px; background-color: #fff0f3; box-shadow: 0 4px 10px rgba(165, 0, 52, 0.2);">
                   ?뚳툘
                </div>
                <div class="message">${text}</div>
            </div>
        </div>
    `;
    chatMessages.insertAdjacentHTML('beforeend', msgHTML);
    scrollToBottom();
}

function addUserMessage(text) {
    const msgHTML = `
        <div class="message-wrapper message-user">
            <div class="message">${text}</div>
        </div>
    `;
    chatMessages.insertAdjacentHTML('beforeend', msgHTML);
    scrollToBottom();
}

function showTyping() {
    const msgHTML = `
        <div class="message-wrapper message-bot" id="typing-indicator">
            <div class="message-content-wrapper">
                <div class="bot-avatar" style="font-size: 22px; background-color: #fff0f3; box-shadow: 0 4px 10px rgba(165, 0, 52, 0.2);">
                    ?뚳툘
                </div>
                <div class="message" style="padding: 10px 16px;">
                    <div class="typing-indicator">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    chatMessages.insertAdjacentHTML('beforeend', msgHTML);
    scrollToBottom();
}

function removeTyping() {
    const el = document.getElementById('typing-indicator');
    if (el) el.remove();
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Formspree API Integration
// TODO: Replace with the actual Formspree endpoint URL provided by the user
const ENDPOINT_URL = "https://formspree.io/f/xreyzvor";

async function submitSurveyData() {
    try {
        const payload = {
            "EP_ID": surveyData.epId,
            "?대쫫": surveyData.name,
            "?좏깮?뺣떟蹂": surveyData.comfortZoneChoice,
            "Q1(?꾩옱 Comfort Zone)": surveyData.q1Answer,
            "Q2(紐⑺몴 Growth Zone)": surveyData.q2Answer,
            "Q3(?ы빐???ㅼ쭚)": surveyData.q3Answer,
            "?쒖텧?쒓컙": new Date().toLocaleString('ko-KR')
        };

        if (ENDPOINT_URL.includes("YOUR_FORM_ID_HERE")) {
            console.warn("Formspree URL is not configured yet. Skipping actual network request.");
            setTimeout(() => {
                showTyping();
                setTimeout(() => {
                    removeTyping();
                    addBotMessage('??(?뚯뒪??紐⑤뱶) ?곗씠???꾩넚???꾨즺?섏뿀?듬땲??');
                    currentState = STATES.OUTRO;
                }, 1000);
            }, 1000);
            return;
        }

        const response = await fetch(ENDPOINT_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            setTimeout(() => {
                showTyping();
                setTimeout(() => {
                    removeTyping();
                    addBotMessage('??<strong>' + surveyData.name + '?섏쓽 ?λ뵸???섍껄???깃났?곸쑝濡??묒닔?섏뿀?댁슂!</strong> ?ㅻ뒛 ?꾩쟾?댁＜?붿꽌 ?뺣쭚 留섏씠 ~?꾨┃~?ㅼ슂 媛먮룞 ?⑥쫱 ??<br><br>?댁젣 ?섏씠吏瑜??レ쑝?붾룄 愿ъ갖?꾩슂 :)');
                    currentState = STATES.OUTRO;
                }, 1000);
            }, 1000);
        } else {
            throw new Error('Network response was not ok.');
        }

    } catch (err) {
        console.error("Survey submission failed:", err);
        setTimeout(() => {
            showTyping();
            setTimeout(() => {
                removeTyping();
                addBotMessage('?좑툘 二꾩넚?⑸땲?? ?곗씠???꾩넚 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎. ?섏쨷???ㅼ떆 ?쒕룄?댁＜?몄슂.');
                currentState = STATES.OUTRO;
            }, 1000);
        }, 1000);
    }
}



