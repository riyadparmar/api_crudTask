const http = require("http");
const PORT = 5000;

let users = [];

const server = http.createServer((req, res) => {
    const { method, url } = req;
    // console.log(req);
    const routeKey = `${method}:${url}`;
    const routeAction = router[routeKey];

    if (routeAction) {
        routeAction(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Not Found" }));
    }
});

const router = {
    'POST:/createUser': postCreateUser,
    'GET:/getUser': getUser,
    'PATCH:/updateUser': patchUpdateUser,
    'DELETE:/deleteUser': deleteUser
};

function postCreateUser(req, res) {
    readRequestBody(req, (body) => {
        const { email, password } = JSON.parse(body);
        const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
        const passRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

        if (!email || !password) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Email and password are required" }));
            return;
        }

        if (!emailRegex.test(email) || !passRegex.test(password)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Invalid email or password format" }));
            return;
        }

        const userExists = users.some(user => user.email === email);
        if (userExists) {
            res.writeHead(409, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "User already exists" }));
            return;
        }

        users.push({ email, password });
        res.writeHead(201), { 'Content-Type': 'application/json' };
        res.end(JSON.stringify({ message: "User created successfully" }));
    });
}

function getUser(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
}

function patchUpdateUser(req, res) {
    readRequestBody(req, (body) => {
        const { email, newPassword } = JSON.parse(body);
        const passRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

        if (!email || !newPassword) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Email and new password are required" }));
            return;
        }

        if (!passRegex.test(newPassword)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Invalid new password format" }));
            return;
        }

        const userIndex = users.findIndex(user => user.email === email);
        if (userIndex !== -1) {
            users[userIndex].password = newPassword;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Password updated successfully" }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "User not found" }));
        }
    });
}

function deleteUser(req, res) {
    readRequestBody(req, (body) => {
        const { email } = JSON.parse(body);

        if (!email) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Email is required" }));
            return;
        }

        const initialLength = users.length;
        users = users.filter(user => user.email !== email);

        if (users.length !== initialLength) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "User deleted successfully" }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "User not found" }));
        }
    });
}

function readRequestBody(req, callback) {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => callback(body));
}

server.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});
