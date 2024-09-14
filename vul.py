from flask import Flask, request, make_response

app = Flask(__name__)

@app.route('/')
def index():
    value = request.args.get('value')  # User input is directly included in the header
    response = make_response('Hello, World!')
    response.headers['X-Header'] = value  # Vulnerable to HTTP Response Splitting
    return response

if __name__ == '__main__':
    app.run()
# Hard-coded secret key, which is a security risk
JWT_SECRET_KEY = 'supersecretkey'  # Noncompliant

def encode_jwt(payload):
    import jwt
    token = jwt.encode(payload, JWT_SECRET_KEY, algorithm='HS256')
    return token

def decode_jwt(token):
    import jwt
    decoded = jwt.decode(token, JWT_SECRET_KEY, algorithms=['HS256'])
    return decoded

# Example usage
print(encode_jwt({"user": "test"}))
