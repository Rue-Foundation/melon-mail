const ipfsAPI = require('ipfs-api');
const concat = require('concat-stream');

let ipfsNode;

const ipfs = () => {
  if (!ipfsNode) {
    ipfsNode = ipfsAPI('46.101.79.241', '443');
  }
  return ipfsNode;
};

const uploadData = (data) => {
  const preparedData = new Buffer(JSON.stringify(data));

  return ipfs().files.add(preparedData);
};

const newThread = (mail) => {
  if (!mail.hash || !mail.size) {
    return false;
  }

  const thread = {
    Data: new Buffer(''),
    Links: [{
      ...mail,
      name: '0',
    }],
  };

  return ipfs().object.put(thread);
};

const replyToThread = (reply, threadHash) =>
  ipfs().object.get(threadHash)
    .then((thread) => {
      const parsedThread = thread.toJSON();
      const replyLink = {
        ...reply,
        multihash: reply.hash,
        name: parsedThread.links.length,
      };
      return ipfs().object.patch.addLink(threadHash, replyLink);
    });

const getThread = hash => ipfs().object.get(hash);

const getFile = hash => ipfs().files.get(hash);

const getFileStream = hash => ipfs().files.cat(hash);

const getFileContent = hash =>
  new Promise((resolve, reject) => {
    ipfs().files.cat(hash)
      .then(file => file.pipe(concat(data => resolve(new TextDecoder('utf-8').decode(data)))))
      .catch(err => reject(err));
  });

export default {
  uploadData,
  newThread,
  replyToThread,
  getThread,
  getFile,
  getFileStream,
  getFileContent,
};
