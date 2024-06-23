## Steps to execute

1. `mkdir textract-lab`
2. `cd textract-lab && yarn init` (install yarn if it is not downloaded already)
3. `touch index.js`
4. `yarn add commander aws-sdk lodash`
5. Create a config file:
    ```javascript
    module.exports = {
        awsAccesskeyID: "",
        awsSecretAccessKey: "",
        awsRegion: ""
    };
    ```
6. Create `textractUtils.js`


## Testing
node index.js scan /path-to-your-file/form-example.png

## Pdf for testing
[test.pdf](https://github.com/user-attachments/files/15816537/test.pdf)

## Output
[output.txt](https://github.com/user-attachments/files/15816695/output.txt)

