const { chain } = require("stream-chain");
const { Writable, Transform } = require("stream");
const path = require("path");
const fs = require("fs");
const Batch = require("stream-json/utils/Batch");
const { parser } = require("stream-json");

let counter = 0;
let collectors = {};

const typedWriter = (type) => (data) => {
  const filePath = path.resolve(__dirname, `../preparedData/data.${type}.${++counter}.json`);
  console.info(`>> ${filePath}`);
  const content = JSON.stringify(data, null, 2);
  fs.writeFile(filePath, content, "utf8", (err) => {
    console.error(err);
  });
};

const getCollector = (type) => {
  return collectors[type] || (collectors[type] = chain([new Batch({ batchSize: 10000 }), typedWriter(type)]));
};

class StreamValues2 extends Transform {
  constructor(options) {
    super(
      Object.assign({}, options, {
        writableObjectMode: true,
        readableObjectMode: true,
      })
    );
    this.collection = null;
    this.stack = [];
  }

  get current() {
    return this.stack[0];
  }

  _transform({ name, value }, encoding, callback) {
    this[name]?.(value);
    callback(null);
  }

  assignValue(r) {
    if (this.index && this.current === this.index) {
      this.current.push(r);
    } else if (this.current) {
      if (r) {
        this.current[this.key] = r;
      }
    }
  }

  startObject() {
    if (this.collection) {
      const r = {};
      this.assignValue(r);
      this.stack.unshift(r);
    }
  }

  endObject() {
    if (this.collection) {
      const value = this.stack.shift();

      if (!this.current) {
        // console.info(value, this.current)
        this.push({ collection: this.collection, value });
      }
      this.key = null;
    }
  }

  startArray() {
    if (this.current) {
      const r = [];
      this.assignValue(r);
      this.stack.unshift(r);
      this.index = r;
    }
  }
  endArray() {
    if (this.current) {
      this.index = null;
      this.stack.shift();
    } else {
      this.collection = null;
    }
  }

  keyValue(val) {
    if (this.collection) {
      this.key = val;
    } else {
      this.collection = val;
    }
  }

  numberValue(val) {
    this.assignValue(parseFloat(val));
  }
  stringValue(val) {
    this.assignValue(val);
  }
  trueValue(val) {
    this.assignValue(val);
  }
}

function main() {
  const fileStream = fs.createReadStream(path.resolve(__dirname, "../data/data.json"));

  const workChain = chain([
    fileStream,
    parser({ streamValues: false }),
    new StreamValues2(),
    new Writable({
      write({ collection, value }, encoding, callback) {
        // console.info(collection, value)
        getCollector(collection).write(value, encoding, callback);
      },
      objectMode: true,
    }),
  ]);

  workChain.on("error", (err) => console.error("ERROR", err));
}

main();
