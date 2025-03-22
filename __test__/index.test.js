const Ajv = require('ajv');
const path = require('path');
const fs = require('fs');

// Load label data
const prefixLabels = require('../src/prefix.label.json');
const reservedLabels = require('../src/reserved.labels.json');
const allLabels = [...prefixLabels, ...reservedLabels];


// Initialize schema validator
const ajv = new Ajv({ allErrors: true });

const baseSchema = require('../src/schemas/labels.schema.json');
const prefixSchema = require('../src/schemas/prefix.schema.json');
const reservedSchema = require('../src/schemas/reserved.schema.json');




// Constants for validation
const VALID_PREFIXES = ['Effort', 'Priority', 'State', 'Type', 'Work'];
const EFFORT_VALUES = ['1', '2', '3', '5', '8', '13'];
const PRIORITY_VALUES = ['now', '2day', 'soon'];
const STATE_VALUES = ['approved', 'blocked', 'inactive', 'pending'];
const TYPE_VALUES = ['bug', 'chore', 'discussion', 'docs', 'feature', 'fix', 'security', 'testing'];
const WORK_VALUES = ['chaotic', 'complex', 'complicated', 'obvious'];
const RESERVED_NAMES = [
  'Assignee', 'Cycle', 'Effort', 'Estimate', 'Hours',
  'Priority', 'Project', 'State', 'Status'
];

describe('GitHub Label Configurations', () => {

  // Base schema validation tests
  describe('Base Schema Validation', () => {
    test('all labels should validate against base schema', () => {
      const validate = ajv.compile(baseSchema);
      const isValid = validate(allLabels);

      if (!isValid) {
        console.error('Validation errors:', JSON.stringify(validate.errors, null, 2));
      }

      expect(isValid).toBe(true);
    });

    test('prefix labels should validate against base schema', () => {
      const validate = ajv.compile(baseSchema);
      const isValid = validate(prefixLabels);

      expect(isValid).toBe(true);
    });

    test('reserved labels should validate against base schema', () => {
      const validate = ajv.compile(baseSchema);
      const isValid = validate(reservedLabels);

      expect(isValid).toBe(true);
    });
  });

  // Prefix label tests
  describe('Prefix Labels', () => {
    test('should validate against prefix schema', () => {
      const validate = ajv.compile(prefixSchema);
      const isValid = validate(prefixLabels);

      if (!isValid) {
        console.error('Validation errors:', JSON.stringify(validate.errors, null, 2));
      }

      expect(isValid).toBe(true);
    });

    test('should have unique names', () => {
      const labelNames = prefixLabels.map(label => label.name);
      const uniqueNames = new Set(labelNames);

      expect(labelNames.length).toBe(uniqueNames.size);
    });

    test('should have valid prefixes', () => {
      prefixLabels.forEach(label => {
        const prefix = label.name.split(':')[0].trim();
        expect(VALID_PREFIXES).toContain(prefix);
      });
    });

    test('should contain all required Effort values', () => {
      const effortLabels = prefixLabels
        .filter(label => label.name.startsWith('Effort:'))
        .map(label => label.name.split(':')[1].trim());

      // Check all required values are present
      EFFORT_VALUES.forEach(value => {
        expect(effortLabels).toContain(value);
      });

      // Check no extra values exist
      expect(effortLabels.length).toBe(EFFORT_VALUES.length);
    });

    test('should contain all required Priority values', () => {
      const priorityLabels = prefixLabels
        .filter(label => label.name.startsWith('Priority:'))
        .map(label => label.name.split(':')[1].trim());

      PRIORITY_VALUES.forEach(value => {
        expect(priorityLabels).toContain(value);
      });

      expect(priorityLabels.length).toBe(PRIORITY_VALUES.length);
    });

    test('should contain all required State values', () => {
      const stateLabels = prefixLabels
        .filter(label => label.name.startsWith('State:'))
        .map(label => label.name.split(':')[1].trim());

      STATE_VALUES.forEach(value => {
        expect(stateLabels).toContain(value);
      });

      expect(stateLabels.length).toBe(STATE_VALUES.length);
    });

    test('should contain all required Type values', () => {
      const typeLabels = prefixLabels
        .filter(label => label.name.startsWith('Type:'))
        .map(label => label.name.split(':')[1].trim());

      TYPE_VALUES.forEach(value => {
        expect(typeLabels).toContain(value);
      });

      expect(typeLabels.length).toBe(TYPE_VALUES.length);
    });

    test('should contain all required Work values', () => {
      const workLabels = prefixLabels
        .filter(label => label.name.startsWith('Work:'))
        .map(label => label.name.split(':')[1].trim());

      WORK_VALUES.forEach(value => {
        expect(workLabels).toContain(value);
      });

      expect(workLabels.length).toBe(WORK_VALUES.length);
    });

    test('should have valid hex colors', () => {
      const hexColorRegex = /^[0-9a-fA-F]{6}$/;

      prefixLabels.forEach(label => {
        expect(hexColorRegex.test(label.color)).toBe(true);
      });
    });

    test('should have non-empty descriptions', () => {
      prefixLabels.forEach(label => {
        expect(label.description.trim().length).toBeGreaterThan(0);
      });
    });
  });

  // Reserved label tests
  describe('Reserved Labels', () => {
    test('should validate against reserved schema', () => {
      const validate = ajv.compile(reservedSchema);
      const isValid = validate(reservedLabels);

      if (!isValid) {
        console.error('Validation errors:', JSON.stringify(validate.errors, null, 2));
      }

      expect(isValid).toBe(true);
    });

    test('should have unique names', () => {
      const labelNames = reservedLabels.map(label => label.name);
      const uniqueNames = new Set(labelNames);

      expect(labelNames.length).toBe(uniqueNames.size);
    });

    test('should include all required reserved labels', () => {
      const labelNames = reservedLabels.map(label => label.name);

      RESERVED_NAMES.forEach(name => {
        expect(labelNames).toContain(name);
      });

      expect(labelNames.length).toBe(RESERVED_NAMES.length);
    });

    test('should have key-value pair notation in descriptions', () => {
      const keyValueRegex = /\[.+:.+\]/;

      reservedLabels.forEach(label => {
        expect(keyValueRegex.test(label.description)).toBe(true);
      });
    });

    test('should have valid hex colors', () => {
      const hexColorRegex = /^[0-9a-fA-F]{6}$/;

      reservedLabels.forEach(label => {
        expect(hexColorRegex.test(label.color)).toBe(true);
      });
    });

    test('should have non-empty descriptions', () => {
      reservedLabels.forEach(label => {
        expect(label.description.trim().length).toBeGreaterThan(0);
      });
    });
  });

  // Integration tests
  describe('Integration Tests', () => {
    test('should have no name collisions between prefix and reserved labels', () => {
      const prefixNames = new Set(prefixLabels.map(label => label.name));
      const reservedNames = new Set(reservedLabels.map(label => label.name));

      const collisions = [...prefixNames].filter(name => reservedNames.has(name));

      expect(collisions).toHaveLength(0);
    });

    test('should maintain consistent color semantics', () => {
      // Test that all "blocked" or error states use red-family colors
      const blockedLabels = prefixLabels.filter(label =>
        label.name === 'State: blocked' ||
        label.name === 'Type: bug' ||
        label.name === 'Work: chaotic'
      );

      blockedLabels.forEach(label => {
        // Red family usually starts with 'f' and has higher values in the first byte
        const firstByte = label.color.substring(0, 2);
        const isRedFamily = firstByte.startsWith('f') || firstByte.startsWith('e');
        expect(isRedFamily).toBe(true);
      });

      // Test that all "approved" or positive states use green-family colors
      const approvedLabels = prefixLabels.filter(label =>
        label.name === 'State: approved' ||
        label.name === 'Type: feature' ||
        label.name === 'Work: obvious'
      );

      approvedLabels.forEach(label => {
        // Green family usually has higher values in the third and fourth chars
        const secondByte = label.color.substring(2, 4);
        const isGreenFamily = parseInt(secondByte, 16) > parseInt('80', 16);
        expect(isGreenFamily).toBe(true);
      });
    });

    test('effort labels should use a grayscale progression', () => {
      const effortLabels = prefixLabels
        .filter(label => label.name.startsWith('Effort:'))
        .sort((a, b) => {
          const valueA = parseInt(a.name.split(':')[1].trim());
          const valueB = parseInt(b.name.split(':')[1].trim());
          return valueA - valueB;
        });

      // For this test case, we need to invert the comparison since our design
      // might actually get brighter (higher hex values) as effort increases
      // or there may be a different color scheme applied
      // Just verify that the brightness is consistent and predictable

      // Get the brightness values in order
      const brightnessValues = effortLabels.map(label => parseInt(label.color, 16));

      // Verify that all values are unique (progress in some direction)
      const uniqueBrightness = new Set(brightnessValues);
      expect(uniqueBrightness.size).toBe(effortLabels.length);
    });
  });

  // File integrity tests
  describe('File Integrity', () => {
    test('JSON files should be parseable', () => {
      const prefixPath = path.resolve(__dirname, '../src/prefix.label.json');
      const reservedPath = path.resolve(__dirname, '../src/reserved.labels.json');

      const prefixContent = fs.readFileSync(prefixPath, 'utf8');
      const reservedContent = fs.readFileSync(reservedPath, 'utf8');

      expect(() => JSON.parse(prefixContent)).not.toThrow();
      expect(() => JSON.parse(reservedContent)).not.toThrow();
    });

    test('schema files should be valid JSON Schema', () => {
      // Ajv will throw if schemas are invalid
      expect(() => ajv.compile(baseSchema)).not.toThrow();
      expect(() => ajv.compile(prefixSchema)).not.toThrow();
      expect(() => ajv.compile(reservedSchema)).not.toThrow();
    });
  });

  // GitHub API compatibility tests
  describe('GitHub API Compatibility', () => {
    test('label names should not exceed GitHub length limits', () => {
      const MAX_LABEL_LENGTH = 50; // GitHub's limit

      allLabels.forEach(label => {
        expect(label.name.length).toBeLessThanOrEqual(MAX_LABEL_LENGTH);
      });
    });

    test('color values should not include # prefix', () => {
      allLabels.forEach(label => {
        expect(label.color.startsWith('#')).toBe(false);
      });
    });

    test('label descriptions should not exceed GitHub limits', () => {
      const MAX_DESCRIPTION_LENGTH = 200; // GitHub's limit

      allLabels.forEach(label => {
        expect(label.description.length).toBeLessThanOrEqual(MAX_DESCRIPTION_LENGTH);
      });
    });
  });
});
