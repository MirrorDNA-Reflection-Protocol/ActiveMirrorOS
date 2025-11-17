/**
 * ActiveMirrorOS Continuity Loader
 * Loads boot configuration, snapshot, and graph for perfect state reconstruction
 *
 * @module boot/loader
 * @version v1.0.0
 * @license MIT
 */

import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Get the repository root directory
 * @returns {string} Absolute path to repository root
 */
function getRepoRoot() {
  // Assuming loader.js is in src/boot/, repo root is two levels up
  return join(__dirname, '../..');
}

/**
 * Load and parse a JSON file
 * @param {string} filePath - Absolute or relative path to JSON file
 * @returns {Promise<Object>} Parsed JSON object
 * @throws {Error} If file cannot be read or parsed
 */
async function loadJSON(filePath) {
  try {
    const content = await readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`File not found: ${filePath}`);
    }
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in ${filePath}: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Load a text file
 * @param {string} filePath - Absolute or relative path to text file
 * @returns {Promise<string>} File contents as string
 * @throws {Error} If file cannot be read
 */
async function loadText(filePath) {
  try {
    return await readFile(filePath, 'utf-8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`File not found: ${filePath}`);
    }
    throw error;
  }
}

/**
 * Verify required fields in BOOT.json
 * @param {Object} boot - Parsed BOOT.json object
 * @throws {Error} If required fields are missing
 */
function verifyBootStructure(boot) {
  const requiredFields = [
    'version',
    'vault_path',
    'identity_lock',
    'tone_mode',
    'protocols',
    'twins'
  ];

  const missing = requiredFields.filter(field => !(field in boot));

  if (missing.length > 0) {
    throw new Error(`BOOT.json missing required fields: ${missing.join(', ')}`);
  }

  // Verify protocols object has required protocol flags
  const requiredProtocols = ['TruthStateLaw', 'ZeroDriftLayer', 'TrustByDesign'];
  const missingProtocols = requiredProtocols.filter(
    protocol => !(protocol in boot.protocols)
  );

  if (missingProtocols.length > 0) {
    throw new Error(`BOOT.json missing required protocols: ${missingProtocols.join(', ')}`);
  }
}

/**
 * Get complete continuity state by loading all continuity files
 *
 * This function performs the core boot sequence:
 * 1. Load BOOT.json (boot configuration)
 * 2. Load Snapshot_Latest.md (current state snapshot)
 * 3. Load Graph_v1.json (knowledge graph)
 * 4. Verify BOOT.json structure
 * 5. Return combined state object
 *
 * @returns {Promise<Object>} Continuity state object with boot, snapshot, graph
 * @throws {Error} If any continuity file cannot be loaded or is invalid
 *
 * @example
 * import { getContinuityState } from './src/boot/loader.js';
 *
 * const state = await getContinuityState();
 * console.log('Version:', state.boot.version);
 * console.log('Identity Lock:', state.boot.identity_lock);
 * console.log('Protocols:', state.boot.protocols);
 */
export async function getContinuityState() {
  const repoRoot = getRepoRoot();

  // Define paths to continuity files
  const paths = {
    boot: join(repoRoot, 'continuity/BOOT.json'),
    snapshot: join(repoRoot, 'continuity/Snapshot_Latest.md'),
    graph: join(repoRoot, 'continuity/Graph_v1.json'),
    config: join(repoRoot, 'config/amos.boot.json')
  };

  try {
    // Load all continuity files in parallel for performance
    const [boot, snapshot, graph, config] = await Promise.all([
      loadJSON(paths.boot),
      loadText(paths.snapshot),
      loadJSON(paths.graph),
      loadJSON(paths.config)
    ]);

    // Verify BOOT.json has required structure
    verifyBootStructure(boot);

    // Return complete continuity state
    return {
      boot,
      snapshot,
      graph,
      config,
      paths,
      metadata: {
        loaded_at: new Date().toISOString(),
        repo_root: repoRoot,
        loader_version: 'v1.0.0'
      }
    };
  } catch (error) {
    // Re-throw with more context
    throw new Error(`Failed to load continuity state: ${error.message}`);
  }
}

/**
 * Verify continuity integrity (placeholder for full checksum verification)
 *
 * FEU: Full checksum verification requires LingOS-Coder tool
 * This is a placeholder that performs basic structure validation
 *
 * @returns {Promise<Object>} Verification result with status and details
 *
 * @example
 * import { verifyContinuity } from './src/boot/loader.js';
 *
 * const result = await verifyContinuity();
 * if (result.status === 'ok') {
 *   console.log('✅ Continuity OK');
 * } else {
 *   console.error('❌ Continuity drift detected:', result.errors);
 * }
 */
export async function verifyContinuity() {
  try {
    const state = await getContinuityState();

    // Basic validation checks
    const checks = {
      boot_loaded: !!state.boot,
      snapshot_loaded: !!state.snapshot,
      graph_loaded: !!state.graph,
      config_loaded: !!state.config,
      required_protocols_active: (
        state.boot.protocols.TruthStateLaw &&
        state.boot.protocols.ZeroDriftLayer &&
        state.boot.protocols.TrustByDesign
      ),
      identity_lock_present: !!state.boot.identity_lock,
      version_matches: state.boot.version === 'v15.3'
    };

    const failedChecks = Object.entries(checks)
      .filter(([_, passed]) => !passed)
      .map(([check, _]) => check);

    if (failedChecks.length > 0) {
      return {
        status: 'error',
        message: 'Continuity verification failed',
        failed_checks: failedChecks,
        state
      };
    }

    return {
      status: 'ok',
      message: 'Continuity OK (basic validation passed)',
      note: 'FEU: Full checksum verification requires LingOS-Coder tool',
      checks,
      state
    };
  } catch (error) {
    return {
      status: 'error',
      message: 'Continuity verification failed',
      error: error.message
    };
  }
}

/**
 * Get a specific continuity file
 * @param {string} fileType - One of: 'boot', 'snapshot', 'graph', 'config'
 * @returns {Promise<Object|string>} Parsed file content
 *
 * @example
 * import { getContinuityFile } from './src/boot/loader.js';
 *
 * const boot = await getContinuityFile('boot');
 * console.log('Tone mode:', boot.tone_mode);
 */
export async function getContinuityFile(fileType) {
  const repoRoot = getRepoRoot();

  const fileMap = {
    boot: { path: 'continuity/BOOT.json', loader: loadJSON },
    snapshot: { path: 'continuity/Snapshot_Latest.md', loader: loadText },
    graph: { path: 'continuity/Graph_v1.json', loader: loadJSON },
    config: { path: 'config/amos.boot.json', loader: loadJSON }
  };

  if (!(fileType in fileMap)) {
    throw new Error(`Invalid file type: ${fileType}. Must be one of: ${Object.keys(fileMap).join(', ')}`);
  }

  const { path, loader } = fileMap[fileType];
  const fullPath = join(repoRoot, path);

  return await loader(fullPath);
}

// Export utility functions for testing
export {
  getRepoRoot,
  loadJSON,
  loadText,
  verifyBootStructure
};
