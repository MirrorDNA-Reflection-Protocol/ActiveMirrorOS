#!/usr/bin/env node
/**
 * ActiveMirrorOS JavaScript Starter
 *
 * A complete, copy-paste ready example demonstrating all core features:
 * - Creating mirrors with persistent storage
 * - Managing sessions
 * - Adding messages
 * - Reflective dialogue with LingOS Lite
 * - Exporting sessions
 * - Encrypted vault storage
 *
 * Usage:
 *     node javascript_starter.js
 *
 * Requirements:
 *     npm install MirrorDNA-Reflection-Protocol/ActiveMirrorOS#sdk/javascript
 */

const { ActiveMirror, ReflectiveClient, VaultMemory } = require('activemirror');
const fs = require('fs');
const path = require('path');


function example1BasicSession() {
    console.log('\n' + '='.repeat(60));
    console.log('Example 1: Basic Session with Persistent Memory');
    console.log('='.repeat(60));

    // Create mirror with JSON storage (persists across restarts)
    const mirror = new ActiveMirror('./quickstart-data');

    // Create a session
    const session = mirror.createSession('getting-started');

    // Add messages (automatically persisted to disk)
    session.addMessage('user', 'I am learning ActiveMirrorOS!');
    session.addMessage('assistant', 'Great! I will remember our learning journey.');
    session.addMessage('user', 'What makes this different from regular AI?');
    session.addMessage('assistant', 'I have persistent memory. Close this app, restart it days later - I will remember everything.');

    // View the conversation
    console.log('\n📝 Session Content:');
    session.messages.forEach(msg => {
        const role = msg.role.toUpperCase();
        console.log(`${role}: ${msg.content}`);
    });

    console.log(`\n✅ Session '${session.sessionId}' created and persisted to disk`);
    console.log(`   Storage: ${path.resolve('./quickstart-data')}`);

    return mirror;
}


function example2LoadingSessions() {
    console.log('\n' + '='.repeat(60));
    console.log('Example 2: Loading Existing Sessions');
    console.log('='.repeat(60));

    // Create new mirror instance (simulating app restart)
    const mirror = new ActiveMirror('./quickstart-data');

    // List all sessions
    const sessions = mirror.listSessions();
    console.log(`\n📋 Found ${sessions.length} session(s):`);
    sessions.forEach(sid => {
        console.log(`   - ${sid}`);
    });

    // Load the session we created earlier
    if (sessions.includes('getting-started')) {
        const loaded = mirror.loadSession('getting-started');
        console.log(`\n🔄 Loaded session: ${loaded.sessionId}`);
        console.log(`   Messages: ${loaded.messages.length}`);
        console.log('\n✅ Memory persisted across reload!');
    }

    return mirror;
}


function example3ReflectiveDialogue() {
    console.log('\n' + '='.repeat(60));
    console.log('Example 3: Reflective Dialogue with LingOS Lite');
    console.log('='.repeat(60));

    // Create reflective client with analytical mode
    const reflective = new ReflectiveClient({
        mode: 'analytical',
        uncertaintyThreshold: 0.7
    });

    // Example prompts with different modes
    const examples = [
        { mode: 'analytical', prompt: 'API latency increased from 200ms to 2 seconds' },
        { mode: 'exploratory', prompt: 'Should I change my career to AI engineering?' },
        { mode: 'creative', prompt: 'Need a name for a productivity app' },
        { mode: 'strategic', prompt: 'Should we raise funding or bootstrap?' }
    ];

    examples.forEach(({ mode, prompt }) => {
        reflective.mode = mode;
        console.log(`\n📌 Mode: ${mode.toUpperCase()}`);
        console.log(`Prompt: ${prompt}`);
        console.log('Response:');
        // Note: In real usage, you'd connect this to an LLM
        // For now, we demonstrate the API
        console.log(`   [Would call LLM with ${mode} mode guidance]`);
        console.log('   [Uncertainty markers and mode instructions included]');
    });

    console.log('\n✅ LingOS Lite provides mode-specific dialogue patterns');
}


function example4SessionExport() {
    console.log('\n' + '='.repeat(60));
    console.log('Example 4: Exporting Sessions');
    console.log('='.repeat(60));

    const mirror = new ActiveMirror('./quickstart-data');

    // Create a sample session for export
    const exportSession = mirror.createSession('export-demo');
    exportSession.addMessage('user', 'What is ActiveMirrorOS?');
    exportSession.addMessage('assistant', 'It is a memory layer for AI applications.');
    exportSession.addMessage('user', 'How does it work?');
    exportSession.addMessage('assistant', 'Sessions persist to JSON files, maintaining full context.');

    // Export to markdown
    const exportPath = 'export-demo.md';
    mirror.exportSession('export-demo', 'markdown');

    console.log(`\n📤 Exported session to: ${path.resolve(exportPath)}`);

    // Show exported content
    if (fs.existsSync(exportPath)) {
        const content = fs.readFileSync(exportPath, 'utf8');
        console.log('\n📄 Exported Content Preview:');
        console.log(content.length > 300 ? content.substring(0, 300) + '...' : content);
    }

    console.log('\n✅ Sessions can be exported to markdown, JSON, or plain text');
}


function example5VaultStorage() {
    console.log('\n' + '='.repeat(60));
    console.log('Example 5: Encrypted Vault Storage');
    console.log('='.repeat(60));

    // Create encrypted vault with password
    const vault = new VaultMemory('your-secure-password-here');

    // Store sensitive data (encrypted with AES-256-GCM)
    vault.store('api_key', 'sk-1234567890abcdef');
    vault.store('database_password', 'super-secret-password');
    vault.store('user_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');

    console.log('\n🔒 Stored 3 encrypted items in vault');

    // Retrieve decrypted data
    const apiKey = vault.retrieve('api_key');
    console.log(`\n🔓 Retrieved API key: ${apiKey.substring(0, 10)}... (truncated)`);

    // List all keys (without revealing values)
    const keys = vault.listKeys();
    console.log(`\n📋 Vault contains ${keys.length} keys:`);
    keys.forEach(key => {
        console.log(`   - ${key}`);
    });

    console.log('\n✅ Sensitive data encrypted at rest with AES-256-GCM');
}


function example6MultipleSessions() {
    console.log('\n' + '='.repeat(60));
    console.log('Example 6: Multiple Concurrent Sessions');
    console.log('='.repeat(60));

    const mirror = new ActiveMirror('./quickstart-data');

    // Create multiple sessions for different topics
    const projects = {
        'work-project': ['Planning Q2 roadmap', 'Reviewing sprint goals'],
        'personal-journal': ['Grateful for good coffee today', 'Read 30 pages'],
        'learning-javascript': ['Completed async/await tutorial', 'Built a CLI tool']
    };

    Object.entries(projects).forEach(([sessionId, messages]) => {
        const session = mirror.createSession(sessionId);
        messages.forEach(msg => {
            session.addMessage('user', msg);
            session.addMessage('assistant', `Noted: ${msg}`);
        });
    });

    // List all sessions
    const allSessions = mirror.listSessions();
    console.log(`\n📚 Created ${Object.keys(projects).length} sessions:`);
    allSessions.forEach(sid => {
        const session = mirror.loadSession(sid);
        const msgCount = session.messages.length;
        console.log(`   - ${sid}: ${msgCount} messages`);
    });

    console.log('\n✅ Multiple sessions can coexist, each with separate context');
}


function example7SessionMetadata() {
    console.log('\n' + '='.repeat(60));
    console.log('Example 7: Custom Session Metadata');
    console.log('='.repeat(60));

    const mirror = new ActiveMirror('./quickstart-data');

    // Create session with metadata
    const session = mirror.createSession('project-beta', {
        project: 'Web App',
        status: 'active',
        priority: 'high',
        tags: ['react', 'mvp', 'startup']
    });

    session.addMessage('user', 'Starting project Beta development');

    console.log('\n🏷️  Session created with metadata:');
    console.log(`   Project: ${session.metadata.project}`);
    console.log(`   Status: ${session.metadata.status}`);
    console.log(`   Priority: ${session.metadata.priority}`);
    console.log(`   Tags: ${session.metadata.tags.join(', ')}`);

    console.log('\n✅ Metadata helps organize and filter sessions');
}


function example8AsyncOperations() {
    console.log('\n' + '='.repeat(60));
    console.log('Example 8: Async Operations (Real-World Pattern)');
    console.log('='.repeat(60));

    const mirror = new ActiveMirror('./quickstart-data');

    // Simulate async operations (common in Node.js)
    const processConversation = async () => {
        const session = mirror.createSession('async-demo');

        // Simulate async message processing
        const messages = [
            { role: 'user', content: 'What is async/await?' },
            { role: 'assistant', content: 'It is modern JavaScript syntax for handling promises.' },
            { role: 'user', content: 'Show me an example' },
            { role: 'assistant', content: 'async function example() { const data = await fetch(); }' }
        ];

        for (const msg of messages) {
            await new Promise(resolve => setTimeout(resolve, 100)); // Simulate processing
            session.addMessage(msg.role, msg.content);
            console.log(`   Added: ${msg.role} message`);
        }

        console.log(`\n✅ Processed ${messages.length} messages asynchronously`);
    };

    return processConversation();
}


async function main() {
    console.log('\n' + '='.repeat(60));
    console.log('ActiveMirrorOS JavaScript Starter Examples');
    console.log('='.repeat(60));
    console.log('\nThis script demonstrates all core features.');
    console.log('Each example is independent - explore the source code!');

    try {
        // Run all examples
        example1BasicSession();
        example2LoadingSessions();
        example3ReflectiveDialogue();
        example4SessionExport();
        example5VaultStorage();
        example6MultipleSessions();
        example7SessionMetadata();
        await example8AsyncOperations();

        console.log('\n' + '='.repeat(60));
        console.log('✅ All Examples Completed Successfully!');
        console.log('='.repeat(60));
        console.log('\nNext Steps:');
        console.log('1. Explore the source code of this file');
        console.log('2. Modify examples to fit your use case');
        console.log('3. Read the docs: https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS');
        console.log('4. Build something amazing!');

    } catch (error) {
        console.error(`\n❌ Error: ${error.message}`);
        console.log('\nTroubleshooting:');
        console.log('1. Install: npm install MirrorDNA-Reflection-Protocol/ActiveMirrorOS#sdk/javascript');
        console.log('2. Check: node --version (requires 14+)');
        console.log('3. Docs: https://github.com/MirrorDNA-Reflection-Protocol/ActiveMirrorOS/blob/main/onboarding/troubleshooting.md');
    }
}


// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}


// Export for use as a module
module.exports = {
    example1BasicSession,
    example2LoadingSessions,
    example3ReflectiveDialogue,
    example4SessionExport,
    example5VaultStorage,
    example6MultipleSessions,
    example7SessionMetadata,
    example8AsyncOperations
};
