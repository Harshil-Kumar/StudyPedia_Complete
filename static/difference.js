document.addEventListener('DOMContentLoaded', function(){
  const calculateButton = document.getElementById('search-btn');
  const resultElement = document.getElementById('result');
  const speakerButton = document.getElementById('speaker-btn');

  async function calculateDifference() {
    const input1 = document.getElementById('input1').value;
    const input2 = document.getElementById('input2').value;

    const difference = await getWordDifference(input1, input2);

    resultElement.innerHTML = difference;
  }

  async function getWordDifference(input1, input2) {
    const finalSearchTerm = "What is the difference between " + input1 + " and " + input2 + "? Dont ask any questions in return. Explain it briefly. Give me example if possible. Explain in tabular format if possible. your response must be in markdown format with emojis if possible. ";

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

      resultElement.innerHTML = renderedMessage;
      return resultElement.innerHTML;
    } catch (error) {
      console.error(error);
      return 'Error: Failed to calculate the difference.';
    }
  }

  calculateButton.addEventListener('click', calculateDifference);

  const languageSelect = document.getElementById('language-select');

  languageSelect.addEventListener('change', function() {
    const selectedOption = languageSelect.value;

    window.location.href = `/lang_difference?option=${selectedOption}`;
  });


});
