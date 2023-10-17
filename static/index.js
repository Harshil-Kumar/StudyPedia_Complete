document.addEventListener('DOMContentLoaded', function(){
const submitButton = document.getElementById('submit-btn');
const resultElement = document.getElementById('result');
const previousSearchesList = document.getElementById('previous-searches-list');

const searchTermsSet = new Set();

async function getMessage(e) {
  e.preventDefault();

  const searchTerm = document.getElementById('search-bar').value;

  if (searchTermsSet.has(searchTerm)) {
    return; 
  }
  searchTermsSet.add(searchTerm); 
  const finalSearchTerm = `Explain the following concept: ${searchTerm} totally like i am 12 years old. Don't ask any return questions. Just explain it to me. And give me examples too. And explain it very crispily. your response must be in markdown format with emojis if possible. When you give an answer, dont mention that you are giving the answer to a 10 year old. just direct answer.`

  previousSearchesList.innerHTML = '';
  searchTermsSet.forEach((searchTerm) => {
    const listItem = document.createElement('li');
    listItem.textContent = searchTerm;
    listItem.classList.add('search-item');
    listItem.addEventListener('click', function() {
      document.getElementById('search-bar').value = searchTerm;
      submitButton.click();
    });
    previousSearchesList.insertBefore(listItem, previousSearchesList.firstChild);
  })

  const options = {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer OPEN_AI_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: finalSearchTerm }],
      max_tokens: 2000
    })
  };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', options);
    const data = await response.json();

    const message = data.choices[0].message.content;

    const renderedMessage = marked(message);

    resultElement.innerHTML = renderedMessage;
  } catch (error) {
    console.error(error);
  }
}

submitButton.addEventListener('click', getMessage);

function searchConcept(searchTerm) {
  document.getElementById('search-bar').value = searchTerm;
  submitButton.click();
}

function openDifferencePage() {
  window.open('/difference', '_blank');
}


const differenceButton = document.getElementById('difference-btn');
differenceButton.addEventListener('click', openDifferencePage);


function openConnectionPage() {
  window.open('/connection', '_blank');
}


const connectionButton = document.getElementById('connection-btn');
connectionButton.addEventListener('click', openConnectionPage);

const languageSelect = document.getElementById('language-select');

languageSelect.addEventListener('change', function() {
  const selectedOption = languageSelect.value;

  window.location.href = `/language?option=${selectedOption}`;
});
});
