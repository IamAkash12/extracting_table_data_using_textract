const _ = require("lodash");
const aws = require("aws-sdk");
const config = require("./config");

aws.config.update({
  accessKeyId: config.awsAccesskeyID,
  secretAccessKey: config.awsSecretAccessKey,
  region: config.awsRegion
});

const textract = new aws.Textract();

// Function to get text from result using blocksMap
const getText = (result, blocksMap) => {
  let text = "";

  if (_.has(result, "Relationships")) {
    result.Relationships.forEach(relationship => {
      if (relationship.Type === "CHILD") {
        relationship.Ids.forEach(childId => {
          const word = blocksMap[childId];
          if (word.BlockType === "WORD") {
            text += `${word.Text} `;
          }
          if (word.BlockType === "SELECTION_ELEMENT") {
            if (word.SelectionStatus === "SELECTED") {
              text += `X `;
            }
          }
        });
      }
    });
  }

  return text.trim();
};

// Function to extract table data
const extractTables = blocks => {
  const blocksMap = {};
  const tableBlocks = [];

  blocks.forEach(block => {
    blocksMap[block.Id] = block;
    if (block.BlockType === "TABLE") {
      tableBlocks.push(block);
    }
  });

  const tables = [];

  tableBlocks.forEach(tableBlock => {
    const table = [];
    if (tableBlock.Relationships) {
      tableBlock.Relationships.forEach(relationship => {
        if (relationship.Type === "CHILD") {
          relationship.Ids.forEach(childId => {
            const cell = blocksMap[childId];
            if (cell.BlockType === "CELL") {
              const rowIndex = cell.RowIndex - 1;
              const colIndex = cell.ColumnIndex - 1;
              const text = getText(cell, blocksMap);

              if (!table[rowIndex]) {
                table[rowIndex] = [];
              }
              table[rowIndex][colIndex] = text;
            }
          });
        }
      });
    }
    tables.push(table);
  });

  return tables;
};

module.exports = async buffer => {
  const params = {
    Document: {
      Bytes: buffer
    },
    FeatureTypes: ["TABLES"]
  };

  const request = textract.analyzeDocument(params);
  const data = await request.promise();

  if (data && data.Blocks) {
    const tables = extractTables(data.Blocks);
    return tables;
  }
  return undefined;
};
