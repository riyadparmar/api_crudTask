const http = require('http');

let users = [];
let nextId = 1;

const requestListener = (req, res) => {
    const { method, url } = req;
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        if (url === '/users' && method === 'GET') {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(users));
        } else if (url === '/users' && method === 'POST') {
            const { name, email } = JSON.parse(body);
            if (!name || !email) {
                res.writeHead(400, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({ message: 'Name and email are required' }));
            } else {
                const newUser = { id: nextId++, name, email };
                users.push(newUser);
                res.writeHead(201, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(newUser));
            }
        } else if (url.startsWith('/users/') && method === 'PUT') {
            const id = parseInt(url.split('/')[2], 10);
            const { name, email } = JSON.parse(body);
            const userIndex = users.findIndex(user => user.id === id);
            if (userIndex > -1) {
                users[userIndex] = { ...users[userIndex], name, email };
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(users[userIndex]));
            } else {
                res.writeHead(404, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({ message: 'User not found' }));
            }
        } else if (url.startsWith('/users/') && method === 'DELETE') {
            const id = parseInt(url.split('/')[2], 10);
            users = users.filter(user => user.id !== id);
            res.writeHead(204, {'Content-Type': 'application/json'});
            res.end();
        } else {
            res.writeHead(404, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({ message: 'Route not found' }));
        }
    });
};

const server = http.createServer(requestListener);
server.listen(8082, () => {
    console.log('Server is running on http://localhost:8082');
}); 