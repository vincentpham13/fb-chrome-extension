const File = {
  readImage: (file) => {
    // Check if the file is an image.
    if (file.type && file.type.indexOf("image") === -1) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    return new Promise((resolve, reject) => {
      reader.onload = (event) => {
        resolve(event.target.result);
      };
    })
  },
}

export default File;
