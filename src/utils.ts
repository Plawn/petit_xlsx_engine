import { Stream } from 'stream';
import { promisify } from 'util';
import fs from 'fs';
import { minioInfosType } from './types';
import YAML from 'js-yaml';
import {exec as _exec}  from 'child_process';

const readFileAsync = promisify(fs.readFile);
export const exec = promisify(_exec);

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

export const getConfig = async (filename: string) => {
  const content = await readFileAsync(filename, 'utf-8');
  const parsed = YAML.load(content);
  const minioInfos: minioInfosType = {
    endpoint: parsed['MINIO_HOST'],
    passkey: parsed['MINIO_PASS'],
    access_key: parsed['MINIO_KEY'],
  }
  return minioInfos;
}


export class SafeMap<T, U> extends Map<T, U> {
  _get: (<T>(key: T) => U) = Map.prototype.get
  get = (key: T) => {
    const res = this._get(key);
    if (!res) throw new Error(`${key} not found`);
    return res;
  }
}
