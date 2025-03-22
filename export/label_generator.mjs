/**
 * GitHub Label Generator
 *
 * Generates GitHub label configuration files based on predefined sets
 * and color schemes.
 */

const fs = require('fs');
const path = require('path');

// Color definitions from the provided table
const COLORS = {
  GRAY: ['f6f6f6', 'e2e2e2', '8b8b8b', '6f6f6f', '3e3e3e', '222222'],
  ROSE: ['fff7f9', 'ffdce5', 'ff3b8d', 'db0072', '800040', '4c0023'],
  RASPBERRY: ['fff8f8', 'ffdddf', 'ff426c', 'de0051', '82002c', '510018'],
  RED: ['fff8f6', 'ffddd8', 'ff4647', 'e0002b', '830014', '530003'],
  ORANGE: ['fff8f5', 'ffded1', 'fd4d00', 'cd3c00', '752100', '401600'],
  AMBER: ['fff8ef', 'ffe0b2', 'b98300', '926700', '523800', '302100'],
  YELLOW: ['fff9e5', 'ffe53e', '9c8b00', '7d6f00', '463d00', '292300'],
  LIME: ['f7ffac', 'd5f200', '819300', '677600', '394100', '222600'],
  GREEN: ['e0ffd9', '72ff6c', '00a21f', '008217', '004908', '062800'],
  EMERALD: ['dcffe6', '5dffa2', '00a05a', '008147', '004825', '002812'],
  AQUAMARINE: ['daffef', '42ffc6', '009f78', '007f5f', '004734', '00281b'],
  TEAL: ['d7fff7', '00ffe4', '009e8c', '007c6e', '00443c', '002722'],
  CYAN: ['c4fffe', '00fafb', '00999a', '007a7b', '004344', '002525'],
  POWDER: ['dafaff', '8df0ff', '0098a9', '007987', '004048', '002227'],
  SKY: ['e3f7ff', 'aee9ff', '0094b4', '007590', '00404f', '001f28'],
  CERULEAN: ['e8f6ff', 'b9e3ff', '0092c5', '00749d', '003c54', '001d2a'],
  AZURE: ['e8f2ff', 'c6e0ff', '008fdb', '0071af', '003b5e', '001c30'],
  BLUE: ['f0f4ff', 'd4e0ff', '0089fc', '006dca', '00386d', '001a39'],
  INDIGO: ['f3f3ff', 'deddff', '657eff', '0061fc', '00328a', '001649'],
  VIOLET: ['f7f1ff', 'e8daff', '9b70ff', '794aff', '2d0fbf', '0b0074'],
  PURPLE: ['fdf4ff', 'f7d9ff', 'd150ff', 'b01fe3', '660087', '3a004f'],
  MAGENTA: ['fff3fc', 'ffd7f6', 'f911e0', 'ca00b6', '740068', '44003c'],
  PINK: ['fff7fb', 'ffdcec', 'ff2fb2', 'd2008f', '790051', '4b0030']
};

// Prefix labels definition
const prefixLabels = [
  // Effort labels
  ...['1', '2', '3', '5', '8', '13'].map((value, index) => ({
    name: `Effort: ${value}`,
    color: COLORS.GRAY[index],
    description: `${['Minimal', 'Very small', 'Small', 'Medium', 'Large', 'Very large'][index]} effort required (${value} points)`
  })),

  // Priority labels
  {
    name: 'Priority: now',
    color: COLORS.RED[2],
    description: 'Needs immediate attention'
  },
  {
    name: 'Priority: 2day',
    color: COLORS.ORANGE[2],
    description: 'Should be addressed within 2 days'
  },
  {
    name: 'Priority: soon',
    color: COLORS.YELLOW[1],
    description: 'Should be addressed soon'
  },

  // State labels
  {
    name: 'State: approved',
    color: COLORS.GREEN[1],
    description: 'Approved for implementation'
  },
  {
    name: 'State: blocked',
    color: COLORS.RED[2],
    description: 'Blocked, cannot proceed'
  },
  {
    name: 'State: inactive',
    color: COLORS.GRAY[2],
    description: 'Not currently being worked on'
  },
  {
    name: 'State: pending',
    color: COLORS.YELLOW[1],
    description: 'Awaiting decision or action'
  },

  // Type labels
  {
    name: 'Type: bug',
    color: COLORS.RED[2],
    description: 'Something isn\'t working correctly'
  },
  {
    name: 'Type: chore',
    color: COLORS.GRAY[2],
    description: 'Maintenance task with no user-facing value'
  },
  {
    name: 'Type: discussion',
    color: COLORS.BLUE[2],
    description: 'Discussion or feedback needed'
  },
  {
    name: 'Type: docs',
    color: COLORS.AQUAMARINE[1],
    description: 'Documentation addition or update'
  },
  {
    name: 'Type: feature',
    color: COLORS.GREEN[1],
    description: 'New feature or enhancement'
  },
  {
    name: 'Type: fix',
    color: COLORS.ORANGE[2],
    description: 'Bug fix or error correction'
  },
  {
    name: 'Type: security',
    color: COLORS.PINK[2],
    description: 'Security vulnerability or concern'
  },
  {
    name: 'Type: testing',
    color: COLORS.TEAL[1],
    description: 'Test creation or modification'
  },

  // Work labels
  {
    name: 'Work: chaotic',
    color: COLORS.RED[2],
    description: 'Unpredictable work with high uncertainty'
  },
  {
    name: 'Work: complex',
    color: COLORS.ORANGE[2],
    description: 'Work with many interconnected parts'
  },
  {
    name: 'Work: complicated',
    color: COLORS.YELLOW[1],
    description: 'Detailed work requiring expertise'
  },
  {
    name: 'Work: obvious',
    color: COLORS.GREEN[1],
    description: 'Clear, straightforward work'
  }
];

// Reserved labels definition
const reservedLabels = [
  {
    name: 'Assignee',
    color: COLORS.PURPLE[2],
    description: 'The person assigned to the task [user:username]'
  },
  {
    name: 'Cycle',
    color: COLORS.BLUE[2],
    description: 'The current iteration cycle [sprint:Sprint 1]'
  },
  {
    name: 'Effort',
    color: COLORS.ORANGE[2],
    description: 'The amount of work required [points:5]'
  },
  {
    name: 'Estimate',
    color: COLORS.AMBER[2],
    description: 'The estimated time to complete the task [hours:3]'
  },
  {
    name: 'Hours',
    color: COLORS.CYAN[1],
    description: 'Actual hours spent on the task [logged:2.5]'
  },
  {
    name: 'Priority',
    color: COLORS.RASPBERRY[2],
    description: 'The task priority level [level:High]'
  },
  {
    name: 'Project',
    color: COLORS.INDIGO[2],
    description: 'The project to which the task belongs [name:Project Alpha]'
  },
  {
    name: 'State',
    color: COLORS.GREEN[1],
    description: 'The current state of the task [status:In Progress]'
  },
  {
    name: 'Status',
    color: COLORS.EMERALD[1],
    description: 'The overall task status [state:Open]'
  }
];

// Write files
const writeJsonFile = (filename, data) => {
  const formattedJson = JSON.stringify(data, null, 2);
  fs.writeFileSync(filename, formattedJson, 'utf8');
  console.log(`Generated ${filename} with ${data.length} labels`);
};

// Generate the files
try {
  writeJsonFile('github-prefix-labels.json', prefixLabels);
  writeJsonFile('github-reserved-labels.json', reservedLabels);

  // Generate a combined file if needed
  writeJsonFile('github-all-labels.json', [...prefixLabels, ...reservedLabels]);

  console.log('Label generation completed successfully');
} catch (error) {
  console.error('Error generating label files:', error);
}

// Export data for use in other modules
module.exports = {
  colors: COLORS,
  prefixLabels,
  reservedLabels
};