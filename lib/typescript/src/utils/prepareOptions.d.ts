import type { GenericQueryOptions } from '../types';
declare const prepareOptions: (options: GenericQueryOptions) => {
    limit: number;
    ascending: boolean;
    from: string;
    to: string;
    anchor: string;
};
export default prepareOptions;
