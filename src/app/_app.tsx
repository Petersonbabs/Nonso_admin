import { PagesProgressBar as ProgressBar } from 'next-nprogress-bar';
import { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <ProgressBar
        height="4px"
        color="#f4533e"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
}
