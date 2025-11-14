#!/usr/bin/env node

/**
 * ActiveMirrorOS CLI Demo
 *
 * Simplified CLI tool demonstrating reflective journaling patterns.
 * This is a lightweight demo - for full features, see ../../apps/example-cli/
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = './.amos_data';
const ENTRIES_FILE = path.join(DATA_DIR, 'entries.json');
const VAULT_DIR = path.join(DATA_DIR, 'vault');
const VAULT_FILE = path.join(VAULT_DIR, 'vault.json');

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(VAULT_DIR)) {
    fs.mkdirSync(VAULT_DIR, { recursive: true });
  }
}

// Generate entry ID
function generateEntryId() {
  const timestamp = Date.now();
  const random = crypto.randomBytes(3).toString('hex');
  return `entry_${timestamp}_${random}`;
}

// Load entries
function loadEntries() {
  if (!fs.existsSync(ENTRIES_FILE)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(ENTRIES_FILE, 'utf8'));
}

// Save entries
function saveEntries(entries) {
  fs.writeFileSync(ENTRIES_FILE, JSON.stringify(entries, null, 2));
}

// Write journal entry
function writeEntry(content) {
  ensureDataDir();
  const entries = loadEntries();

  const entry = {
    id: generateEntryId(),
    content,
    timestamp: new Date().toISOString(),
    type: 'journal',
  };

  entries.push(entry);
  saveEntries(entries);

  console.log(`✓ Entry saved: ${entry.id}`);
}

// Generate reflection
function generateReflection(topic) {
  const reflections = [
    `⟨medium⟩ You're exploring "${topic}" — what specific aspect draws your attention most?`,
    `I notice curiosity in your question. ⟨low⟩ What would clarity look like here?`,
    `⟨medium⟩ This opens interesting territory. What happens if you sit with uncertainty here?`,
    `You're asking about patterns. ⟨high⟩ I'm uncertain what the core tension is — could you say more?`,
    `⟨low⟩ I'm reflecting on "${topic.substring(0, 40)}..." What emerges when you pause with this?`,
  ];

  const reflection = reflections[Math.floor(Math.random() * reflections.length)];

  ensureDataDir();
  const entries = loadEntries();

  const entry = {
    id: generateEntryId(),
    content: topic,
    reflection,
    timestamp: new Date().toISOString(),
    type: 'reflection',
  };

  entries.push(entry);
  saveEntries(entries);

  console.log(`\n◈ Reflection:\n\n${reflection}\n`);
}

// List entries
function listEntries(limit = 10) {
  const entries = loadEntries();

  if (entries.length === 0) {
    console.log('No entries yet. Try: ./amos-demo.js write "Your first thought"');
    return;
  }

  console.log(`\nRecent entries (showing ${Math.min(limit, entries.length)} of ${entries.length}):\n`);

  entries
    .slice(-limit)
    .reverse()
    .forEach((entry) => {
      const date = new Date(entry.timestamp).toLocaleString();
      const preview = entry.content.substring(0, 60) + (entry.content.length > 60 ? '...' : '');
      const type = entry.type === 'reflection' ? '◈' : '•';

      console.log(`  ${type} ${entry.id}`);
      console.log(`    ${date}`);
      console.log(`    "${preview}"`);
      if (entry.reflection) {
        const reflPreview = entry.reflection.substring(0, 60) + '...';
        console.log(`    → ${reflPreview}`);
      }
      console.log();
    });
}

// Show entry
function showEntry(id) {
  const entries = loadEntries();
  const entry = entries.find((e) => e.id === id);

  if (!entry) {
    console.log(`Entry not found: ${id}`);
    return;
  }

  console.log(`\n◈ Entry: ${entry.id}`);
  console.log(`  Type: ${entry.type}`);
  console.log(`  Date: ${new Date(entry.timestamp).toLocaleString()}`);
  console.log(`\nContent:\n${entry.content}`);

  if (entry.reflection) {
    console.log(`\nReflection:\n${entry.reflection}`);
  }

  console.log();
}

// Vault operations
function loadVault() {
  if (!fs.existsSync(VAULT_FILE)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(VAULT_FILE, 'utf8'));
}

function saveVault(vault) {
  ensureDataDir();
  fs.writeFileSync(VAULT_FILE, JSON.stringify(vault, null, 2));
}

function vaultStore(key, value) {
  const vault = loadVault();
  vault[key] = {
    value,
    timestamp: new Date().toISOString(),
  };
  saveVault(vault);
  console.log(`✓ Stored in vault: ${key}`);
}

function vaultGet(key) {
  const vault = loadVault();
  if (!vault[key]) {
    console.log(`Key not found: ${key}`);
    return;
  }
  console.log(`\n${key}: ${vault[key].value}`);
  console.log(`Stored: ${new Date(vault[key].timestamp).toLocaleString()}\n`);
}

function vaultList() {
  const vault = loadVault();
  const keys = Object.keys(vault);

  if (keys.length === 0) {
    console.log('Vault is empty.');
    return;
  }

  console.log(`\nVault contains ${keys.length} items:\n`);
  keys.forEach((key) => {
    console.log(`  • ${key} (${new Date(vault[key].timestamp).toLocaleString()})`);
  });
  console.log();
}

// Main CLI handler
function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === 'help') {
    console.log(`
ActiveMirrorOS CLI Demo — Reflection over Prediction

Usage:
  ./amos-demo.js write <content>       Write a journal entry
  ./amos-demo.js reflect <topic>       Generate a reflection
  ./amos-demo.js list [limit]          List recent entries
  ./amos-demo.js show <entry-id>       Show specific entry
  ./amos-demo.js vault store <k> <v>   Store in vault
  ./amos-demo.js vault get <key>       Get from vault
  ./amos-demo.js vault list            List vault keys

Examples:
  ./amos-demo.js write "Today I learned about reflective AI"
  ./amos-demo.js reflect "What is meaningful work?"
  ./amos-demo.js list 20
  ./amos-demo.js vault store "goal" "Build something meaningful"

For full features, see: ../../apps/example-cli/
`);
    return;
  }

  switch (command) {
    case 'write':
      const content = args.slice(1).join(' ');
      if (!content) {
        console.log('Usage: ./amos-demo.js write <content>');
        return;
      }
      writeEntry(content);
      break;

    case 'reflect':
      const topic = args.slice(1).join(' ');
      if (!topic) {
        console.log('Usage: ./amos-demo.js reflect <topic>');
        return;
      }
      generateReflection(topic);
      break;

    case 'list':
      const limit = parseInt(args[1]) || 10;
      listEntries(limit);
      break;

    case 'show':
      const id = args[1];
      if (!id) {
        console.log('Usage: ./amos-demo.js show <entry-id>');
        return;
      }
      showEntry(id);
      break;

    case 'vault':
      const vaultCmd = args[1];
      if (vaultCmd === 'store') {
        const key = args[2];
        const value = args.slice(3).join(' ');
        if (!key || !value) {
          console.log('Usage: ./amos-demo.js vault store <key> <value>');
          return;
        }
        vaultStore(key, value);
      } else if (vaultCmd === 'get') {
        const key = args[2];
        if (!key) {
          console.log('Usage: ./amos-demo.js vault get <key>');
          return;
        }
        vaultGet(key);
      } else if (vaultCmd === 'list') {
        vaultList();
      } else {
        console.log('Vault commands: store, get, list');
      }
      break;

    default:
      console.log(`Unknown command: ${command}`);
      console.log('Run ./amos-demo.js help for usage');
  }
}

main();
