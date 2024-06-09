const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const uploadFile = async (filePath) => {
  const form = new FormData();

  form.append('operations', JSON.stringify({
    query: `mutation ($file: Upload!) {
      uploadAnimation(
        id: "123",
        title: "Test",
        description: "Test Description",
        tags: ["tag1", "tag2"],
        file: $file
      ) {
        id
        title
        url
      }
    }`,
    variables: {
      file: null
    }
  }));
  
  form.append('map', JSON.stringify({
    '0': ['variables.file']
  }));
  
  form.append('0', fs.createReadStream(filePath));

  try {
    const response = await axios.post('http://localhost:4000/graphql', form, {
      headers: {
        ...form.getHeaders()
      }
    });
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

const filePath = path.join(__dirname, 'animation.json');
console.log(filePath);
uploadFile(filePath);
