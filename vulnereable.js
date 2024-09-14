function vulnerableFunction(input) {
    let buffer = new Array(10);

    // Vulnerable code: No input validation
    for (let i = 0; i < input.length; i++) {
        buffer[i] = input[i];
    }

    console.log("Buffer content:", buffer);
}

// Example usage
let userInput = "This is a long string that exceeds the buffer size";
vulnerableFunction(userInput);
