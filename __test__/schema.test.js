const Ajv = require('ajv');
const fs = require('node:fs');
const path = require('node:path');

// Initialize JSON schema validator
const ajv = new Ajv({ allErrors: true });

// Meta-schema for validating JSON Schema documents
const metaSchema = require('ajv/lib/refs/json-schema-draft-07.json');

describe('Schema Validation', () => {
  // Paths to schema files
  const schemaFiles = [
    './src/schemas/labels.schema.json',
    './src/schemas/prefix.schema.json',
    './src/schemas/reserved.schema.json'
  ];

  test('all schema files should exist', () => {
    schemaFiles.forEach(schemaPath => {
      expect(fs.existsSync(schemaPath)).toBe(true);
    });
  });

  test('all schema files should be valid JSON', () => {
    schemaFiles.forEach(schemaPath => {
      let schema;
      try {
        const content = fs.readFileSync(schemaPath, 'utf8');
        schema = JSON.parse(content);
        expect(typeof schema).toBe('object');
      } catch (error) {
        expect(false).toBe(true, `Failed to parse ${schemaPath}: ${error.message}`);
      }
    });
  });

  test('all schema files should be valid JSON Schema', () => {
    schemaFiles.forEach(schemaPath => {
      // Create new Ajv instance for each schema to avoid conflicts
      const testAjv = new Ajv({ allErrors: true });
      const schema = require(`../${schemaPath}`);

      // Make sure it's a valid schema by checking if compilation succeeds
      let valid = true;
      try {
        testAjv.compile(schema);
      } catch (error) {
        valid = false;
        console.error(`Schema validation error for ${schemaPath}:`, error.message);
      }

      // No need to log additional errors as we already log them in the catch block above

      expect(valid).toBe(true);
    });
  });

  test('schemas should have required properties defined', () => {
    schemaFiles.forEach(schemaPath => {
      const schema = require(`../${schemaPath}`);

      // Check that schema has basic required properties
      expect(schema).toHaveProperty('$schema');
      expect(schema).toHaveProperty('type');

      // For array schemas, check items definition
      if (schema.type === 'array') {
        expect(schema).toHaveProperty('items');

        // If items is an object schema, check it has properties defined
        if (schema.items.type === 'object') {
          expect(schema.items).toHaveProperty('properties');
          expect(Object.keys(schema.items.properties).length).toBeGreaterThan(0);

          // Check required properties are defined
          if (schema.items.required) {
            schema.items.required.forEach(requiredProp => {
              expect(schema.items.properties).toHaveProperty(requiredProp);
            });
          }
        }
      }
    });
  });

  test('schema references should be resolvable', () => {
    // Create a new Ajv instance with all schemas loaded
    const ajvWithSchemas = new Ajv({ allErrors: true });

    // Load all schemas first
    const loadedSchemas = schemaFiles.map(schemaPath => {
      const schema = require(`../${schemaPath}`);
      const id = schema.$id || path.basename(schemaPath);
      ajvWithSchemas.addSchema(schema, id);
      return { id, schema };
    });

    // Check that all $ref references can be resolved
    loadedSchemas.forEach(({ id, schema }) => {
      // Function to recursively find all $ref values in the schema
      function findRefs(obj, refs = []) {
        if (!obj || typeof obj !== 'object') return refs;

        if (obj.$ref) {
          refs.push(obj.$ref);
        }

        Object.values(obj).forEach(value => {
          if (typeof value === 'object') {
            findRefs(value, refs);
          }
        });

        return refs;
      }

      const refs = findRefs(schema);

      // Verify each reference can be resolved
      refs.forEach(ref => {
        try {
          const resolved = ajvWithSchemas.getSchema(ref);
          expect(resolved).toBeTruthy();
        } catch (error) {
          fail(`Schema ${id} contains unresolvable reference: ${ref}`);
        }
      });
    });
  });
});
