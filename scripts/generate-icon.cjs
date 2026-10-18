const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

function create256Png() {
  const width = 256;
  const height = 256;
  
  // RGBA buffer (4 bytes per pixel) + 1 filter byte per scanline
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(rowSize * height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = 108;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        // Outer gold circle ring or dark velvet inner
        if (dist > radius - 14) {
          // Gold rim
          rawData[pxOffset] = 242;     // R
          rawData[pxOffset + 1] = 193; // G
          rawData[pxOffset + 2] = 78;  // B
          rawData[pxOffset + 3] = 255; // A
        } else {
          // Dark obsidian center with cute gold diamond
          const isDiamond = Math.abs(dx) + Math.abs(dy) < 56;
          if (isDiamond) {
            rawData[pxOffset] = 255;
            rawData[pxOffset + 1] = 233;
            rawData[pxOffset + 2] = 173;
            rawData[pxOffset + 3] = 255;
          } else {
            rawData[pxOffset] = 11;
            rawData[pxOffset + 1] = 8;
            rawData[pxOffset + 2] = 18;
            rawData[pxOffset + 3] = 255;
          }
        }
      } else {
        // Transparent outside
        rawData[pxOffset] = 0;
        rawData[pxOffset + 1] = 0;
        rawData[pxOffset + 2] = 0;
        rawData[pxOffset + 3] = 0;
      }
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  const ihdrChunk = makeChunk('IHDR', ihdr);

  // IDAT Chunk
  const idatChunk = makeChunk('IDAT', compressed);

  // IEND Chunk
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  const png = Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
  fs.writeFileSync(path.join(__dirname, '../public/icon.png'), png);
  console.log('Successfully generated 256x256 public/icon.png!');
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crc = calcCrc(chunk.subarray(4, 8 + len));
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

// CRC32 table & calculation
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function calcCrc(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

create256Png();
