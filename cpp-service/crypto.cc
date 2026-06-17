#include <napi.h>
#include <openssl/sha.h>
#include <sstream>
#include <iomanip>
#include <string>
#include <random>

using namespace Napi;

// Function to generate random salt
std::string generateSalt() {
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(0, 255);
    
    std::string salt;
    for (int i = 0; i < 32; i++) {
        salt += static_cast<char>(dis(gen));
    }
    return salt;
}

// Function to hash password with salt
std::string hashPasswordWithSalt(const std::string& password, const std::string& salt) {
    unsigned char hash[SHA256_DIGEST_LENGTH];
    SHA256_CTX sha256;
    SHA256_Init(&sha256);
    SHA256_Update(&sha256, password.c_str(), password.length());
    SHA256_Update(&sha256, salt.c_str(), salt.length());
    SHA256_Final(hash, &sha256);
    
    std::stringstream ss;
    for (int i = 0; i < SHA256_DIGEST_LENGTH; i++) {
        ss << std::hex << std::setw(2) << std::setfill('0') << (int)hash[i];
    }
    return ss.str();
}

// JavaScript function: hashPassword(password)
// Returns: { hashedPassword, salt }
Value HashPassword(const CallbackInfo& info) {
    Env env = info.Env();
    
    if (info.Length() < 1) {
        TypeError::New(env, "Password is required").ThrowAsJavaScriptException();
        return env.Null();
    }
    
    std::string password = info[0].As<String>().Utf8Value();
    std::string salt = generateSalt();
    std::string hashed = hashPasswordWithSalt(password, salt);
    
    Object result = Object::New(env);
    result.Set("hashedPassword", String::New(env, hashed));
    result.Set("salt", String::New(env, salt));
    
    return result;
}

// JavaScript function: validatePassword(password, hashedPassword, salt)
// Returns: true/false
Value ValidatePassword(const CallbackInfo& info) {
    Env env = info.Env();
    
    if (info.Length() < 3) {
        TypeError::New(env, "Password, hash, and salt are required").ThrowAsJavaScriptException();
        return env.Null();
    }
    
    std::string password = info[0].As<String>().Utf8Value();
    std::string hashed = info[1].As<String>().Utf8Value();
    std::string salt = info[2].As<String>().Utf8Value();
    
    std::string computedHash = hashPasswordWithSalt(password, salt);
    bool isValid = (computedHash == hashed);
    
    return Boolean::New(env, isValid);
}

// JavaScript function: generateToken()
// Returns: random token string
Value GenerateToken(const CallbackInfo& info) {
    Env env = info.Env();
    
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(0, 15);
    
    std::stringstream ss;
    ss << std::hex << std::setfill('0');
    
    for (int i = 0; i < 32; i++) {
        ss << dis(gen);
        if (i == 7 || i == 11 || i == 15 || i == 19) {
            ss << "-";
        }
    }
    
    return String::New(env, ss.str());
}

// Initialize the module
Object Init(Env env, Object exports) {
    exports.Set("hashPassword", Function::New(env, HashPassword));
    exports.Set("validatePassword", Function::New(env, ValidatePassword));
    exports.Set("generateToken", Function::New(env, GenerateToken));
    return exports;
}

NODE_API_MODULE(addon, Init)