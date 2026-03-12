// State Definitions
const STATES = {
    INIT: 0,
    INTRO_GREETING: 1,
    ASK_NAME: 2,
    INTRO_COMFORT: 3,
    WARMUP: 4,       // 개인 다짐 (워밍업)
    Q1_CHOICE: 5,    // 본부 성장 노력 (5지선다)
    Q2_GROWTH: 6,    // Q1 기반 Growth Zone 모습 (텍스트)
    Q4_QUESTION: 7,  // 경영진에게 듣고 싶은 것 (텍스트)
    PRIZE_EP_ID: 8,
    OUTRO: 9
};

// Global Data Store
const surveyData = {
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
async function botSay(text, pauseAfter = 700) {
    showTyping();
    await delay(pauseAfter);
    removeTyping();
    addBotMessage(text);
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
        await botSay('👋 안녕하세요, VS본부 구성원님!', 700);
        await botSay('저는 VS본부 타운홀 미팅 정보를 안내해드릴<br><strong>\'타\'운홀 \'요\'정 "타요"</strong> 에요!', 900);
        await delay(300);
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

    addUserMessage(text);
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
    addUserMessage(choiceData.text);
    hideChoices();
    updateProgress(12);

    (async () => {
        await botSay('저는 VS본부 1분기 타운홀 미팅에 대한 정보를 드리고,', 700);
        await botSay('여러분의 의견을 미리 들어보기 위해 왔어요! 😊', 700);
        await botSay('먼저, 구성원님을 어떻게 불러드리면 될까요?<br><span style="color:#888; font-size:13px;">👉 성함 또는 닉네임을 입력해주세요!<br>예: VS박보검, 나는야코딩왕, 마곡나루귀신 등</span>', 900);
        currentState = STATES.ASK_NAME;
        showTextInput();
    })();
}

function handleNameState(nickname) {
    surveyData.name = nickname;
    updateProgress(25);

    (async () => {
        await botSay(`반가워요, <strong>${nickname}</strong>님! 😄`, 600);
        await botSay('<strong>Step out of your Comfort Zone</strong> 이라는 말, 들어보셨나요? 🤔', 800);
        await botSay('인간이 편안함에 오래 머물면 안정은 생기지만,<br><strong>성장은 멈춘다</strong>고 말해요.<br><span style="color:#888; font-size:13px;">(심리학자 Judith Bardwick)</span>', 1000);
        await botSay('그래서 이번 타운홀에서는<br>👉 <strong>"우리는 어떤 Comfort Zone에 있고, 어떻게 한 발 더 도약할 것인가?"</strong><br>이걸 함께 이야기하려고 합니다.', 1100);
        await botSay('그럼 저희 한번 VS본부의 26년도 이야기를 나눠볼까요? 😎', 700);
        await delay(300);
        showChoices([
            { text: '좋아 같이 해보자! 🚀', value: 'yes' },
            { text: '음...어디 한번 해봐 🤔', value: 'maybe' }
        ], handleComfortChoice);
        currentState = STATES.INTRO_COMFORT;
    })();
}

function handleComfortChoice(choiceData) {
    addUserMessage(choiceData.text);
    surveyData.comfortZoneChoice = choiceData.text;
    hideChoices();
    updateProgress(38);

    (async () => {
        await botSay('그럼 가볍게 몸풀기 질문 나갑니다! 🥁', 700);
        await botSay(`🌱 <strong>${surveyData.name}님이 올해 Comfort Zone을 벗어나기 위해 해보고 싶은 한 가지 행동은 무엇인가요?</strong><br>'아주 작은 한 걸음'도 좋아요!<br><br><span style="color:#888; font-size:13px;">📝 예)<br>"다이어트 도전"<br>"매일 영어 단어 5개 외우기"<br>"AI 도구 매일 10분 써보기"<br>"회의에서 한 번은 내 의견 말하기"</span>`, 1100);
        currentState = STATES.WARMUP;
        showTextInput();
    })();
}

function handleWarmupState(text) {
    surveyData.warmupAnswer = text;
    updateProgress(52);

    (async () => {
        await botSay('💪 멋있는 다짐이에요! 꼭 실천해봐요!', 600);
        await botSay('좋아요! 이제 본격 질문 들어갑니다! 🥁', 700);
        await botSay('<strong>Q1. 우리 본부가 Comfort Zone을 벗어나 성장하기 위해서 어떤 노력이 가장 필요하다고 생각하시나요?</strong><br><br>아래 중 하나를 선택해주세요!', 1000);
        await delay(300);
        showChoices([
            { text: '1️⃣ 수주 경쟁력 강화', value: '수주 경쟁력 강화' },
            { text: '2️⃣ 철저한 외부 환경/이슈 대응', value: '철저한 외부 환경/이슈 대응' },
            { text: '3️⃣ AX 활용 확대', value: 'AX 활용 확대' },
            { text: '4️⃣ 협업 및 일하는 방식 개선', value: '협업 및 일하는 방식 개선' },
            { text: '5️⃣ 도전하는 마인드셋', value: '도전하는 마인드셋' }
        ], handleQ1Choice);
        currentState = STATES.Q1_CHOICE;
    })();
}

function handleQ1Choice(choiceData) {
    addUserMessage(choiceData.text);
    surveyData.q1Answer = choiceData.value;
    hideChoices();
    updateProgress(65);

    (async () => {
        await botSay('👍 좋은 선택이에요!', 600);
        await botSay(`<strong>Q2. VS본부가 <u>${surveyData.q1Answer}</u>을(를) 통해 Comfort Zone을 벗어나 성장한다면, 그 모습은 어떨까요?</strong><br><br><span style="color:#888; font-size:13px;">📝 예)<br>"높은 목표에 대한 두려움 없이 마음껏 도전하고 실패함"<br>"동료간 도움을 적극적으로 주고받음"</span>`, 1000);
        currentState = STATES.Q2_GROWTH;
        showTextInput();
    })();
}

function handleQ2State(text) {
    surveyData.q2Answer = text;
    updateProgress(78);

    (async () => {
        await botSay('🔥 정말 멋진 그림이에요!', 600);
        await botSay('자, 이제 마지막 질문이에요. 조금만 더 화이팅! 💪', 700);
        await botSay('<strong>Q3. 타운홀 미팅에서 경영진에게 듣고 싶은 이야기가 있으신가요?</strong><br><br><span style="color:#888; font-size:13px;">📝 예)<br>"경영 실적이 궁금해요"<br>"26년 본부 방향성이 궁금해요"<br>자유롭게 작성해주세요!</span>', 1000);
        currentState = STATES.Q4_QUESTION;
        showTextInput();
    })();
}

function handleQ4State(text) {
    surveyData.q4Answer = text;
    updateProgress(90);

    (async () => {
        await botSay(`💚 <strong>${surveyData.name}</strong>님, 소중한 의견 들려줘서 고마워요!`, 700);
        await botSay('마지막으로, 저의 질문에 끝까지 답변해주신 분들께는<br>🎁 <strong>추첨을 통해 소정의 선물</strong>을 드리려고 해요!', 900);
        await botSay('<strong>EP ID(사번)</strong>를 입력해주시면 추첨에 참여하실 수 있어요!<br><span style="color:#888; font-size:13px;">(개인정보는 오직 선물 추첨을 위해 활용됩니다.)</span>', 1000);
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
        addUserMessage(input.text);
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
        await botSay('아, 참! 마지막까지 와주신 분들께만 알려드릴게요 🤫', 800);
        await botSay('📅 <strong>[타운홀 미팅 안내]</strong><br>일시: 3월 30일 월요일 14:00~15:30<br>장소: 마곡 사이언스파크 B1 오디토리움<br><span style="color:#888; font-size:13px;">온라인 접속 장소 추후 안내 예정</span>', 1100);
        await botSay(`현장에서 <strong>${surveyData.name}</strong>님만의 Growth Zone 선언, 꼭 들려주세요! 🚀💙`, 900);
        await botSay('작성해주신 서베이 내용을 안전하게 전송하고 있어요... ⏳', 700);
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

function addBotMessage(text) {
    const msgHTML = `
        <div class="message-wrapper message-bot">
            <div class="message-content-wrapper">
                <div class="bot-avatar" style="font-size: 22px; background-color: #fff0f3; box-shadow: 0 4px 10px rgba(165, 0, 52, 0.2);">
                   🐰
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
                    addBotMessage('✅ <strong>' + surveyData.name + '님의 따뜻한 의견이 성공적으로 접수되었어요!</strong><br>오늘 용기 내서 참여해주셔서 정말 고마워요! 💚');
                    setTimeout(() => {
                        addBotMessage('이제 페이지를 닫으셔도 괜찮아요 :)');
                        setTimeout(() => {
                            const sysEndHTML = `<div class="system-message">"타요"님이 채팅방을 나가셨습니다.</div>`;
                            chatMessages.insertAdjacentHTML('beforeend', sysEndHTML);
                            scrollToBottom();
                        }, 1000);
                    }, 1200);
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
                addBotMessage('⚠️ 앗, 전송 중 오류가 발생했어요. 잠시 후 다시 시도해주시거나 담당자에게 문의해 주세요.');
                currentState = STATES.OUTRO;
            }, 1000);
        }, 1000);
    }
}
