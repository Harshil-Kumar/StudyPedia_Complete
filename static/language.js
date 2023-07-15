document.addEventListener('DOMContentLoaded', function(){
const submitButton = document.getElementById('submit-btn');
const resultElement = document.getElementById('result');
const previousSearchesList = document.getElementById('previous-searches-list');
// Get the selected option from the URL query parameter
const urlParams = new URLSearchParams(window.location.search);
const selectedOption = urlParams.get('option');

// Use the selected option as needed
console.log('Selected option:', selectedOption);


// Function to handle the form submission
async function getMessage(e) {
  e.preventDefault();
  
  const searchTerm = document.getElementById('search-bar').value;
  const finalSearchTerm = "Explain the following concept: " + searchTerm+ "totally in" +selectedOption+ "language. Don't ask any return questions. Just explain it to me. And give me examples too. And explain it very crispily. your response must be in markdown format with emojis if possible. When you give an answer, dont mention that you are giving the answer to a 10 year old. just direct answer.";

  // Create a new list item element for the search query
  const listItem = document.createElement('li');
  listItem.textContent = searchTerm;
  listItem.classList.add('search-item');
  listItem.addEventListener('click', function() {
    searchConcept(searchTerm);
  });

  // Append the new list item to the previous searches list
  previousSearchesList.insertBefore(listItem, previousSearchesList.firstChild);

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

    // Extract the message content from the response
    const message = data.choices[0].message.content;

    const renderedMessage = marked(message);

    // Update the content of the result element with the message

    resultElement.innerHTML = renderedMessage;
  } catch (error) {
    console.error(error);
  }
}

submitButton.addEventListener('click', getMessage);

// Function to search a concept
function searchConcept(searchTerm) {
  document.getElementById('search-bar').value = searchTerm;
  submitButton.click();
}

// Function to open the "Difference between Concepts" page
function openDifferencePage() {
  window.open('/lang_difference', '_blank');
}

// Add event listener to the "Difference" button
const differenceButton = document.getElementById('difference-btn');
differenceButton.addEventListener('click', openDifferencePage);

// Function to open the "Connection between Concepts" page
function openConnectionPage() {
  window.open('/lang_connection', '_blank');
}

// Add event listener to the "Connection" button
const connectionButton = document.getElementById('connection-btn');
connectionButton.addEventListener('click', openConnectionPage);

const languageSelect = document.getElementById('language-select');

languageSelect.addEventListener('change', function() {
    const selectedOption = languageSelect.value;
  
    // Redirect to the language.html page with the selected option as a query parameter
    window.location.href = `/language?option=${selectedOption}`;
  });

});



