#!/usr/bin/env node
// sign_server.js - 接收明文数据，返回 sign 值
// 用法: echo '{"data":"json_string"}' | node sign_server.js
//   或: node sign_server.js --sign "json_string"

const { getSecuritySign } = require('./sign.js');

if (process.argv[2] === '--sign') {
    const data = process.argv[3];
    process.stdout.write(getSecuritySign(data));
} else {
    let input = '';
    process.stdin.setEncoding('utf-8');
    process.stdin.on('data', chunk => input += chunk);
    process.stdin.on('end', () => {
        try {
            const obj = JSON.parse(input);
            process.stdout.write(getSecuritySign(obj.data));
        } catch (e) {
            process.stdout.write(getSecuritySign(input.trim()));
        }
    });
}
