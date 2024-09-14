function displayUserInput(input: string) {
    const outputElement = document.getElementById('output');
    if (outputElement) {
        outputElement.innerHTML = `User input: ${input}`; // Vulnerable to XSS
    }
}

// Vulnerability 2: Insecure Storage of Sensitive Data
function storeSensitiveData(key: string, data: string) {
    localStorage.setItem(key, data); // Insecure storage of sensitive data
}