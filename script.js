// In-memory database of questions
const QUESTIONS = [
  {
    question: `What does 감사합니다 [gam-sa-ham-ni-da] mean?`,
    answers: ['A. I like you.' , 'B. Thank you.', 'C. Nice to meet you.', 'D. You are very kind.'],
    correctAnswer: 'B. Thank you.'
  },
  {
    question: `What does 오랜만이에요 [o-raen-ma-ni-e-yo] mean?`,
    answers: [`A. Thank you very much.`, `B. It will take a long time.`, `C. Long time no see.`, `D. Good-bye.`],
    correctAnswer: 'C. Long time no see.'
  },
  {
    question: `Which of the following has the most similar meaning to 감사합니다 [gam-sa-ham-ni-da]?`,
    answers: [`A. 그렇습니다. [geu-reo-sseum-ni-da]`, `B. 안녕히 계세요. [an-nyeong-hi gye-se-yo]`, `C. 저도 모르겠어요. [jeo-do mo-reu-ge-sseo-yo]`, `D. 고맙습니다. [go-map-seum-ni-da]`],
    correctAnswer: `D. 고맙습니다. [go-map-seum-ni-da]`
  },
  {
    question: `What does 내일 봐요 [nae-il bwa-yo] mean?`,
    answers: [`A. See you tomorrow.`, `B. See you later.`, `C. See you again`, `D. Take care.`],
    correctAnswer: 'A. See you tomorrow.'
  },
  {
    question: `Which of these expressions can you NOT use when you meet someone for the first time?`,
    answers: [`A. 안녕하세요. [an-nyeong-ha-se-yo]`, `B. 반갑습니다. [ban-gap-seum-ni-da]`, `C. 오랜만이에요. [o-raen-ma-ni-e-yo]`, `D. 처음 뵙겠습니다. [cheo-eum boep-ge-sseum-ni-da]`],
    correctAnswer: `C. 오랜만이에요. [o-raen-ma-ni-e-yo]`
  }
];
//Current question index
let i = 0;
// Create your initial store
const STORE = {
    // Current question
    currentQuestion: QUESTIONS[i].question,
    //Current question's answers
    currentAnswerChoices: QUESTIONS[i].answers,
    //Current question's answers
    currentCorrectAnswer: QUESTIONS[i].correctAnswer,
    //correct choice?
    wasCorrect: '',
    // User's answer choice(s)
    usersAnswerChoices: [],
    // Current view
    currentView: 'js-intro-view',
    // Score? Anything else?
    score: [0, 0]
};

// Template generators
function generateAnswerListHtml(answers) {
  const answerListHtml = `<form action="/answers" method="POST">
    <fieldset>
      <div class="row">
        <div class="box col-6">
          <input type="radio" name="answer" value='${answers[0]}' id="answer-1" required>
          <label for="answer-1">${answers[0]}</label>
        </div>

        <div class="box col-6">
          <input type="radio" name="answer" value='${answers[1]}' id="answer-2" required>
          <label for="answer-2">${answers[1]}</label>
        </div>
      </div>

      <div class="row">
        <div class="box col-6">
          <input type="radio" name="answer" value='${answers[2]}' id="answer-3" required>
          <label for="answer-3">${answers[2]}</label>
        </div>

        <div class="box col-6">
          <input type="radio" name="answer" value='${answers[3]}' id="answer-4" required>
          <label for="answer-4">${answers[3]}</label>
        </div>
      </div>
    </fieldset>
    <button class="button2" type='submit' name="submit" id="js-submit-answer">Submit</button>
  </form>`;
  return answerListHtml;
}

function generateCounterHtml() {
  const counterHtml = `
    <div class='margin-top40 margin-left20 margin-bottom20'>
    <div class=''>Question ${i+1} of ${QUESTIONS.length}</div>
    <div class=''>Correct ${STORE.score[0]} - Incorrect ${STORE.score[1]}</div>
    </div>`;
  return counterHtml;
}

function generateQuestionHtml() {
  return `
  <div class="margin-left20 margin-bottom20">
  <h2>${STORE.currentQuestion}</h2>
  </div>`
}

function generateFeedbackHtml(isCorrect, answer = STORE.currentCorrectAnswer) {
  const correctHtml = `<h2 class="margin-top40 margin-bottom20 margin-left20">You are right!</h2>
  <div class='loading margin-bottom20'></div>`;

  const wrongHtml = `<h2 class="margin-top40 margin-bottom20 margin-left20">Incorrect!</h2>
  <div class='loading margin-bottom20'></div>
  <p class="margin-left20">The correct answer is: ${answer}</p>`;

  return isCorrect ? correctHtml : wrongHtml;
}

function generateFinalPageHtml() {
  const finalScore = STORE.score;
  let feedback = ''
  const percentage = Math.round(finalScore[0]/QUESTIONS.length*100);
  if (percentage >= 70) {
    feedback = `<h2 class="margin-bottom20">Good job! You passed.</h2>`;
  } else {
    feedback = `<h2 class="margin-bottom20">Try again!</h2>`
  }
  return `<div class='center margin-top80'>` + feedback + `<p class="margin-bottom10">You answered ${finalScore[0]} correct and ${finalScore[1]} wrong. (${percentage}%)</p>
  <button type='button' class='button2' name='restart-quiz' id='js-restart-button'>Restart Quiz!</button>
  </div>`;
}


const MAIN_VIEW_EL = $('#js-main-view');
// Rendering functions
function renderQuestion() {
  const html = generateQuestionHtml() + generateAnswerListHtml(STORE.currentAnswerChoices);
  MAIN_VIEW_EL.html(html);
}

function renderFeedback(wasCorrect) {
  let html = '';
  if (wasCorrect) {
    html = generateFeedbackHtml(true);
  } else {
    html = generateFeedbackHtml(false);
  }
  MAIN_VIEW_EL.html(html);
}


function renderFinalPage() {
  const html = generateFinalPageHtml();
  MAIN_VIEW_EL.html(html);
  HEADER_VIEW_EL.html('');
}


const HEADER_VIEW_EL = $('#js-counters');

function renderCounters() {
  const html = generateCounterHtml();
  HEADER_VIEW_EL.html(html);
}

// Event handlers
function handleAnswerSubmitted() {
  $('#js-main-view').submit('#js-submit-answer', event => {
    event.preventDefault();
    // Retrieve answer identifier of user-checked radio button
    let userAnswer = $("input:checked").val();
    // Perform check: User answer === Correct answer?
    let correctAnswer = STORE.currentCorrectAnswer;

    console.log(correctAnswer);
    if (userAnswer === correctAnswer) {
      ++STORE.score[0];
      renderFeedback(true);
    } else {
      ++STORE.score[1];
      renderFeedback(false);
    }
    //Update counters
    renderCounters();
    // Update STORE and render appropriate section
    ++i; //question index
    if (i < QUESTIONS.length) {
      updateStore();
      setTimeout(renderQuestion, 3000);
    } else {
      setTimeout(renderFinalPage, 3000);
      updateView('review');
    }
  });
};

function handleBoxClick() {
  //when user clicks box, make that radio checked
  $('#js-main-view').on('click', '.box', event => {
    let target = $(event.target);
    let child = target.children();
    if (child.is('input')) {
      child.attr('checked', true);
    }
    console.log(child);
//doesn't work after clicking on actual label and then div
  });
};

function handleStartQuiz() {
  $('#js-start-quiz').on('click', () => {
    //update view
    updateView('question');
    renderQuestion();
    renderCounters();
  });
};

function handleRestartQuiz() {
  $('#js-main-view').on('click', '#js-restart-button',  () => {

    i = 0;
    updateStore();
    STORE.score = [0, 0];
    updateView('main');
    renderCounters();
    renderQuestion();
  });
};

// Update Functions
function updateStore() {
  STORE.currentQuestion = QUESTIONS[i].question;
  //Current question's answers
  STORE.currentAnswerChoices= QUESTIONS[i].answers;
  //Current question's answer
  STORE.currentCorrectAnswer= QUESTIONS[i].correctAnswer;
};

function updateView(view) {
  if (view === 'question') {
      STORE.currentView = 'js-question-view';
  } else if (view === 'final') {
      STORE.currentView = 'js-final-view';
  }
};

$(function(){
    handleStartQuiz();
    handleRestartQuiz();
    handleAnswerSubmitted();
    handleBoxClick();
});
