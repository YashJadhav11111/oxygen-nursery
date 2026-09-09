import type { DataProvider } from './dataProvider';
import LocalDataProvider from './localProvider';

/**
 * ===========================================================================
 * THE ONE LINE TO CHANGE WHEN THE BACKEND IS READY
 * ===========================================================================
 * Today:   export const provider = new LocalDataProvider();
 * Later:   export const provider = new ApiDataProvider(import.meta.env.VITE_API_URL);
 *
 * Nothing else in the application needs to be touched.
 * ===========================================================================
 */
export const provider: DataProvider = new LocalDataProvider();

export const isDemoData = provider.name === 'local-demo';
