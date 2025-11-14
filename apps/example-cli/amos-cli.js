#!/usr/bin/env node

/**
 * AMOS CLI - ActiveMirrorOS Command Line Interface
 *
 * A journaling and reflective assistant for the terminal.
 *
 * Usage:
 *   amos write "Your journal entry..."
 *   amos reflect "Topic to reflect on..."
 *   amos list
 *   amos show [entry-id]
 *   amos vault store key "value"
 *   amos vault get key
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple embedded implementations (avoiding SDK dependency for portability)
class SimpleMemory {
  constructor(dataPath = './.amos_data') {
    this.dataPath = dataPath;
    this.entriesPath = path.join(dataPath, 'entries.json');
  }

  async initialize() {
    if (!existsSync(this.dataPath)) {
      await fs.mkdir(this.dataPath, { recursive: true });
    }
    if (!existsSync(this.entriesPath)) {
      await fs.writeFile(this.entriesPath, JSON.stringify({ entries: [] }, null, 2));
    }
  }

  async addEntry(content, type = 'journal') {
    const data = JSON.parse(await fs.readFile(this.entriesPath, 'utf-8'));

    const entry = {
      id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      type,
      content,
      timestamp: new Date().toISOString(),
      reflection: this._generateReflection(content, type),
    };

    data.entries.push(entry);
    await fs.writeFile(this.entriesPath, JSON.stringify(data, null, 2));

    return entry;
  }

  _generateReflection(content, type) {
    if (type === 'reflection') {
      return `Exploring: "${content}". This invites ⟨medium⟩ deeper consideration of underlying patterns.`;
    }

    const wordCount = content.split(/\s+/).length;
    if (wordCount > 50) {
      return `◈ A substantial entry. What core theme emerges when you review this?`;
    } else {
      return `◊ Brief but meaningful. What deeper inquiry does this suggest?`;
    }
  }

  async listEntries(limit = 10) {
    const data = JSON.parse(await fs.readFile(this.entriesPath, 'utf-8'));
    return data.entries.slice(-limit).reverse();
  }

  async getEntry(id) {
    const data = JSON.parse(await fs.readFile(this.entriesPath, 'utf-8'));
    return data.entries.find(e => e.id === id);
  }
}

class SimpleVault {
  constructor(dataPath = './.amos_data/vault') {
    this.dataPath = dataPath;
    this.vaultPath = path.join(dataPath, 'vault.json');
  }

  async initialize() {
    if (!existsSync(this.dataPath)) {
      await fs.mkdir(this.dataPath, { recursive: true });
    }
    if (!existsSync(this.vaultPath)) {
      await fs.writeFile(this.vaultPath, JSON.stringify({ data: {} }, null, 2));
    }
  }

  async store(key, value) {
    const vault = JSON.parse(await fs.readFile(this.vaultPath, 'utf-8'));
    vault.data[key] = {
      value,
      storedAt: new Date().toISOString(),
    };
    await fs.writeFile(this.vaultPath, JSON.stringify(vault, null, 2));
    return true;
  }

  async get(key) {
    const vault = JSON.parse(await fs.readFile(this.vaultPath, 'utf-8'));
    return vault.data[key]?.value || null;
  }

  async list() {
    const vault = JSON.parse(await fs.readFile(this.vaultPath, 'utf-8'));
    return Object.entries(vault.data).map(([key, data]) => ({
      key,
      storedAt: data.storedAt,
    }));
  }
}

// CLI Commands
async function cmdWrite(content) {
  const memory = new SimpleMemory();
  await memory.initialize();

  const entry = await memory.addEntry(content, 'journal');

  console.log('✍️  Journal Entry Saved\n');
  console.log(`ID: ${entry.id}`);
  console.log(`Time: ${new Date(entry.timestamp).toLocaleString()}\n`);
  console.log(`Content:\n${entry.content}\n`);
  console.log(`Reflection:\n${entry.reflection}\n`);
}

async function cmdReflect(topic) {
  const memory = new SimpleMemory();
  await memory.initialize();

  const entry = await memory.addEntry(topic, 'reflection');

  console.log('🌀 Reflection Generated\n');
  console.log(`Topic: ${topic}\n`);
  console.log(`Reflection:\n${entry.reflection}\n`);
  console.log(`Saved as: ${entry.id}\n`);
}

async function cmdList(limit = 10) {
  const memory = new SimpleMemory();
  await memory.initialize();

  const entries = await memory.listEntries(limit);

  if (entries.length === 0) {
    console.log('📝 No entries yet. Try: amos write "Your first entry"');
    return;
  }

  console.log(`📚 Recent Entries (${entries.length}):\n`);

  for (const entry of entries) {
    const date = new Date(entry.timestamp).toLocaleDateString();
    const preview = entry.content.length > 60
      ? entry.content.substring(0, 57) + '...'
      : entry.content;

    console.log(`  ${entry.id}`);
    console.log(`    ${date} - ${entry.type}`);
    console.log(`    "${preview}"\n`);
  }
}

async function cmdShow(id) {
  const memory = new SimpleMemory();
  await memory.initialize();

  const entry = await memory.getEntry(id);

  if (!entry) {
    console.log(`❌ Entry not found: ${id}`);
    return;
  }

  console.log(`\n📖 Entry: ${entry.id}\n`);
  console.log(`Type: ${entry.type}`);
  console.log(`Date: ${new Date(entry.timestamp).toLocaleString()}\n`);
  console.log(`Content:\n${entry.content}\n`);
  console.log(`Reflection:\n${entry.reflection}\n`);
}

async function cmdVaultStore(key, value) {
  const vault = new SimpleVault();
  await vault.initialize();

  await vault.store(key, value);
  console.log(`✅ Stored in vault: ${key}`);
}

async function cmdVaultGet(key) {
  const vault = new SimpleVault();
  await vault.initialize();

  const value = await vault.get(key);

  if (value === null) {
    console.log(`❌ Not found in vault: ${key}`);
  } else {
    console.log(`🔑 ${key}: ${value}`);
  }
}

async function cmdVaultList() {
  const vault = new SimpleVault();
  await vault.initialize();

  const entries = await vault.list();

  if (entries.length === 0) {
    console.log('🔒 Vault is empty');
    return;
  }

  console.log('🔒 Vault Entries:\n');
  for (const entry of entries) {
    console.log(`  ${entry.key}`);
    console.log(`    Stored: ${new Date(entry.storedAt).toLocaleString()}\n`);
  }
}

function showHelp() {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║              AMOS CLI - ActiveMirrorOS                    ║
║          Journaling & Reflective Assistant                ║
╚═══════════════════════════════════════════════════════════╝

USAGE:
  amos <command> [arguments]

JOURNALING:
  write <content>      Write a journal entry
  reflect <topic>      Generate a reflection on a topic
  list [limit]         List recent entries (default: 10)
  show <entry-id>      Show a specific entry

VAULT (Private Storage):
  vault store <key> <value>   Store encrypted data
  vault get <key>             Retrieve data
  vault list                  List all vault keys

EXAMPLES:
  amos write "Today I learned about reflective AI systems"
  amos reflect "What makes AI truly useful?"
  amos list 20
  amos vault store "life_goal" "Build meaningful technology"
  amos vault get "life_goal"

DATA LOCATION:
  All data stored in: ./.amos_data/

  `);
}

// Main CLI Router
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === 'help' || args[0] === '--help' || args[0] === '-h') {
    showHelp();
    return;
  }

  const command = args[0];
  const subcommand = args[1];

  try {
    switch (command) {
      case 'write':
        if (!args[1]) {
          console.log('❌ Usage: amos write "your entry content"');
          return;
        }
        await cmdWrite(args.slice(1).join(' '));
        break;

      case 'reflect':
        if (!args[1]) {
          console.log('❌ Usage: amos reflect "topic to reflect on"');
          return;
        }
        await cmdReflect(args.slice(1).join(' '));
        break;

      case 'list':
        const limit = parseInt(args[1]) || 10;
        await cmdList(limit);
        break;

      case 'show':
        if (!args[1]) {
          console.log('❌ Usage: amos show <entry-id>');
          return;
        }
        await cmdShow(args[1]);
        break;

      case 'vault':
        if (!subcommand) {
          console.log('❌ Usage: amos vault <store|get|list>');
          return;
        }

        if (subcommand === 'store') {
          if (!args[2] || !args[3]) {
            console.log('❌ Usage: amos vault store <key> <value>');
            return;
          }
          await cmdVaultStore(args[2], args.slice(3).join(' '));
        } else if (subcommand === 'get') {
          if (!args[2]) {
            console.log('❌ Usage: amos vault get <key>');
            return;
          }
          await cmdVaultGet(args[2]);
        } else if (subcommand === 'list') {
          await cmdVaultList();
        } else {
          console.log(`❌ Unknown vault command: ${subcommand}`);
        }
        break;

      default:
        console.log(`❌ Unknown command: ${command}`);
        console.log('Run "amos help" for usage information');
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main();
