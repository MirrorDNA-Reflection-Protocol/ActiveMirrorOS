#!/usr/bin/env node

/**
 * ActiveMirrorOS - JavaScript Starter Template
 *
 * A minimal "Hello, ActiveMirrorOS" example to get you started.
 * Copy this file and modify it for your use case.
 *
 * Author: ActiveMirrorOS Team
 * License: MIT
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Check if SDK exists
const sdkPath = path.join(__dirname, 'javascript', 'activemirror.js');
if (!fs.existsSync(sdkPath)) {
    console.error('❌ ActiveMirrorOS SDK not found!');
    console.error('\nMake sure you\'re running from the sdk/ directory:');
    console.error('  cd sdk');
    console.error('  node javascript_starter.js');
    process.exit(1);
}

const { ActiveMirror } = require('./javascript/activemirror.js');
const { ReflectiveClient } = require('./javascript/reflective-client.js');
const { VaultMemory } = require('./javascript/vault.js');


/**
 * Simplest possible example: create a session, add messages, retrieve context.
 */
function helloActiveMirror() {
    console.log('='.repeat(60));
    console.log('Hello, ActiveMirrorOS!');
    console.log('='.repeat(60));

    // Initialize ActiveMirror with JSON storage
    const mirror = new ActiveMirror('./hello_memory');
    console.log('\n✓ ActiveMirror initialized with JSON storage');

    // Create a new session
    const sessionId = 'hello-session';
    const session = mirror.createSession(sessionId);
    console.log(`✓ Created session: ${sessionId}`);

    // Add messages
    session.addMessage(
        'user',
        'Hello, ActiveMirrorOS! Can you remember this message?'
    );
    session.addMessage(
        'assistant',
        'Yes! I\'ll remember this conversation. Unlike traditional AI, ' +
        'I persist across sessions. Run this script again to see!'
    );
    console.log(`✓ Added messages (total: ${session.messages.length})`);

    // Display conversation
    console.log('\n' + '─'.repeat(60));
    console.log('Conversation:');
    console.log('─'.repeat(60));
    session.messages.forEach(msg => {
        console.log(`\n${msg.role.toUpperCase()}: ${msg.content}`);
    });
    console.log('─'.repeat(60));

    console.log('\n✓ Session saved to: ./hello_memory/');
    console.log('✓ Run this script again to see persistent memory in action!');
}


/**
 * Example using LingOS Lite reflective patterns.
 */
function exampleWithReflectivePatterns() {
    console.log('\n' + '='.repeat(60));
    console.log('Reflective Patterns Example');
    console.log('='.repeat(60));

    // Create reflective client
    const client = new ReflectiveClient('./reflective_memory');
    console.log('\n✓ ReflectiveClient initialized');

    // Create session
    const sessionId = client.createSession('reflection-demo');
    console.log(`✓ Created session: ${sessionId}`);

    // Try different patterns
    const patterns = [
        { pattern: 'exploratory', input: 'What should I build today?' },
        { pattern: 'analytical', input: 'Break down the components of a good app.' },
        { pattern: 'creative', input: 'Give me innovative ideas for AI products.' },
        { pattern: 'strategic', input: 'Plan the steps to launch my product.' }
    ];

    console.log('\n' + '─'.repeat(60));
    console.log('Reflective Responses:');
    console.log('─'.repeat(60));

    patterns.forEach(({ pattern, input }) => {
        const response = client.reflect({
            sessionId: sessionId,
            userInput: input,
            pattern: pattern
        });
        console.log(`\n[${pattern.toUpperCase()}]`);
        console.log(`You: ${input}`);
        console.log(`Reflection: ${response.reflection}`);
    });

    console.log('─'.repeat(60));
    console.log('\n✓ Try different patterns for different thinking modes!');
}


/**
 * Example using encrypted vault for sensitive data.
 */
function exampleWithVault() {
    console.log('\n' + '='.repeat(60));
    console.log('Encrypted Vault Example');
    console.log('='.repeat(60));

    // Create encrypted vault
    const vault = new VaultMemory({
        vaultPath: './hello_vault.json',
        password: 'demo-password-change-in-production'
    });
    console.log('\n✓ Encrypted vault initialized (AES-256-GCM)');

    // Store sensitive data
    vault.store(
        'api-key',
        'sk-super-secret-key-12345',
        'credentials',
        { service: 'OpenAI', env: 'development' }
    );
    console.log('✓ Stored encrypted credential');

    vault.store(
        'user-pii',
        { name: 'Alice', email: 'alice@example.com' },
        'personal',
        { user_id: 'user_123' }
    );
    console.log('✓ Stored encrypted personal data');

    // Retrieve data
    const apiKey = vault.retrieve('api-key');
    console.log(`\n✓ Retrieved: api-key = ${apiKey.substring(0, 10)}...`);

    const pii = vault.retrieve('user-pii');
    console.log(`✓ Retrieved: user-pii = ${JSON.stringify(pii)}`);

    // List vault contents
    const allKeys = vault.listKeys();
    console.log(`\n✓ Vault contains ${allKeys.length} entries: ${allKeys.join(', ')}`);

    console.log('\n⚠️  Remember: Use strong passwords in production!');
}


/**
 * Interactive menu
 */
async function main() {
    console.log('\nActiveMirrorOS JavaScript Starter');
    console.log('Choose an example to run:');
    console.log('  1. Hello, ActiveMirrorOS (basic)');
    console.log('  2. Reflective Patterns');
    console.log('  3. Encrypted Vault');
    console.log('  4. Run all examples');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('\nEnter choice (1-4): ', (choice) => {
        rl.close();

        choice = choice.trim();

        if (choice === '1') {
            helloActiveMirror();
        } else if (choice === '2') {
            exampleWithReflectivePatterns();
        } else if (choice === '3') {
            exampleWithVault();
        } else if (choice === '4') {
            helloActiveMirror();
            exampleWithReflectivePatterns();
            exampleWithVault();
        } else {
            console.log('Invalid choice. Running basic example...');
            helloActiveMirror();
        }

        console.log('\n' + '='.repeat(60));
        console.log('Next Steps:');
        console.log('  • Read the docs: ../docs/quickstart.md');
        console.log('  • Explore examples: javascript/examples/');
        console.log('  • Try the demo: ../demo/demo_app.py');
        console.log('  • Check API reference: ../docs/api-reference.md');
        console.log('='.repeat(60));
    });
}


// Run if called directly
if (require.main === module) {
    main().catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
}


module.exports = {
    helloActiveMirror,
    exampleWithReflectivePatterns,
    exampleWithVault
};
