import { makeApiHandler } from '@keystatic/astro/api';
import config from '../../../../keystatic.config';

export const all = makeApiHandler({ config });
export const prerender = false;
