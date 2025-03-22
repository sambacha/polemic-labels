const Ajv = require('ajv');
const fs = require('node:fs');
const path = require('node:path');

// Initialize JSON schema validator
const ajv = new Ajv({ allErrors: true });

// Load schemas
const labelSchema = require('../src/schemas/labels.schema.json');
const prefixLabelSchema = require('../src/schemas/prefix.schema.json');
const reservedLabelSchema = require('../src/schemas/reserved.schema.json');

// Load label data
const prefixLabels = require('../src/prefix.label.json');
const reservedLabels = require('../src/reserved.labels.json');

describe('GitHub Labels Validation', () => {
  // Test prefix labels
  describe('Prefix Labels', () => {
    test('should validate against the base schema', () => {
      const validate = ajv.compile(labelSchema);
      const valid = validate(prefixLabels);

      if (!valid) {
        console.error('Validation errors:', JSON.stringify(validate.errors, null, 2));
      }

      expect(valid).toBe(true);
    });

    test('should validate against the prefix label schema', () => {
      const validate = ajv.compile(prefixLabelSchema);
      const valid = validate(prefixLabels);

      if (!valid) {
        console.error('Validation errors:', JSON.stringify(validate.errors, null, 2));
      }

      expect(valid).toBe(true);
    });

    test('should have no duplicate label names', () => {
      const labelNames = prefixLabels.map(label => label.name);
      const uniqueNames = new Set(labelNames);

      expect(labelNames.length).toBe(uniqueNames.size);
    });

    test('should have valid prefixes', () => {
      const validPrefixes = ['Effort', 'Priority', 'State', 'Type', 'Work'];

      prefixLabels.forEach(label => {
        const prefix = label.name.split(':')[0].trim();
        expect(validPrefixes).toContain(prefix);
      });
    });

    test('should have all expected Effort values', () => {
      const effortValues = prefixLabels
        .filter(label => label.name.startsWith('Effort:'))
        .map(label => label.name.split(':')[1].trim());

      expect(effortValues.sort()).toEqual(['1', '13', '2', '3', '5', '8'].sort());
    });

    test('should have all expected Priority values', () => {
      const priorityValues = prefixLabels
        .filter(label => label.name.startsWith('Priority:'))
        .map(label => label.name.split(':')[1].trim());

      expect(priorityValues.sort()).toEqual(['now', '2day', 'soon'].sort());
    });

    test('should have all expected State values', () => {
      const stateValues = prefixLabels
        .filter(label => label.name.startsWith('State:'))
        .map(label => label.name.split(':')[1].trim());

      expect(stateValues.sort()).toEqual(['approved', 'blocked', 'inactive', 'pending'].sort());
    });

    test('should have all expected Type values', () => {
      const typeValues = prefixLabels
        .filter(label => label.name.startsWith('Type:'))
        .map(label => label.name.split(':')[1].trim());

      expect(typeValues.sort()).toEqual(
        ['bug', 'chore', 'discussion', 'docs', 'feature', 'fix', 'security', 'testing'].sort()
      );
    });

    test('should have all expected Work values', () => {
      const workValues = prefixLabels
        .filter(label => label.name.startsWith('Work:'))
        .map(label => label.name.split(':')[1].trim());

      expect(workValues.sort()).toEqual(['chaotic', 'complex', 'complicated', 'obvious'].sort());
    });

    test('should have valid hex colors without # prefix', () => {
      const hexColorRegex = /^[0-9a-fA-F]{6}$/;

      prefixLabels.forEach(label => {
        expect(hexColorRegex.test(label.color)).toBe(true);
      });
    });
  });

  // Test reserved labels
  describe('Reserved Labels', () => {
    test('should validate against the base schema', () => {
      const validate = ajv.compile(labelSchema);
      const valid = validate(reservedLabels);

      if (!valid) {
        console.error('Validation errors:', JSON.stringify(validate.errors, null, 2));
      }

      expect(valid).toBe(true);
    });

    test('should validate against the reserved label schema', () => {
      const validate = ajv.compile(reservedLabelSchema);
      const valid = validate(reservedLabels);

      if (!valid) {
        console.error('Validation errors:', JSON.stringify(validate.errors, null, 2));
      }

      expect(valid).toBe(true);
    });

    test('should have no duplicate label names', () => {
      const labelNames = reservedLabels.map(label => label.name);
      const uniqueNames = new Set(labelNames);

      expect(labelNames.length).toBe(uniqueNames.size);
    });

    test('should have all expected reserved labels', () => {
      const expectedLabels = [
        'Assignee', 'Cycle', 'Effort', 'Estimate', 'Hours',
        'Priority', 'Project', 'State', 'Status'
      ];

      const labelNames = reservedLabels.map(label => label.name);

      expect(labelNames.sort()).toEqual(expectedLabels.sort());
    });

    test('should have key-value pair notation in descriptions', () => {
      const keyValueRegex = /\[.+:.+\]/;

      reservedLabels.forEach(label => {
        expect(keyValueRegex.test(label.description)).toBe(true);
      });
    });

    test('should have valid hex colors without # prefix', () => {
      const hexColorRegex = /^[0-9a-fA-F]{6}$/;

      reservedLabels.forEach(label => {
        expect(hexColorRegex.test(label.color)).toBe(true);
      });
    });
  });

  // Integration tests
  describe('Integration Tests', () => {
    test('should not have name collisions between prefix and reserved labels', () => {
      const prefixNames = new Set(prefixLabels.map(label => label.name));
      const reservedNames = new Set(reservedLabels.map(label => label.name));

      const intersection = [...prefixNames].filter(name => reservedNames.has(name));

      expect(intersection).toHaveLength(0);
    });

    test('should have appropriate prefixes only in prefix labels', () => {
      const validPrefixes = ['Effort:', 'Priority:', 'State:', 'Type:', 'Work:'];

      // Check that prefix labels have valid prefixes
      prefixLabels.forEach(label => {
        const hasValidPrefix = validPrefixes.some(prefix => label.name.startsWith(prefix));
        expect(hasValidPrefix).toBe(true);
      });

      // Check that reserved labels don't have these prefixes
      reservedLabels.forEach(label => {
        const hasValidPrefix = validPrefixes.some(prefix => label.name.startsWith(prefix));
        expect(hasValidPrefix).toBe(false);
      });
    });
  });
});

// Utility function to run the tests directly from command line
if (require.main === module) {
  const runTests = async () => {
    try {
      // Mock Jest's expect
      global.expect = (actual) => ({
        toBe: (expected) => {
          if (actual !== expected) {
            throw new Error(`Expected ${expected} but got ${actual}`);
          }
        },
        toEqual: (expected) => {
          const actualStr = JSON.stringify(actual);
          const expectedStr = JSON.stringify(expected);
          if (actualStr !== expectedStr) {
            throw new Error(`Expected ${expectedStr} but got ${actualStr}`);
          }
        },
        toContain: (expected) => {
          if (!actual.includes(expected)) {
            throw new Error(`Expected ${actual} to contain ${expected}`);
          }
        },
        toHaveLength: (expected) => {
          if (actual.length !== expected) {
            throw new Error(`Expected length ${expected} but got ${actual.length}`);
          }
        }
      });

      // Mock Jest's describe and test
      global.describe = (name, fn) => {
        console.log(`\n${name}`);
        fn();
      };

      global.test = (name, fn) => {
        try {
          fn();
          console.log(`✓ ${name}`);
        } catch (error) {
          console.error(`✗ ${name}`);
          console.error(`  ${error.message}`);
        }
      };

      // Run the tests
      const tests = module.exports;
      Object.keys(tests).forEach(key => {
        if (typeof tests[key] === 'function') {
          tests[key]();
        }
      });

    } catch (error) {
      console.error('Error running tests:', error);
    }
  };

  runTests();
}
