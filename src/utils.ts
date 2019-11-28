import { Stream } from 'stream';

export const asyncMiddleware = fn => (req, res, next) => {
  Promise
    .resolve(fn(req, res, next))
    .catch(next);
};


export const streamToBuffer = (stream: Stream) => {
  return new Promise<Buffer>((resolve, reject) => {
    let buffers = [];
    stream.on('error', reject);
    stream.on('data', (data) => buffers.push(data))
    stream.on('end', () => resolve(Buffer.concat(buffers)))
  });
}

export class SafeMap<T, U> extends Map<T, U> {
  _get: (<T>(key: T) => U) = Map.prototype.get
  get = (key: T) => {
    const res = this._get(key);
    if (!res) throw new Error(`${key} not found`);
    return res;
  }
}
