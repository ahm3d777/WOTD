function fetchWord() {
    // Use your chosen API to fetch word data
    // Example: Using Merriam-Webster's API
    fetch('https://www.dictionaryapi.dev/api/v3/references/collegiate/definitions?wd=random')
      .then(response => response.json())
      .then(data => {
        // Extract relevant information from the data
        const word = data[0].meta.id;
        const definition = data[0].hwi.prs[0].mw[0].def[0].td[0].sn;
        const audioUrl = data[0].hwi.prs[0].ipa; // Assuming pronunciation audio URL is available
        const bengaliTranslation = // Implement logic to translate English word to Bengali
        // ... update other divs with corresponding data
      })
      .catch(error => console.error(error));
  }
  