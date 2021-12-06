const deepClone = <T>(item: T): T => JSON.parse(JSON.stringify(item)) as T;
export default deepClone;
