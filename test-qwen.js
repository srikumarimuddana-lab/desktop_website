const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const getEnv = (key) => {
    const regex = new RegExp(`^${key}=(.*)$`, 'm');
    const match = env.match(regex);
    return match ? match[1].trim() : null;
};

const chatUrl = getEnv('LLM_API_URL');
const chatKey = getEnv('LLM_API_KEY');
const chatModel = getEnv('LLM_MODEL_NAME');

const embedUrl = getEnv('EMBEDDING_API_URL');
const embedKey = getEnv('EMBEDDING_API_KEY');
const embedModel = getEnv('EMBEDDING_MODEL_NAME');

console.log('--- Config Loaded ---');
console.log('Chat URL:', chatUrl);
console.log('Embed URL:', embedUrl);
console.log('Model:', chatModel, '| Embed Model:', embedModel);
console.log('Key ends with:', chatKey ? chatKey.slice(-4) : 'undefined');
console.log('---------------------\n');

const results = {};

async function testEndpoint(name, url, key, body) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        const data = await response.text();
        results[name] = { status: response.status, data };
    } catch (e) {
        results[name] = { error: e.message };
    }
}

async function runTests() {
    // Test Chat on coding-intl
    await testEndpoint('Chat Completions (coding-intl)', 'https://coding-intl.dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', chatKey, {
        model: chatModel,
        messages: [{ role: 'user', content: 'Say hello in 1 word.' }],
        max_tokens: 10
    });

    // Test Embeddings on coding-intl
    await testEndpoint('Embeddings (coding-intl)', 'https://coding-intl.dashscope.aliyuncs.com/compatible-mode/v1/embeddings', embedKey, {
        model: embedModel,
        input: 'Test sentence for embeddings.'
    });

    fs.writeFileSync('test-qwen-output.json', JSON.stringify(results, null, 2));
    console.log('Results written to test-qwen-output.json');
}

runTests();
