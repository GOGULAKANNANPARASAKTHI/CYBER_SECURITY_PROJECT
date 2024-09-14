#include <string>
void vulnerableFunction(const char* userInput) {
    // 1. Buffer Overflow Vulnerability
    char buffer[10];
    strcpy(buffer, userInput);  // No bounds checking

    std::cout << "Buffer contains: " << buffer << std::endl;
}

void useAfterFree() {
    char* ptr = (char*)malloc(10);
    strcpy(ptr, "Hello");

    free(ptr);  // Memory is freed
    std::cout << "After free: " << ptr << std::endl;  // Use-after-free vulnerability
}

void integerOverflow() {
    int a = INT_MAX;  // Maximum value of an int
    int b = 10;
    int c = a + b;  // Integer overflow vulnerability

    std::cout << "Result of overflow: " << c << std::endl;
}

int main() {
    // Example input for buffer overflow
    const char* input = "ThisIsTooLongForBuffer";
    vulnerableFunction(input);

    // Demonstrate use-after-free
    useAfterFree();

    // Demonstrate integer overflow
    integerOverflow();

    return 0;
}
