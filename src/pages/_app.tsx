import Head from 'next/head'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import useFathom from '../components/hooks/useFathom'
import TwitchContext from '../components/context/Twitch'
import ErrorBoundary from '../components/primitives/ErrorBoundary'
import { VERSION } from '../util/constants'
import '../../output/styles.css'

try {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
    release: VERSION,
    environment: 'local',
  })
} catch (e) {
  console.error('[sentry]', e)
}

function App({ Component, pageProps }) {
  useFathom()
  return (
    <TwitchContext>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#fd015d" />
      </Head>
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
      <script src="https://extension-files.twitch.tv/helper/v1/twitch-ext.min.js"></script>
    </TwitchContext>
  )
}

export default Sentry.withProfiler(App)
