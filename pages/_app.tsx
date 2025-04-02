import { AppProps } from 'next/app';
import { AppThemeProvider } from '@/theme/theme';
import '@/styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppThemeProvider>
      <Component {...pageProps} />
    </AppThemeProvider>
  );
}

export default MyApp;