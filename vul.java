import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.security.SecureRandom;
import java.util.Base64;

public class vul {
    public static void main(String[] args) throws Exception {
        // Hard-coded key
        byte[] keyBytes = "my_secret_key".getBytes();
        SecretKey secretKey = new SecretKeySpec(keyBytes, "AES");

        // Weak key size
        KeyGenerator keyGen = KeyGenerator.getInstance("AES");
        keyGen.init(128); // Weak key size
        SecretKey weakKey = keyGen.generateKey();

        // Insecure random number generation
        SecureRandom insecureRandom = new SecureRandom();
        insecureRandom.setSeed(12345); // Insecure seed

        // Insecure protocol
        Cipher cipher = Cipher.getInstance("AES/ECB/NoPadding"); // Insecure protocol
        cipher.init(Cipher.ENCRYPT_MODE, secretKey);

        // Sensitive data
        String sensitiveData = "This is sensitive data";

        // Encrypt sensitive data
        byte[] encryptedData = cipher.doFinal(sensitiveData.getBytes());
        System.out.println("Encrypted data: " + Base64.getEncoder().encodeToString(encryptedData));
 }
}