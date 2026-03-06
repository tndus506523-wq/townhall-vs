// State Definitions
const STATES = {
    INIT: 0,
    CHECK_EP: 1,
    INTRO_COMFORT: 2,
    Q1_COMFORT: 3,
    Q2_GROWTH: 4,
    Q3_RESOLUTION: 5,
    OUTRO: 6
};

// Global Data Store
const surveyData = {
    epId: '',
    name: '',
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

// Initialization
function initChat() {
    showTyping();
    setTimeout(() => {
        removeTyping();
        addBotMessage('안녕하세요! LG전자 타운홀 미팅 사전 서베이 챗봇 <strong>엘리</strong>입니다. 💬');

        showTyping();
        setTimeout(() => {
            removeTyping();
            addBotMessage('원활한 진행을 위해 먼저 <strong>EP ID</strong>를 입력해 주시겠어요?<br><span style="color:#888; font-size:13px;">(예: 12345)</span>');
        }, 1200);
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
            case STATES.INIT:
                handleInitState(text);
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
        }
    }, 1200); // Simulate bot typing delay
}

function handleInitState(epId) {
    surveyData.epId = epId;
    // Mock lookup
    const name = mockEmployeeDB[epId] || '임직원'; // Fallback
    surveyData.name = name;

    addBotMessage(`반가워요! <strong>${name}</strong>님! 😊`);

    setTimeout(() => {
        showTyping();
        setTimeout(() => {
            removeTyping();
            addBotMessage('이번 타운홀 미팅 주제는 <strong>"Step out of Comfort Zone"</strong>입니다.');

            setTimeout(() => {
                showTyping();
                setTimeout(() => {
                    removeTyping();
                    addBotMessage('심리학자 Judith Bardwick은 Comfort zone에 머무르는 경우 편안함을 느끼지만 성장이 정체되며, 이것을 벗어나면 <strong>Growth Zone</strong>으로 갈 수 있다고 말했는데요.');

                    setTimeout(() => {
                        showTyping();
                        setTimeout(() => {
                            removeTyping();
                            addBotMessage('이번 타운홀 미팅에서도 우리 본부가 어떻게 하면 Comfort Zone을 벗어나 한발 더 도약할 수 있을지 그 방법에 대해 논의해보고자 합니다.<br><br>그 전에, 여러분의 소중한 의견이 필요합니다! 🙌');

                            setTimeout(() => {
                                showTyping();
                                setTimeout(() => {
                                    removeTyping();
                                    addBotMessage('Comfort Zone에 대해서 알아보고 의견을 남겨보실래요?');
                                    showChoices([
                                        { text: '1. 좋아요 궁금해요! 🚀', value: 'yes' },
                                        { text: '2. 음... 그래요 알아볼게요 🤔', value: 'maybe' }
                                    ], handleChoiceSelection);
                                    currentState = STATES.INTRO_COMFORT;
                                }, 1000);
                            }, 1500);
                        }, 2500);
                    }, 1500);
                }, 2500);
            }, 1000);
        }, 1200);
    }, 800);
}

function handleChoiceSelection(choiceData) {
    addUserMessage(choiceData.text);
    surveyData.comfortZoneChoice = choiceData.text;
    hideChoices();
    showTyping();

    setTimeout(() => {
        removeTyping();
        addBotMessage('좋습니다! 그럼 첫 번째 질문입니다.');

        setTimeout(() => {
            showTyping();
            setTimeout(() => {
                removeTyping();
                addBotMessage('<strong>1. 여러분이 생각하는 우리 본부의 Comfort Zone은 무엇인가요?</strong><br><br><span style="color:#888; font-size:13px;">📝 예시: 수주 경쟁력이 낮아요, 일하는 방식이 비효율적이에요, 귀찮아서 AI를 활용하지 않아요 등</span>');
                currentState = STATES.Q1_COMFORT;
                showTextInput();
            }, 1500);
        }, 800);
    }, 1200);
}

function handleQ1State(text) {
    surveyData.q1Answer = text;
    addBotMessage('솔직한 의견 감사합니다. 그렇다면 두 번째 질문입니다. ✨');

    setTimeout(() => {
        showTyping();
        setTimeout(() => {
            removeTyping();
            addBotMessage('<strong>2. 우리 본부가 Comfort Zone을 벗어나 Growth Zone으로 간다면 그 목적지는 어디일까요?</strong><br><br><span style="color:#888; font-size:13px;">📝 예시: 수주 경쟁력을 높여요, 지금 하는 일을 더 빠르고 효율적으로 해요 등</span>');
            currentState = STATES.Q2_GROWTH;
            showTextInput();
        }, 1500);
    }, 1000);
}

function handleQ2State(text) {
    surveyData.q2Answer = text;
    addBotMessage('멋진 목표네요! 이제 마지막 질문입니다. 💪');

    setTimeout(() => {
        showTyping();
        setTimeout(() => {
            removeTyping();
            addBotMessage('<strong>3. 개인적/업무적으로 올 한해 Comfort Zone을 벗어나 "이것만은 해보겠다!" 하는 다짐을 작성해주세요.</strong>');
            currentState = STATES.Q3_RESOLUTION;
            showTextInput();
        }, 1500);
    }, 1000);
}

function handleQ3State(text) {
    surveyData.q3Answer = text;
    addBotMessage('소중한 다짐과 의견들을 모두 잘 기록했습니다! 참여해 주셔서 정말 감사합니다. 🎉');

    userInput.disabled = true;
    sendButton.disabled = true;
    userInput.placeholder = "서베이가 완료되었습니다.";
    showTextInput();

    setTimeout(() => {
        showTyping();
        setTimeout(() => {
            removeTyping();
            addBotMessage('<strong>[타운홀 미팅 안내]</strong><br>📅 <strong>일정:</strong> 3월 30일 월요일 14:00 ~ 15:30<br>📍 <strong>장소:</strong> 마곡 사이언스파크 B1 오디토리움<br><br>현장에서 뵙겠습니다! 🎈');

            setTimeout(() => {
                showTyping();
                setTimeout(() => {
                    removeTyping();
                    addBotMessage('작성해주신 서베이 내용을 전송하고 있습니다... 🚀');
                    submitSurveyData();
                }, 1500);
            }, 2000);
        }, 2000);
    }, 1500);
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
                <div class="bot-avatar">
                   엘리
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
                <div class="bot-avatar">
                    엘리
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
