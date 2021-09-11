import { getStrmToken } from './common/strm';

export default function bootstrap(callback: Function): void {
    const promises = [
        getStrmToken() // Make sure Strm token is received before we open API routes
    ];
    Promise.all(promises).then(() => {
        callback();
    });
};