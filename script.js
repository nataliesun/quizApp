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
  }
];

// Create your initial store
const STORE = {
    // Current question
    currentQuestion: QUESTIONS[0].question,
    //Current question's answers
    currentAnswerChoices: QUESTIONS[0].answers,
    // User's answer choice(s)
    usersAnswerChoice: null,
    // Current view
    currentView: 'js-intro-view',
    // Score? Anything else?
    score: 0
};

// Template generators
function generateAnswerListHtml(answers) {
  const answerListHtml = `<form action="/answers" method="POST">
    <fieldset>
      <input type="radio" name="answer" value='${answers[0]}' id="answer-1">
      <label for="answer-1">${answers[0]}</label>

      <input type="radio" name="answer" value='${answers[1]}' id="answer-2">
      <label for="answer-2">${answers[1]}</label>

      <input type="radio" name="answer" value='${answers[2]}' id="answer-3">
      <label for="answer-3">${answers[2]}</label>

      <input type="radio" name="answer" value='${answers[3]}' id="answer-4">
      <label for="answer-4">${answers[3]}</label>

      <button type="submit" name="submit">Submit</button>
    </fieldset>
  </form>`;
  return answerListHtml;
}

function generateQuestionHtml() {
  return `<h2>${STORE.currentQuestion}</h2>`
}

const MAIN_VIEW_EL = $('#js-main-view');
// Rendering functions
function renderQuestion() {
  const html = generateQuestionHtml() + generateAnswerListHtml(STORE.currentAnswerChoices);
    MAIN_VIEW_EL.html(html);
}

// Event handlers
function handleAnswerSubmitted() {
  $('#js-main-view').on('click', '#submit-answer', event => {
    event.preventDefault();
    // Retrieve answer identifier of user-checked radio button
    const userAnswer = $("input:checked").val();
    console.log(userAnswer);
    // Perform check: User answer === Correct answer?
    // Update STORE and render appropriate section
  });
}

function handleStartQuiz() {
  $('#js-start-quiz').on('click', () => {
    renderQuestion();

  //update view
    STORE.currentView = 'js-main-view';
  });
}

function updateStore() {

}

$(function(){
    handleStartQuiz();
    handleAnswerSubmitted();
});
