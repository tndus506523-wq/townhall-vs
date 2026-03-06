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
    epId: '미입력',
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

// Progress Bar
function updateProgress(percentage) {
    const bar = document.getElementById('progress-bar');
    if (bar) {
        bar.style.width = percentage + '%';
    }
}

// Helper: delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper: type then show message
async function botSay(text, pauseAfter = 800) {
    showTyping();
    await delay(pauseAfter);
    removeTyping();
    addBotMessage(text);
}

// Initialization
function initChat() {
    updateProgress(5);

    const sysMsgHTML = `<div class="system-message">VS구성원님이 입장하셨습니다.</div>`;
    chatMessages.insertAdjacentHTML('beforeend', sysMsgHTML);
    scrollToBottom();

    (async () => {
        await botSay('Step out of your Comfort Zone, <strong>VS본부 구성원님!</strong>', 800);
        await botSay('👋 안녕하세요! 저는 VS본부 타운홀 미팅 정보를 안내해드릴 <strong>"쁘이"</strong>에요!', 1000);
        await delay(400);
        showChoices([
            { text: '반가워 쁘이! 👋', value: 'hello' },
            { text: '그래서 너 누군데? 👀', value: 'who' }
        ], handleGreetingChoice);
        currentState = STATES.INTRO_GREETING;
    })();
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
    processUserInput(text);
});

// Logic functions
function processUserInput(text) {
    dynamicInputContainer.classList.add('hidden');

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
}

function handleGreetingChoice(choiceData) {
    addUserMessage(choiceData.text);
    hideChoices();
    updateProgress(15);

    (async () => {
        await botSay('3/30에 있을 타운홀 미팅에 대한 정보를 드리고,', 800);
        await botSay('여러분의 의견을 미리 들어보기 위해 왔어요! 😊', 800);
        await botSay('먼저, 제가 뭐라고 부르면 될까요?<br><span style="color:#888; font-size:13px;">👉 성함 또는 불리고 싶은 닉네임을 입력해주세요!<br>예: VS박보검, 나는야코딩왕, 마곡동슈퍼맨 등</span>', 1000);
        currentState = STATES.ASK_NAME;
        showTextInput();
    })();
}

function handleNameState(nickname) {
    surveyData.name = nickname;
    updateProgress(30);

    (async () => {
        await botSay(`😄 반가워요, <strong>${nickname}</strong>님!`, 700);
        await botSay('요즘 우리 본부 키워드가 <strong>"Comfort Zone 탈출"</strong>인거 아시나요? 🤔', 1000);
        await botSay('심리학자 Judith Bardwick은 인간이 편안함에 오래 머물면<br>안정은 생기지만, <strong>성장은 멈춘다</strong>고 말해요.', 1200);
        await botSay('그래서 이번 타운홀에서는<br>👉 <strong>"우리는 어떤 Comfort Zone에 있고, 어떻게 한 발 더 도약할 것인가?"</strong><br>이걸 함께 이야기하려고 합니다.', 1300);
        await botSay('그 전에! 본격적인 토론은 타운홀에서 하고,', 800);
        await botSay(`사전 워밍업은 저 <strong>쁘이</strong>와 함께 가볍게 해볼까요? 😎`, 900);
        await delay(400);
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
    updateProgress(50);

    (async () => {
        await botSay('좋아요! 그럼 이제 질문 들어갑니다! 🥁', 800);
        await botSay('<strong>Q1. 우리 본부의 Comfort Zone, 어디에 있다고 느끼세요?</strong><br>솔직하게 적어주세요!<br><br><span style="color:#888; font-size:13px;">📝 예)<br>"매번 같은 보고,,,비슷한 방식만 반복해요"<br>"AI 써야 하는 건 아는데… 귀찮아요(인정 😅)"<br>"수주 경쟁력 개선이 필요해요"</span>', 1200);
        currentState = STATES.Q1_COMFORT;
        showTextInput();
    })();
}

function handleQ1State(text) {
    surveyData.q1Answer = text;
    updateProgress(65);

    (async () => {
        await botSay('👍 좋아요! 솔직하게 말씀해 주셨네요!', 700);
        await botSay('<strong>Q2. 본부가 Comfort Zone을 벗어난다면, 도착하고 싶은 \'Growth Zone\'은 어디인가요?</strong><br>(즉, 우리가 꿈꾸는 모습!)<br><br><span style="color:#888; font-size:13px;">📝 예)<br>"더 빠르고 효율적인 실행력!"<br>"수주 경쟁력 강화!"<br>"새로운 기술 학습과 도전 문화!"</span>', 1200);
        currentState = STATES.Q2_GROWTH;
        showTextInput();
    })();
}

function handleQ2State(text) {
    surveyData.q2Answer = text;
    updateProgress(80);

    (async () => {
        await botSay('🔥 좋은 목표예요!', 700);
        await botSay('자, 이제 마지막 질문이에요. 조금만 더 화이팅! 💪', 800);
        await botSay(`🌱 <strong>Q3. ${surveyData.name}님이 올해 벗어나보고 싶은 개인 혹은 업무 Comfort Zone은 무엇인가요?</strong><br>'아주 작은 한 걸음'도 좋아요.<br><br><span style="color:#888; font-size:13px;">📝 예)<br>"AI 도구 매일 10분 써보기!"<br>"회의에서 한 번은 내 의견 말하기!"<br>"새로운 프로세스 시범 적용!"</span>`, 1200);
        currentState = STATES.Q3_RESOLUTION;
        showTextInput();
    })();
}

function handleQ3State(text) {
    surveyData.q3Answer = text;
    updateProgress(90);

    (async () => {
        await botSay(`💚 ${surveyData.name}님이라면 정말 잘 해낼 수 있을 것 같아요!`, 800);
        await botSay('완전 기대돼요! 응원할게요 😊', 800);
        await botSay('마지막으로, 저에게 잘해주신 분께는 🎁 <strong>추첨을 통해 소정의 선물</strong>을 드리려고 해요!', 1000);
        await botSay('<strong>EP ID(사번)</strong>를 입력해주시면 추첨에 참여하실 수 있어요!<br><span style="color:#888; font-size:13px;">(개인정보는 오직 선물추첨을 위해 활용됩니다.)</span>', 1100);
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
        await botSay('아, 참! 마지막까지 와주신 분들께만 알려드릴게요 🤫', 900);
        await botSay('📅 <strong>[타운홀 미팅 안내]</strong><br>일시: 3월 30일 월요일 14:00~15:30<br>장소: 마곡 사이언스파크 B1 오디토리움<br><span style="color:#888; font-size:13px;">온라인 접속 장소 추후 안내 예정</span>', 1300);
        await botSay(`현장에서 <strong>${surveyData.name}</strong>님만의 Growth Zone 선언, 꼭 들려주세요! 🚀💙`, 1000);
        await botSay('작성해주신 서베이 내용을 안전하게 전송하고 있어요... ⏳', 800);
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
            "Q1(현재 Comfort Zone)": surveyData.q1Answer,
            "Q2(목표 Growth Zone)": surveyData.q2Answer,
            "Q3(올해의 다짐)": surveyData.q3Answer,
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
