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

// Mock Data for EP Lookup
const mockEmployeeDB = {
    '12345': '홍길동',
    '99999': '김엘지',
    'admin': '관리자'
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
    const sysMsgHTML = `<div class="system-message">VS구성원님이 입장하셨습니다.</div>`;
    chatMessages.insertAdjacentHTML('beforeend', sysMsgHTML);
    scrollToBottom();

    showTyping();
    setTimeout(() => {
        removeTyping();
        addBotMessage('Step out of your Comfort Zone, <strong>VS본부 구성원님!</strong>');

        showTyping();
        setTimeout(() => {
            removeTyping();
            addBotMessage('👋 안녕하세요! 저는 VS본부 타운홀 미팅 정보를 안내해드릴 <strong>"쁘이"</strong>에요!');

            setTimeout(() => {
                showChoices([
                    { text: '반가워 쁘이! 👋', value: 'hello' },
                    { text: '그래서 너 누군데? 👀', value: 'who' }
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
        addBotMessage('3/30에 있을 타운홀 미팅에 대한 정보를 드리고, 여러분의 의견을 미리 들어보기 위해 왔어요.');

        setTimeout(() => {
            showTyping();
            setTimeout(() => {
                removeTyping();
                addBotMessage('먼저, 제가 뭐라고 부르면 될까요? (성함 또는 닉네임을 입력해주세요!)<br><span style="color:#888; font-size:13px;">👉 예: VS박보검, 나는야코딩왕, 마곡동슈퍼맨 등</span>');
                currentState = STATES.ASK_NAME;
                showTextInput();
            }, 600);
        }, 500);
    }, 500);
}

function handleNameState(nickname) {
    surveyData.name = nickname;
    updateProgress(30);

    addBotMessage(`😄 반가워요, <strong>${nickname}</strong>님!`);

    setTimeout(() => {
        showTyping();
        setTimeout(() => {
            removeTyping();
            addBotMessage('요즘 우리 본부 키워드가 <strong>“Comfort Zone 탈출”</strong>인거 아시나요?<br><br>심리학자 Judith Bardwick은 인간이 편안함에 오래 머물면 안정은 생기지만, 성장은 멈춘다고 말해요.');

            setTimeout(() => {
                showTyping();
                setTimeout(() => {
                    removeTyping();
                    addBotMessage('그래서 이번 타운홀에서는<br>👉 <strong>“우리는 어떤 Comfort Zone에 있고, 어떻게 한 발 더 도약할 것인가?”</strong><br>이걸 함께 이야기하려고 합니다.');

                    setTimeout(() => {
                        showTyping();
                        setTimeout(() => {
                            removeTyping();
                            addBotMessage('그 전에!<br>본격적인 토론은 타운홀에서 하고, 사전 워밍업은 저 <strong>쁘이</strong>와 함께 가볍게 해볼까요? 😎');

                            setTimeout(() => {
                                showTyping();
                                setTimeout(() => {
                                    removeTyping();
                                    showChoices([
                                        { text: '좋아 같이 해보자! 🚀', value: 'yes' },
                                        { text: '음...어디 한번 해봐 🤔', value: 'maybe' }
                                    ], handleComfortChoice);
                                    currentState = STATES.INTRO_COMFORT;
                                }, 600);
                            }, 800);
                        }, 1200);
                    }, 800);
                }, 1200);
            }, 600);
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
        addBotMessage('🥁 <strong>Q1. 우리 본부의 Comfort Zone, 어디에 있다고 느끼세요?</strong> 솔직하게 적어주세요!<br><br><span style="color:#888; font-size:13px;">📝 예)<br>“매번 같은 보고,,,비슷한 방식만 반복해요”<br>“AI 써야 하는 건 아는데… 귀찮아요(인정 😅)”<br>“수주 경쟁력 개선이 필요해요”</span>');
        currentState = STATES.Q1_COMFORT;
        showTextInput();
    }, 500);
}

function handleQ1State(text) {
    surveyData.q1Answer = text;
    updateProgress(65);
    addBotMessage('👍 좋아요! 그럼 두 번째 질문 갑니다.');

    setTimeout(() => {
        showTyping();
        setTimeout(() => {
            removeTyping();
            addBotMessage('🚀 <strong>Q2. 본부가 Comfort Zone을 벗어난다면, 도착하고 싶은 ‘Growth Zone’은 어디인가요?</strong> (즉, 우리가 꿈꾸는 모습!)<br><br><span style="color:#888; font-size:13px;">📝 예)<br>“더 빠르고 효율적인 실행력!”<br>“수주 경쟁력 강화!”<br>“새로운 기술 학습과 도전 문화!”</span>');
            currentState = STATES.Q2_GROWTH;
            showTextInput();
        }, 800);
    }, 500);
}

function handleQ2State(text) {
    surveyData.q2Answer = text;
    updateProgress(80);
    addBotMessage('🔥 좋은 목표예요! 자, 마지막입니다.');

    setTimeout(() => {
        showTyping();
        setTimeout(() => {
            removeTyping();
            addBotMessage(`🌱 <strong>Q3. ${surveyData.name}님이 올해 벗어나보고 싶은 개인 혹은 업무 Comfort Zone은 무엇인가요?</strong> ‘아주 작은 한 걸음’도 좋아요.<br><br><span style="color:#888; font-size:13px;">📝 예)<br>“AI 도구 매일 10분 써보기!”<br>“회의에서 한 번은 내 의견 말하기!”<br>“새로운 프로세스 시범 적용!”</span>`);
            currentState = STATES.Q3_RESOLUTION;
            showTextInput();
        }, 800);
    }, 500);
}

function handleQ3State(text) {
    surveyData.q3Answer = text;
    updateProgress(90);
    addBotMessage('🎉 모든 답변 잘 저장했습니다! 정말 감사합니다.');

    setTimeout(() => {
        showTyping();
        setTimeout(() => {
            removeTyping();
            addBotMessage('마지막으로, 저랑 대화를 나눠주신 분 중에 저에게 잘해주신 분께는 🎁 <strong>추첨을 위한 선물</strong>을 드리려고 해요.<br><br>선물 받고 싶으신 분은 <strong>EP ID(사번)</strong>를 입력해주세요!<br><span style="color:#888; font-size:13px;">(개인정보는 오직 선물추첨을 위해 활용됩니다. 원치 않으면 “건너뛰기" 버튼을 눌러주세요)</span>');

            showChoices([
                { text: '건너뛰기 ⏭️', value: 'skip' }
            ], handlePrizeEpIdState);

            currentState = STATES.PRIZE_EP_ID;
            showTextInput(); // allow both text input or choice button
        }, 800);
    }, 800);
}

function handlePrizeEpIdState(input) {
    const text = typeof input === 'string' ? input : input.value;
    if (typeof input !== 'string') {
        addUserMessage(input.text);
    }

    hideChoices();

    if (text !== 'skip' && text.trim() && text.trim() !== "건너뛰기" && text.trim() !== "건너뛰기 ⏭️") {
        surveyData.epId = text;
    } else {
        surveyData.epId = "건너뛰기";
    }

    updateProgress(100);

    userInput.disabled = true;
    sendButton.disabled = true;
    userInput.placeholder = "서베이가 완료되었습니다.";
    showTextInput();

    setTimeout(() => {
        showTyping();
        setTimeout(() => {
            removeTyping();
            addBotMessage('아, 참! 마지막까지 와주신 여러분들께만 타운홀 미팅 정보를 알려드릴게요(속닥)<br><br>📅 <strong>[타운홀 미팅 안내]</strong><br>일시: 3월 30일 월요일 14:00~15:30<br>장소: 마곡 사이언스파크 B1 오디토리움<br><span style="color:#888; font-size:13px;">온라인 접속 장소 추후 안내 예정</span><br><br>현장에서 <strong>' + surveyData.name + '</strong>님만의 Growth Zone 선언, 꼭 들려주세요! 🚀💙');

            setTimeout(() => {
                showTyping();
                setTimeout(() => {
                    removeTyping();
                    addBotMessage('작성해주신 서베이 내용을 전송하고 있습니다... 🚀');
                    submitSurveyData();
                }, 800);
            }, 1500);
        }, 800);
    }, 600);
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
                <div class="bot-avatar" style="font-size: 18px; background-color: #f7f8fa; box-shadow: 0 4px 10px rgba(165, 0, 52, 0.3);">
                   🐰✌️
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
                <div class="bot-avatar" style="font-size: 18px; background-color: #f7f8fa; box-shadow: 0 4px 10px rgba(165, 0, 52, 0.3);">
                    🐰✌️
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
            "이름": surveyData.name,
            "선택형답변": surveyData.comfortZoneChoice,
            "Q1(현재 Comfort Zone)": surveyData.q1Answer,
            "Q2(목표 Growth Zone)": surveyData.q2Answer,
            "Q3(올해의 다짐)": surveyData.q3Answer,
            "제출시간": new Date().toLocaleString('ko-KR')
        };

        if (ENDPOINT_URL.includes("YOUR_FORM_ID_HERE")) {
            console.warn("Formspree URL is not configured yet. Skipping actual network request.");
            setTimeout(() => {
                showTyping();
                setTimeout(() => {
                    removeTyping();
                    addBotMessage('✅ (테스트 모드) 데이터 전송이 완료되었습니다!');
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
                    addBotMessage('✅ 성공적으로 의견이 제출되었습니다! 참여해주셔서 감사합니다.');
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
                addBotMessage('⚠️ 죄송합니다. 데이터 전송 중 오류가 발생했습니다. 나중에 다시 시도해주세요.');
                currentState = STATES.OUTRO;
            }, 1000);
        }, 1000);
    }
}
