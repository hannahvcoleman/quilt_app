// Wrapper for the Keystatic CMS React app.
// This component exists so that Astro 6's build pipeline can track
// the React dependency through the project's own file tree, ensuring
// the React renderer is registered in the server manifest and
// client:only="react" hydration scripts are emitted for the /keystatic route.
import { makePage } from '@keystatic/astro/ui';
import config from '../../keystatic.config';

const KeystaticApp = makePage(config);
export default KeystaticApp;
