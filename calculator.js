const http = require('http');
const PORT = 6000;

const server = http.createServer((req, res) => {
    if (req.url === '/calculate' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { num1, num2, operation } = JSON.parse(body);
            const result = performCalculation(num1, num2, operation);
            if (result !== undefined) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ result }));
            } else {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "Invalid operation or input" }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Not Found" }));
    }
});

function performCalculation(num1, num2, operation) {
    switch (operation) {
        case 'add':
            return num1 + num2;
        case 'subtract':
            return num1 - num2;
        case 'multiply':
            return num1 * num2;
        case 'divide':
            return num2 !== 0 ? num1 / num2 : undefined;
        default:
            return undefined;
    }
}

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});