import fetch from "node-fetch";

const API_KEY = "aSuperSecretKey";

const fetchOptions = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

export async function getFilesList(req, res) {
  try {
    const files = await getFiles();
    res.status(200).json({ files });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
}

async function getFiles(req, res) {
  try {
    const response = await fetch(
      "https://echo-serv.tbxnet.com/v1/secret/files",
      fetchOptions
    );
    const data = await response.json();

    return data.files;
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred");
  }
}

async function getFileData(fileName) {
  try {
    const response = await fetch(
      `https://echo-serv.tbxnet.com/v1/secret/file/${fileName}`,
       fetchOptions
    );
    const jsonResponse = await response.text();
    const lines = jsonResponse.split("\n");
    const formattedLines = lines.map((row) => row.split(",")).slice(1);

    const result = [];
    for (let elem of formattedLines) {
      if (
        elem.length === 4 &&
        elem.every((item) => item !== null && item !== "")
      ) {
        const numberStr = String(elem[2]).replace(/[^0-9]/g, ''); 
        const number = parseInt(numberStr);
        if (!isNaN(number)) {
          if (!result[elem[0]]) {
            result[elem[0]] = [];
          }
          const lineObj = {
            text: elem[1],
            number: numberStr,
            hex: elem[3],
          };
          result.push(lineObj);
        }
      }
    }
    return { file: fileName, lines:result };
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred");
  }
}


export async function getData(req, res) {
  try {
    const fileName = req.query.filename;

    const files = await getFiles();
    const allFilesData = await Promise.all(files.map(getFileData));

    let filteredFiles = allFilesData;

    if (fileName) {
      filteredFiles = allFilesData.filter(file => file.file === fileName);
    }

    if (filteredFiles.length === 0 && !fileName) {
      return res.status(500).json({ message: "No files found" });
    }

    return res.status(200).json(filteredFiles.length > 0 ? filteredFiles : allFilesData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
}
