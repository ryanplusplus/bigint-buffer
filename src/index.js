let converter;

/**
 * Convert a little-endian buffer into a BigInt.
 * @param buf The little-endian buffer to convert
 * @returns A BigInt with the little-endian representation of buf.
 */
function toBigIntLE(buf) {
  // Add input validation to prevent buffer overflow
  if(!buf || !(buf instanceof Buffer)) {
    return BigInt(0);
  }

  if(process.browser || converter === undefined) {
    const reversed = Buffer.from(buf);
    reversed.reverse();
    const hex = reversed.toString('hex');
    if(hex.length === 0) {
      return BigInt(0);
    }
    return BigInt(`0x${hex}`);
  }
  return converter.toBigInt(buf, false);
}

/**
 * Convert a big-endian buffer into a BigInt
 * @param buf The big-endian buffer to convert.
 * @returns A BigInt with the big-endian representation of buf.
 */
function toBigIntBE(buf) {
  // Add input validation to prevent buffer overflow
  if(!buf || !(buf instanceof Buffer)) {
    return BigInt(0);
  }

  if(process.browser || converter === undefined) {
    const hex = buf.toString('hex');
    if(hex.length === 0) {
      return BigInt(0);
    }
    return BigInt(`0x${hex}`);
  }
  return converter.toBigInt(buf, true);
}

/**
 * Convert a BigInt to a little-endian buffer.
 * @param num   The BigInt to convert.
 * @param width The number of bytes that the resulting buffer should be.
 * @returns A little-endian buffer representation of num.
 */
function toBufferLE(num, width) {
  if(process.browser || converter === undefined) {
    const hex = num.toString(16);
    const buffer =
      Buffer.from(hex.padStart(width * 2, '0').slice(0, width * 2), 'hex');
    buffer.reverse();
    return buffer;
  }
  // Allocation is done here, since it is slower using napi in C
  return converter.fromBigInt(num, Buffer.allocUnsafe(width), false);
}

/**
 * Convert a BigInt to a big-endian buffer.
 * @param num   The BigInt to convert.
 * @param width The number of bytes that the resulting buffer should be.
 * @returns A big-endian buffer representation of num.
 */
function toBufferBE(num, width) {
  if(process.browser || converter === undefined) {
    const hex = num.toString(16);
    return Buffer.from(hex.padStart(width * 2, '0').slice(0, width * 2), 'hex');
  }
  return converter.fromBigInt(num, Buffer.allocUnsafe(width), true);
}

module.exports = { toBigIntLE, toBigIntBE, toBufferLE, toBufferBE };
