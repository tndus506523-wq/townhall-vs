// State Definitions
const STATES = {
    INIT: 0,
    INTRO_GREETING: 1,
    ASK_NAME: 2,
    INTRO_COMFORT: 3,
    WARMUP: 4,
    Q1_CHOICE: 5,
    Q1_OTHER: 6,
    Q2_GROWTH: 7,
    Q4_QUESTION: 8,
    PRIZE_EP_ID: 9,
    OUTRO: 10
};

// Map states to surveyData keys for inline editing
const STATE_DATA_MAP = {
    [STATES.ASK_NAME]: 'name',
    [STATES.INTRO_COMFORT]: 'comfortZoneChoice',
    [STATES.WARMUP]: 'warmupAnswer',
    [STATES.Q1_CHOICE]: 'q1Answer',
    [STATES.Q1_OTHER]: 'q1Answer',
    [STATES.Q2_GROWTH]: 'q2Answer',
    [STATES.Q4_QUESTION]: 'q4Answer',
    [STATES.PRIZE_EP_ID]: 'epId'
};

// Global Data Store
let surveyData = {
    name: '',
    epId: '미입력',
    comfortZoneChoice: '',
    warmupAnswer: '',
    q1Answer: '',
    q2Answer: '',
    q4Answer: ''
};

let currentState = STATES.INIT;

// DOM Elements
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const choiceContainer = document.getElementById('choice-input-container');
const dynamicInputContainer = document.getElementById('dynamic-input-container');
const sendButton = document.getElementById('send-button');

// Progress Bar
const milestoneMessages = {
    25: '🌱 잘 하고 있어요! 25% 달성!',
    50: '🔥 절반 왔어요! 파이팅!',
    75: '💪 거의 다 왔어요! 75% 달성!',
    100: '🎉 완료! 대단해요!'
};
const shownMilestones = new Set();

function updateProgress(percentage) {
    const bar = document.getElementById('progress-bar');
    if (bar) {
        bar.style.width = percentage + '%';
    }
    [25, 50, 75, 100].forEach(m => {
        if (percentage >= m && !shownMilestones.has(m)) {
            shownMilestones.add(m);
            showMilestoneToast(milestoneMessages[m]);
        }
    });
}

function showMilestoneToast(message) {
    const toast = document.getElementById('milestone-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// Helper: delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper: type then show message
async function botSay(text, dependsOn = null, template = null) {
    showTyping();
    await delay(1000); // Slower speed as requested (35)
    removeTyping();
    addBotMessage(text, dependsOn, template);
}

// Inline Edit Logic
function enableInlineEdit(stateId, btn) {
    if (currentState === STATES.OUTRO) return;

    const wrapper = btn.closest('.message-content-wrapper');
    const msgDiv = wrapper.querySelector('.message');
    const originalText = msgDiv.innerText;
    const key = STATE_DATA_MAP[stateId];

    // Replace text with input
    msgDiv.innerHTML = `
        <div class="user-edit-wrapper">
            <input type="text" class="user-edit-input" value="${originalText}">
            <button class="save-inline-btn">저장</button>
        </div>
    `;

    const input = msgDiv.querySelector('input');
    const saveBtn = msgDiv.querySelector('.save-inline-btn');
    input.focus();

    const saveAction = () => {
        const newVal = input.value.trim();
        if (!newVal) return;

        // Update Data
        surveyData[key] = newVal;

        // Restore UI
        msgDiv.innerHTML = newVal;

        // Link logic: If multiple states share a key (like Q1_CHOICE and Q1_OTHER), ensure consistency
        // Update all messages that depend on this key
        updateDependentMessages(key);
    };

    saveBtn.onclick = (e) => {
        e.stopPropagation();
        saveAction();
    };
    input.onkeydown = (e) => {
        if (e.key === 'Enter') saveAction();
    };
}

function updateDependentMessages(key) {
    const dependents = document.querySelectorAll(`[data-depends-on*="${key}"]`);
    dependents.forEach(el => {
        let template = el.getAttribute('data-template');
        if (!template) return;

        // Replace all {key} in template
        let newContent = template;
        Object.keys(surveyData).forEach(k => {
            const regex = new RegExp(`{${k}}`, 'g');
            newContent = newContent.replace(regex, surveyData[k]);
        });

        el.innerHTML = newContent;
    });
}

// ===== COVER → CHAT TRANSITION =====
function startSurvey() {
    const cover = document.getElementById('cover-screen');
    const chat = document.getElementById('chat-screen');

    cover.classList.add('fade-out');
    setTimeout(() => {
        cover.style.display = 'none';
        chat.classList.remove('hidden');
        initChat();
    }, 400);
}

// Initialization
function initChat() {
    updateProgress(5);

    const sysMsgHTML = `<div class="system-message">"타요"님이 채팅방에 입장하셨습니다.</div>`;
    chatMessages.insertAdjacentHTML('beforeend', sysMsgHTML);
    scrollToBottom();

    (async () => {
        await botSay('👋 안녕하세요, VS본부 구성원님!');
        await botSay('저는 VS본부 타운홀 미팅 정보를 안내해드릴<br><strong>타운홀 요정..... "타요" 🧚</strong> 에요!');
        await delay(400);
        showChoices([
            { text: '반가워 타요야! 👋', value: 'hello' },
            { text: '뭐야... 너 누군데? 👀', value: 'who' }
        ], handleGreetingChoice);
        currentState = STATES.INTRO_GREETING;
    })();
}


// Event Listeners
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = userInput.value.trim();
    if (!text) return;

    addUserMessage(text, currentState);
    userInput.value = '';
    processUserInput(text);
});

// Logic functions
function processUserInput(text) {
    dynamicInputContainer.classList.add('hidden');

    switch (currentState) {
        case STATES.ASK_NAME:
            handleNameState(text);
            break;
        case STATES.WARMUP:
            handleWarmupState(text);
            break;
        case STATES.Q2_GROWTH:
            handleQ2State(text);
            break;
        case STATES.Q4_QUESTION:
            handleQ4State(text);
            break;
        case STATES.PRIZE_EP_ID:
            handlePrizeEpIdState(text);
            break;
    }
}

function handleGreetingChoice(choiceData) {
    addUserMessage(choiceData.text, currentState, true);
    hideChoices();
    updateProgress(12);

    (async () => {
        await botSay('저는 1분기 타운홀 미팅에 대한 정보를 드리고');
        await botSay('여러분의 의견을 미리 들어보기 위해 왔어요! 😊');
        await botSay('먼저, 구성원님을 어떻게 불러드리면 될까요?<br>👉 성함 또는 닉네임을 입력해주세요!');
        currentState = STATES.ASK_NAME;
        showTextInput();
    })();
}

function handleNameState(nickname) {
    surveyData.name = nickname;
    updateProgress(25);

    (async () => {
        await botSay(`반가워요, <strong>${surveyData.name}</strong>님! 😄`, 'name', '반가워요, <strong>{name}</strong>님! 😄');
        await botSay('혹시 <strong>Step out of your Comfort Zone</strong><br> 이라는 말 들어보셨나요? 🤔');
        await botSay('Comfort Zone에서 느끼는 익숙함은 <br>우리에게 안정감과 편안함을 주지만');
        await botSay('<strong>성장과 발전</strong>은 두려움을 이겨내고<br>익숙하던 것을 넘어설 때 일어난다고 합니다.<br><span style="color:#888; font-size:13px;">(심리학자 Judith Bardwick)</span>');
        await botSay('....그래서!');
        await botSay('이번 타운홀에서는 <br>VS본부가 <strong>Comfort Zone을 벗어나<br>어떤 변화와 성장을 만들어가는지</strong><br>이야기 나눌 예정입니다. 🙌');
        await delay(400);
        showChoices([
            { text: '무슨 이야기 할 지 기대된다!! 🚀', value: 'yes' },
            { text: '음...조금 어렵네..알겠어 🤔', value: 'maybe' }
        ], handleComfortChoice);
        currentState = STATES.INTRO_COMFORT;
    })();
}

function handleComfortChoice(choiceData) {
    addUserMessage(choiceData.text, currentState, true);
    surveyData.comfortZoneChoice = choiceData.text;
    hideChoices();
    updateProgress(38);

    (async () => {
        await botSay(`저와 함께 차근 차근 이야기 나눠봐요! 😎`);
        await botSay('그럼 가볍게 몸풀기 질문 나갑니다! 🥁');
        await botSay(`🌱 <strong>${surveyData.name}님이 올해 Comfort Zone을 벗어나기 위해 해보고 싶은 <u>딱 한 가지 행동</u>은 무엇인가요?</strong><br><br><span style="color:#888; font-size:13px;">📝 예) '아주 작은 한 걸음'도 좋아요!<br>"다이어트 도전"<br>"매일 영어 단어 5개 외우기"<br>"AI 도구 매일 10분 써보기"</span>`, 'name', `🌱 <strong>{name}님이 올해 Comfort Zone을 벗어나기 위해 해보고 싶은 <u>딱 한 가지 행동</u>은 무엇인가요?</strong><br><br><span style="color:#888; font-size:13px;">📝 예) '아주 작은 한 걸음'도 좋아요!<br>"다이어트 도전"<br>"매일 영어 단어 5개 외우기"<br>"AI 도구 매일 10분 써보기"</span>`);
        currentState = STATES.WARMUP;
        showTextInput();
    })();
}

function handleWarmupState(text) {
    surveyData.warmupAnswer = text;
    updateProgress(52);

    (async () => {
        await botSay('💪 멋있는 다짐이에요! 우리 꼭 실천해봐요!');
        await botSay('그럼 이제 본격 질문 들어갑니다! 🥁');
        await botSay(`<strong>Q1. ${surveyData.name}님, VS본부가 Comfort Zone을 벗어나 성장하기 위해서는 어떤 노력이 필요하다고 생각하시나요?</strong><br><br>아래 중 하나를 선택해주세요!`, 'name', `<strong>{name}님은 VS본부가 Comfort Zone을 벗어나 성장하기 위해서는 어떤 노력이 필요하다고 생각하시나요?</strong><br><br>아래 중 하나를 선택해주세요!`);
        await delay(300);
        showChoices([
            { text: '1️⃣ 수주 경쟁력 강화', value: '수주 경쟁력 강화' },
            { text: '2️⃣ 외부 환경 변화 / 위기 대응', value: '외부 환경 변화/ 위기 대응' },
            { text: '3️⃣ 적극적 AX 활용 확대', value: '적극적 AX 활용 확대' },
            { text: '4️⃣ 협업 및 일하는 방식 개선', value: '협업 및 일하는 방식 개선' },
            { text: '5️⃣ 기타 (직접 입력)', value: '기타' }
        ], handleQ1Choice);
        currentState = STATES.Q1_CHOICE;
    })();
}

function handleQ1Choice(choiceData) {
    if (choiceData.value === '기타') {
        choiceContainer.innerHTML = `
            <div class="inline-input-wrapper">
                <input type="text" class="inline-input" id="inline-q1-input" placeholder="성장을 위한 노력을 직접 입력해주세요" autocomplete="off">
                <button class="inline-confirm-btn" id="inline-q1-confirm">확인</button>
            </div>
        `;
        const inputEl = document.getElementById('inline-q1-input');
        const confirmBtn = document.getElementById('inline-q1-confirm');

        setTimeout(() => inputEl.focus(), 100);

        const handleConfirm = () => {
            const val = inputEl.value.trim();
            if (!val) return;
            addUserMessage(val, STATES.Q1_CHOICE); // Keep edit for text
            surveyData.q1Answer = val;
            hideChoices();
            proceedToQ2();
        };

        confirmBtn.onclick = handleConfirm;
        inputEl.onkeydown = (e) => {
            if (e.key === 'Enter') handleConfirm();
        };
    } else {
        addUserMessage(choiceData.text, currentState, true); // Hide edit for choice
        surveyData.q1Answer = choiceData.value;
        hideChoices();
        proceedToQ2();
    }
}

function proceedToQ2() {
    updateProgress(65);

    (async () => {
        await botSay(`<strong>${surveyData.name}</strong>님께서는 <strong>${surveyData.q1Answer}</strong>이(가) 필요하다고 생각하시는군요!`, 'name,q1Answer', `<strong>{name}</strong>님께서는 <strong>{q1Answer}</strong>이(가) 필요하다고 생각하시는군요!`);
        await botSay('그렇다면....');
        await botSay(`<strong>Q2. <u>${surveyData.q1Answer}</u>을(를) 통해 성장한 VS본부의 모습은 어떨까요?</strong><br><br><span style="color:#888; font-size:13px;">📝 예)<br>"혁신적인 제품 포트폴리오 구성을 통한 수주 잔고 확대"<br>"AX 활용을 통한 개발 효율화"<br>"동료간 도움을 적극적으로 주고받음"</span>`, 'q1Answer', `<strong>Q2. <u>{q1Answer}</u>을(를) 통해 성장한 VS본부의 모습은 어떨까요?</strong><br><br><span style="color:#888; font-size:13px;">📝 예)<br>"혁신적인 제품 포트폴리오 구성을 통한 수주 잔고 확대"<br>"AX 활용을 통한 개발 효율화"<br>"동료간 도움을 적극적으로 주고받음"</span>`);
        currentState = STATES.Q2_GROWTH;
        showTextInput();
    })();
}

function handleQ2State(text) {
    surveyData.q2Answer = text;
    updateProgress(78);

    (async () => {
        await botSay('좋아요! 우리는 꼭 해낼 수 있을거에요 🍀');
        await botSay('자, 이제 마지막 질문이에요. 조금만 더 화이팅! 💪');
        await botSay('<strong>Q3. 타운홀 미팅에서 경영진에게 궁금하거나 듣고 싶은 이야기가 있으신가요?</strong><br><br><span style="color:#888; font-size:13px;">📝 예)<br>"1분기 경영 실적이 궁금해요"<br>"26년 본부 방향성이 궁금해요"</span>');
        currentState = STATES.Q4_QUESTION;
        showTextInput();
    })();
}

function handleQ4State(text) {
    surveyData.q4Answer = text;
    updateProgress(90);

    (async () => {
        await botSay(`💚 <strong>${surveyData.name}</strong>님, 소중한 의견 들려줘서 고마워요!`, 'name', `💚 <strong>{name}</strong>님, 소중한 의견 들려줘서 고마워요!`);
        await botSay('마지막으로,<br><br>저의 질문에 끝까지 답변해주신 분들께는<br>🎁 <strong>추첨을 통해 소정의 선물</strong>을 드리려고 해요!');
        await botSay('EP ID를 입력해주시면 추첨에 참여하실 수 있어요!<br><span style="color:#888; font-size:13px;">(개인정보는 오직 선물 추첨을 위해 활용됩니다.)</span>');
        showChoices([
            { text: '건너뛰기 ⏭️', value: 'skip' }
        ], handlePrizeEpIdState);
        currentState = STATES.PRIZE_EP_ID;
        showTextInput();
    })();
}

function handlePrizeEpIdState(input) {
    const text = typeof input === 'string' ? input : input.value;
    if (typeof input !== 'string') {
        addUserMessage(input.text, currentState, true);
    }

    hideChoices();

    if (text !== 'skip' && text.trim() && text.trim() !== '건너뛰기' && text.trim() !== '건너뛰기 ⏭️') {
        surveyData.epId = text;
    } else {
        surveyData.epId = '건너뛰기';
    }

    updateProgress(100);
    userInput.disabled = true;
    sendButton.disabled = true;
    userInput.placeholder = '서베이가 완료되었습니다.';
    showTextInput();

    (async () => {
        await botSay('이제 정말 끝났어요! 🎉');
        await botSay('마지막으로 타운홀 미팅 일정만 알려드릴게요.');
        await botSay('📅 <strong>[타운홀 미팅 안내]</strong><br>일시: 3월 30일 월요일 15:00~16:50<br>장소/접속 방식 추후 안내 예정');
        await botSay(`그럼 꼭 타운홀 미팅 현장에서 뵈어요, <strong>${surveyData.name}</strong>님! 🚀💙`, 'name', `그럼 꼭 타운홀 미팅 현장에서 뵈어요, <strong>{name}</strong>님! 🚀💙`);
        await botSay('작성해주신 서베이 내용을 안전하게 전송하고 있어요... ⏳');
        submitSurveyData();
    })();
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
        setTimeout(() => userInput.focus(), 100);
    }
    scrollToBottom();
}

function addBotMessage(text, dependsOn = null, template = null) {
    const msgHTML = `
        <div class="message-wrapper message-bot">
            <div class="message-content-wrapper">
                <div class="bot-avatar" style="font-size: 22px; background-color: #fff0f3; box-shadow: 0 4px 10px rgba(165, 0, 52, 0.2);">
                   🐰
                </div>
                <div class="message" 
                    ${dependsOn ? `data-depends-on="${dependsOn}"` : ''} 
                    ${template ? `data-template='${template.replace(/'/g, "&apos;")}'` : ''}>
                    ${text}
                </div>
            </div>
        </div>
    `;
    chatMessages.insertAdjacentHTML('beforeend', msgHTML);
    scrollToBottom();
}

function addUserMessage(text, stateId, hideEdit = false) {
    const msgHTML = `
        <div class="message-wrapper message-user" data-state="${stateId}">
            <div class="message-content-wrapper">
                <div class="message">${text}</div>
                ${hideEdit ? '' : `<button class="edit-btn" onclick="enableInlineEdit(${stateId}, this)">수정</button>`}
            </div>
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
                    🐰
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
const ENDPOINT_URL = "https://formspree.io/f/xreyzvor";

async function submitSurveyData() {
    try {
        const payload = {
            "EP_ID": surveyData.epId,
            "이름": surveyData.name,
            "선택형답변": surveyData.comfortZoneChoice,
            "워밍업(개인다짐)": surveyData.warmupAnswer,
            "Q1(본부성장노력)": surveyData.q1Answer,
            "Q2(Growth Zone모습)": surveyData.q2Answer,
            "Q3(경영진에게묻고싶은것)": surveyData.q4Answer,
            "제출시간": new Date().toLocaleString('ko-KR')
        };

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
                    addBotMessage('✅ <strong>' + surveyData.name + '님의 따뜻한 의견이 성공적으로 접수되었어요!</strong><br>오늘 용기 내서 참여해주셔서 정말 고마워요! 💚', 'name', '✅ <strong>{name}</strong>님의 따뜻한 의견이 성공적으로 접수되었어요!<br>오늘 용기 내서 참여해주셔서 정말 고마워요! 💚');
                    setTimeout(() => {
                        const sysEndHTML = `<div class="system-message">"타요"님이 채팅방을 나가셨습니다.</div>`;
                        chatMessages.insertAdjacentHTML('beforeend', sysEndHTML);
                        scrollToBottom();
                    }, 1500);
                    currentState = STATES.OUTRO;
                }, 1200);
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
                addBotMessage('⚠️ 앗, 전송 중 오류가 발생했어요. 잠시 후 다시 시도해주시거나 담당자에게 문의해 주세요.');
                currentState = STATES.OUTRO;
            }, 1200);
        }, 1000);
    }
}
