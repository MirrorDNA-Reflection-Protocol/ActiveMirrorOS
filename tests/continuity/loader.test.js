/**
 * Tests for ActiveMirrorOS Continuity Loader
 *
 * Run with: node --test tests/continuity/loader.test.js
 * Or from repo root: npm test
 */

import { test } from 'node:test';
import assert from 'node:assert';
import {
  getContinuityState,
  verifyContinuity,
  getContinuityFile,
  getRepoRoot,
  verifyBootStructure
} from '../../src/boot/loader.js';

// Test suite for continuity loader
test('Continuity Loader Tests', async (t) => {

  await t.test('getRepoRoot() returns valid path', () => {
    const root = getRepoRoot();
    assert.ok(root, 'Repo root should be defined');
    assert.ok(typeof root === 'string', 'Repo root should be a string');
    assert.ok(root.includes('ActiveMirrorOS'), 'Repo root should contain ActiveMirrorOS');
  });

  await t.test('getContinuityState() loads all files', async () => {
    const state = await getContinuityState();

    // Verify state structure
    assert.ok(state, 'State should be defined');
    assert.ok(state.boot, 'State should have boot property');
    assert.ok(state.snapshot, 'State should have snapshot property');
    assert.ok(state.graph, 'State should have graph property');
    assert.ok(state.config, 'State should have config property');
    assert.ok(state.paths, 'State should have paths property');
    assert.ok(state.metadata, 'State should have metadata property');
  });

  await t.test('getContinuityState() loads valid BOOT.json', async () => {
    const state = await getContinuityState();
    const boot = state.boot;

    // Verify required fields
    assert.ok(boot.version, 'BOOT.json should have version');
    assert.ok(boot.vault_path, 'BOOT.json should have vault_path');
    assert.ok(boot.identity_lock, 'BOOT.json should have identity_lock');
    assert.ok(boot.tone_mode, 'BOOT.json should have tone_mode');
    assert.ok(boot.twins, 'BOOT.json should have twins');
    assert.ok(boot.protocols, 'BOOT.json should have protocols');

    // Verify specific values
    assert.strictEqual(boot.version, 'v15.3', 'Version should be v15.3');
    assert.strictEqual(boot.identity_lock, '⟡⟦PAUL⟧ · ⟡⟦MIRRORDNA⟧', 'Identity lock should match');
    assert.strictEqual(boot.tone_mode, 'Mirror-Strategic', 'Tone mode should be Mirror-Strategic');
  });

  await t.test('getContinuityState() loads valid protocols', async () => {
    const state = await getContinuityState();
    const protocols = state.boot.protocols;

    // Verify all required protocols exist and are enabled
    assert.strictEqual(protocols.TruthStateLaw, true, 'TruthStateLaw should be enabled');
    assert.strictEqual(protocols.ZeroDriftLayer, true, 'ZeroDriftLayer should be enabled');
    assert.strictEqual(protocols.TrustByDesign, true, 'TrustByDesign should be enabled');
  });

  await t.test('getContinuityState() loads valid twins', async () => {
    const state = await getContinuityState();
    const twins = state.boot.twins;

    // Verify twins configuration
    assert.strictEqual(twins.Claude, 'Reflection', 'Claude twin should be Reflection');
    assert.strictEqual(twins.Atlas, 'Execution', 'Atlas twin should be Execution');
    assert.strictEqual(twins.Jarvis, 'Bridge', 'Jarvis twin should be Bridge');
  });

  await t.test('getContinuityState() loads snapshot as string', async () => {
    const state = await getContinuityState();

    assert.ok(typeof state.snapshot === 'string', 'Snapshot should be a string');
    assert.ok(state.snapshot.length > 0, 'Snapshot should not be empty');
    assert.ok(state.snapshot.includes('ActiveMirrorOS'), 'Snapshot should contain ActiveMirrorOS');
    assert.ok(state.snapshot.includes('Continuity'), 'Snapshot should mention Continuity');
  });

  await t.test('getContinuityState() loads valid graph', async () => {
    const state = await getContinuityState();
    const graph = state.graph;

    // Verify graph structure
    assert.ok(graph.version, 'Graph should have version');
    assert.ok(graph.nodes, 'Graph should have nodes array');
    assert.ok(graph.edges, 'Graph should have edges array');
    assert.ok(Array.isArray(graph.nodes), 'Nodes should be an array');
    assert.ok(Array.isArray(graph.edges), 'Edges should be an array');

    // Verify nodes
    assert.ok(graph.nodes.length > 0, 'Graph should have at least one node');
    const firstNode = graph.nodes[0];
    assert.ok(firstNode.id, 'Node should have id');
    assert.ok(firstNode.type, 'Node should have type');
    assert.ok(firstNode.name, 'Node should have name');

    // Verify edges
    assert.ok(graph.edges.length > 0, 'Graph should have at least one edge');
    const firstEdge = graph.edges[0];
    assert.ok(firstEdge.id, 'Edge should have id');
    assert.ok(firstEdge.source, 'Edge should have source');
    assert.ok(firstEdge.target, 'Edge should have target');
    assert.ok(firstEdge.relation, 'Edge should have relation');
  });

  await t.test('getContinuityState() loads valid config', async () => {
    const state = await getContinuityState();
    const config = state.config;

    // Verify config structure
    assert.ok(config.product, 'Config should have product');
    assert.ok(config.version, 'Config should have version');
    assert.ok(config.continuity, 'Config should have continuity section');
    assert.ok(config.vault, 'Config should have vault section');
    assert.ok(config.protocols, 'Config should have protocols section');
    assert.ok(config.boot_sequence, 'Config should have boot_sequence');

    // Verify boot sequence
    assert.ok(Array.isArray(config.boot_sequence), 'Boot sequence should be an array');
    assert.ok(config.boot_sequence.length === 8, 'Boot sequence should have 8 steps');
  });

  await t.test('getContinuityState() includes metadata', async () => {
    const state = await getContinuityState();
    const metadata = state.metadata;

    assert.ok(metadata.loaded_at, 'Metadata should have loaded_at timestamp');
    assert.ok(metadata.repo_root, 'Metadata should have repo_root');
    assert.ok(metadata.loader_version, 'Metadata should have loader_version');
    assert.strictEqual(metadata.loader_version, 'v1.0.0', 'Loader version should be v1.0.0');
  });

  await t.test('getContinuityFile() loads individual files', async () => {
    const boot = await getContinuityFile('boot');
    const snapshot = await getContinuityFile('snapshot');
    const graph = await getContinuityFile('graph');
    const config = await getContinuityFile('config');

    assert.ok(boot, 'Boot file should load');
    assert.ok(snapshot, 'Snapshot file should load');
    assert.ok(graph, 'Graph file should load');
    assert.ok(config, 'Config file should load');

    assert.strictEqual(typeof boot, 'object', 'Boot should be an object');
    assert.strictEqual(typeof snapshot, 'string', 'Snapshot should be a string');
    assert.strictEqual(typeof graph, 'object', 'Graph should be an object');
    assert.strictEqual(typeof config, 'object', 'Config should be an object');
  });

  await t.test('getContinuityFile() throws on invalid file type', async () => {
    await assert.rejects(
      async () => await getContinuityFile('invalid'),
      /Invalid file type/,
      'Should throw error for invalid file type'
    );
  });

  await t.test('verifyBootStructure() validates required fields', () => {
    const validBoot = {
      version: 'v15.3',
      vault_path: 'AMOS://Test',
      identity_lock: '⟡⟦PAUL⟧ · ⟡⟦MIRRORDNA⟧',
      tone_mode: 'Mirror-Strategic',
      twins: { Claude: 'Reflection' },
      protocols: {
        TruthStateLaw: true,
        ZeroDriftLayer: true,
        TrustByDesign: true
      }
    };

    // Should not throw
    assert.doesNotThrow(() => verifyBootStructure(validBoot));
  });

  await t.test('verifyBootStructure() throws on missing fields', () => {
    const invalidBoot = {
      version: 'v15.3'
      // Missing required fields
    };

    assert.throws(
      () => verifyBootStructure(invalidBoot),
      /missing required fields/,
      'Should throw error for missing fields'
    );
  });

  await t.test('verifyBootStructure() throws on missing protocols', () => {
    const invalidBoot = {
      version: 'v15.3',
      vault_path: 'AMOS://Test',
      identity_lock: '⟡⟦PAUL⟧ · ⟡⟦MIRRORDNA⟧',
      tone_mode: 'Mirror-Strategic',
      twins: { Claude: 'Reflection' },
      protocols: {
        TruthStateLaw: true
        // Missing ZeroDriftLayer and TrustByDesign
      }
    };

    assert.throws(
      () => verifyBootStructure(invalidBoot),
      /missing required protocols/,
      'Should throw error for missing protocols'
    );
  });

  await t.test('verifyContinuity() returns ok status', async () => {
    const result = await verifyContinuity();

    assert.ok(result, 'Result should be defined');
    assert.ok(result.status, 'Result should have status');
    assert.strictEqual(result.status, 'ok', 'Status should be ok');
    assert.ok(result.message, 'Result should have message');
    assert.ok(result.checks, 'Result should have checks');
    assert.ok(result.state, 'Result should include state');
  });

  await t.test('verifyContinuity() performs all checks', async () => {
    const result = await verifyContinuity();

    if (result.status === 'ok') {
      const checks = result.checks;

      assert.strictEqual(checks.boot_loaded, true, 'Boot should be loaded');
      assert.strictEqual(checks.snapshot_loaded, true, 'Snapshot should be loaded');
      assert.strictEqual(checks.graph_loaded, true, 'Graph should be loaded');
      assert.strictEqual(checks.config_loaded, true, 'Config should be loaded');
      assert.strictEqual(checks.required_protocols_active, true, 'All protocols should be active');
      assert.strictEqual(checks.identity_lock_present, true, 'Identity lock should be present');
      assert.strictEqual(checks.version_matches, true, 'Version should match v15.3');
    }
  });

  await t.test('Snapshot contains expected sections', async () => {
    const state = await getContinuityState();
    const snapshot = state.snapshot;

    // Verify key sections exist
    assert.ok(snapshot.includes('System State Overview'), 'Should have System State Overview');
    assert.ok(snapshot.includes('Core Components'), 'Should have Core Components');
    assert.ok(snapshot.includes('Active Protocols'), 'Should have Active Protocols');
    assert.ok(snapshot.includes('Knowledge Graph Nodes'), 'Should have Knowledge Graph Nodes');
    assert.ok(snapshot.includes('Next Boot Instructions'), 'Should have Next Boot Instructions');
    assert.ok(snapshot.includes('Vault Integrity'), 'Should have Vault Integrity');
  });

  await t.test('Graph contains expected node types', async () => {
    const state = await getContinuityState();
    const graph = state.graph;

    const nodeTypes = graph.nodes.map(n => n.type);

    assert.ok(nodeTypes.includes('repository'), 'Should have repository nodes');
    assert.ok(nodeTypes.includes('specification'), 'Should have specification nodes');
    assert.ok(nodeTypes.includes('component'), 'Should have component nodes');
    assert.ok(nodeTypes.includes('file'), 'Should have file nodes');
    assert.ok(nodeTypes.includes('protocol'), 'Should have protocol nodes');
  });

  await t.test('Graph edges define valid relationships', async () => {
    const state = await getContinuityState();
    const graph = state.graph;

    // Verify all edges reference valid nodes
    const nodeIds = graph.nodes.map(n => n.id);

    for (const edge of graph.edges) {
      assert.ok(
        nodeIds.includes(edge.source),
        `Edge ${edge.id} source ${edge.source} should reference a valid node`
      );
      assert.ok(
        nodeIds.includes(edge.target),
        `Edge ${edge.id} target ${edge.target} should reference a valid node`
      );
    }
  });

  await t.test('Config boot_sequence has correct order', async () => {
    const state = await getContinuityState();
    const bootSequence = state.config.boot_sequence;

    // Verify steps are in order 1-8
    for (let i = 0; i < bootSequence.length; i++) {
      assert.strictEqual(
        bootSequence[i].step,
        i + 1,
        `Step ${i + 1} should have step number ${i + 1}`
      );
    }

    // Verify key actions
    const actions = bootSequence.map(s => s.action);
    assert.ok(actions.includes('load_boot_json'), 'Should include load_boot_json');
    assert.ok(actions.includes('verify_checksum'), 'Should include verify_checksum');
    assert.ok(actions.includes('load_snapshot'), 'Should include load_snapshot');
    assert.ok(actions.includes('apply_identity_lock'), 'Should include apply_identity_lock');
    assert.ok(actions.includes('activate_protocols'), 'Should include activate_protocols');
    assert.ok(actions.includes('report_status'), 'Should include report_status');
  });
});

console.log('✅ All continuity loader tests defined');
