#include <stdio.h>
#include <string.h>

void vulnerable_function(char *input) {
    char buffer[10];
    // Unsafe copy from input to buffer
    strcpy(buffer, input);
    printf("Buffer content: %s\n", buffer);
}

int main() {
    char user_input[256];
    printf("Enter some text: ");
    fgets(user_input, sizeof(user_input), stdin);
    // Remove newline character from fgets
    user_input[strcspn(user_input, "\n")] = 0;
    vulnerable_function(user_input);
    return 0;
}
