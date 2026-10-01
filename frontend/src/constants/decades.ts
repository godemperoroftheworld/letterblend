import { range } from 'lodash';

const DECADE_OPTIONS = range(1870, new Date().getFullYear(), 10).map((year) => `${year}s`);

export default DECADE_OPTIONS;
