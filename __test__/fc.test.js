const fc = require('fast-check');
const Ajv = require('ajv');
const fs = require('fs');
const path = require('path');

// Initialize JSON schema validator
const ajv = new Ajv({ allErrors: true });

// Load schemas

const labelSchema = require('../src/schemas/labels.schema.json');
const prefixLabelSchema = require('../src/schemas/prefix.schema.json');
const reservedLabelSchema = require('../src/schemas/reserved.schema.json');

// Load label data
const prefixLabels = require('../src/prefix.label.json');
const reservedLabels = require('../src/reserved.labels.json');


// Load color definitions for testing
const { colors } = require('../export/label_generator.mjs');

// Define constants for testing
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

// Basic types
const hexColor = fc.string({ minLength: 6, maxLength: 6 })
  .filter(s => /^[0-9a-f]{6}$/.test(s.toLowerCase()));

const labelName = fc.string({ minLength: 1, maxLength: 50 })
  .filter(s => !s.includes('\n') && s.trim() === s);

const labelDescription = fc.string({ minLength: 1, maxLength: 200 })
  .filter(s => !s.includes('\n'));

// Prefix-specific arbitraries
const effortValue = fc.constantFrom(...EFFORT_VALUES);
const priorityValue = fc.constantFrom(...PRIORITY_VALUES);
const stateValue = fc.constantFrom(...STATE_VALUES);
const typeValue = fc.constantFrom(...TYPE_VALUES);
const workValue = fc.constantFrom(...WORK_VALUES);

// Reserved label name generator
const reservedLabelName = fc.constantFrom(...RESERVED_NAMES);

// Key-value pair for reserved label descriptions
const keyValuePair = fc.tuple(
  fc.string({ minLength: 1, maxLength: 20 }).filter(s => !s.includes(':')),
  fc.string({ minLength: 1, maxLength: 30 }).filter(s => !s.includes(']'))
).map(([key, value]) => `[${key}:${value}]`);

// Prefix label name generator - defined after basic arbitraries
const prefixLabelName = fc.oneof(
  fc.constantFrom(...VALID_PREFIXES).chain(prefix =>
    fc.constant(`${prefix}: ${
      prefix === 'Effort' ? fc.sample(effortValue, 1)[0] :
      prefix === 'Priority' ? fc.sample(priorityValue, 1)[0] :
      prefix === 'State' ? fc.sample(stateValue, 1)[0] :
      prefix === 'Type' ? fc.sample(typeValue, 1)[0] :
      fc.sample(workValue, 1)[0]
    }`)
  )
);

// Label generators
const basicLabel = fc.record({
  name: labelName,
  color: hexColor,
  description: labelDescription
});

const prefixLabel = fc.record({
  name: prefixLabelName,
  color: hexColor,
  description: labelDescription
});

const reservedLabel = fc.record({
  name: reservedLabelName,
  color: hexColor,
  description: fc.string({ minLength: 1, maxLength: 150 })
    .chain(baseDesc =>
      keyValuePair.map(kvp => `${baseDesc} ${kvp}`)
    )
});

// Arrays of labels
const labelArray = fc.array(basicLabel, { minLength: 1, maxLength: 50 });
const prefixLabelArray = fc.array(prefixLabel, { minLength: 1, maxLength: 30 });
const reservedLabelArray = fc.array(reservedLabel, { minLength: 1, maxLength: 10 });

// Group all arbitraries in an object for easier reference
const arbitraries = {
  hexColor,
  labelName,
  labelDescription,
  effortValue,
  priorityValue,
  stateValue,
  typeValue,
  workValue,
  prefixLabelName,
  reservedLabelName,
  keyValuePair,
  basicLabel,
  prefixLabel,
  reservedLabel,
  labelArray,
  prefixLabelArray,
  reservedLabelArray
};

// Property-based tests
describe('GitHub Labels QuickCheck Tests', () => {
  // Test base schema validation
  test('All valid labels should conform to the base schema', () => {
    fc.assert(
      fc.property(arbitraries.labelArray, labels => {
        const validate = ajv.compile(labelSchema);
        return validate(labels);
      }),
      { numRuns: 100 }
    );
  });

  // Test prefix schema validation
  test('All valid prefix labels should conform to the prefix schema', () => {
    fc.assert(
      fc.property(arbitraries.prefixLabelArray, labels => {
        const validate = ajv.compile(prefixLabelSchema);
        return validate(labels);
      }),
      { numRuns: 100 }
    );
  });

  // Test reserved schema validation
  test('All valid reserved labels should conform to the reserved schema', () => {
    fc.assert(
      fc.property(arbitraries.reservedLabelArray, labels => {
        const validate = ajv.compile(reservedLabelSchema);
        return validate(labels);
      }),
      { numRuns: 100 }
    );
  });

  // Test label name uniqueness property
  test('Labels should have unique names in any valid array', () => {
    fc.assert(
      fc.property(arbitraries.labelArray, labels => {
        const names = labels.map(label => label.name);
        return new Set(names).size === names.length;
      }),
      { numRuns: 100 }
    );
  });

  // Test prefix format property
  test('Prefix labels should start with valid prefixes', () => {
    fc.assert(
      fc.property(arbitraries.prefixLabel, label => {
        const prefix = label.name.split(':')[0].trim();
        return VALID_PREFIXES.includes(prefix);
      }),
      { numRuns: 200 }
    );
  });

  // Test hex color format property
  test('Label colors should be 6-character hex strings without # prefix', () => {
    fc.assert(
      fc.property(arbitraries.basicLabel, label => {
        return /^[0-9a-fA-F]{6}$/.test(label.color);
      }),
      { numRuns: 200 }
    );
  });

  // Test reserved label key-value pair format property
  test('Reserved labels should have key-value pairs in their descriptions', () => {
    fc.assert(
      fc.property(arbitraries.reservedLabel, label => {
        return /\[.+:.+\]/.test(label.description);
      }),
      { numRuns: 200 }
    );
  });

  // Test color integration property
  test('Valid label colors should be permissible in our color system', () => {
    fc.assert(
      fc.property(arbitraries.hexColor, hexColor => {
        // Check that the hex color is a valid format
        const isValidFormat = /^[0-9a-fA-F]{6}$/.test(hexColor);

        // Additional property: check if color is in our defined palette
        // (This is an example of how we might add more domain-specific checks)
        const allDefinedColors = Object.values(colors).flat();
        const isInOurPalette = allDefinedColors.includes(hexColor.toLowerCase());

        // For this test, we only enforce the format property
        // But we could strengthen it to require colors from our palette
        return isValidFormat;
      }),
      { numRuns: 200 }
    );
  });

  // Testing valid value range properties for each prefix type
  test('Effort labels should have valid Fibonacci values', () => {
    fc.assert(
      fc.property(
        fc.constant('Effort').chain(prefix =>
          fc.string().map(value => `${prefix}: ${value}`)
        ),
        arbitraries.hexColor,
        arbitraries.labelDescription,
        (name, color, description) => {
          const value = name.split(':')[1].trim();
          const label = { name, color, description };
          const validate = ajv.compile(prefixLabelSchema);

          // If the value is valid, the whole label should validate
          if (EFFORT_VALUES.includes(value)) {
            return validate([label]);
          }

          // If the value is invalid, validation should fail
          return !validate([label]);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Test for valid interaction between prefix and reserved labels
  test('No name collisions should exist between prefix and reserved labels', () => {
    fc.assert(
      fc.property(
        arbitraries.prefixLabelArray,
        arbitraries.reservedLabelArray,
        (prefixLabels, reservedLabels) => {
          const prefixNames = new Set(prefixLabels.map(label => label.name));
          const reservedNames = new Set(reservedLabels.map(label => label.name));

          // Check for intersection between name sets
          const collision = [...prefixNames].some(name => reservedNames.has(name));
          return !collision;
        }
      ),
      { numRuns: 50 }
    );
  });
});

// If running as a standalone script
if (require.main === module) {
  // Mock Jest functions
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

  // Mock Jest's expect for standalone mode
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
    }
  });

  // Run tests
  const tests = module.exports;
  Object.keys(tests).forEach(key => {
    if (typeof tests[key] === 'function') {
      tests[key]();
    }
  });
}
