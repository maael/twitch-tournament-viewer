import Head from 'next/head'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import useFathom from '../components/hooks/useFathom'
import TwitchContext from '../components/context/Twitch'
import ErrorBoundary from '../components/primitives/ErrorBoundary'
import { VERSION } from '../util/constants'
import 'react-tippy/dist/tippy.css'

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
      <style jsx global>{`
        :root {
          --breakpoint-mobile: 576px;
          --breakpoint-tablet: 768px;
          --breakpont-desktop: 992px;
          --desktop-only-display: none;
          --color-background: #ffffff;
        }

        @media screen and (min-width: 576px) {
          /* Mobile */
          :root {
            --mobile-only-display: block;
            --desktop-only-display: none;
          }
        }

        @media screen and (min-width: 992px) {
          /* Desktop */
          :root {
            --mobile-only-display: none;
            --desktop-only-display: block;
          }
        }

        body.dark {
          --color-background: #18181b;
          --color-text: #ffffff;
        }

        body {
          background-color: var(--color-background);
          color: var(--color-text);
          font-family: 'Open Sans', Arial, Helvetica, sans-serif;
          overflow: hidden;
        }

        /* Sane Reset Below */

        /* Box sizing rules */
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        /* Remove default padding */
        ul[class],
        ol[class] {
          padding: 0;
        }

        /* Remove default margin */
        body,
        h1,
        h2,
        h3,
        h4,
        p,
        ul[class],
        ol[class],
        li,
        figure,
        figcaption,
        blockquote,
        dl,
        dd {
          margin: 0;
        }

        /* Set core body defaults */
        body {
          min-height: 100vh;
          scroll-behavior: smooth;
          text-rendering: optimizeSpeed;
          line-height: 1.5;
        }

        /* Remove list styles on ul, ol elements with a class attribute */
        ul[class],
        ol[class] {
          list-style: none;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        /* A elements that don't have a class get default styles */
        a:not([class]) {
          text-decoration-skip-ink: auto;
        }

        /* Make images easier to work with */
        img {
          max-width: 100%;
          display: block;
        }

        /* Natural flow and rhythm in articles by default */
        article > * + * {
          margin-top: 1em;
        }

        /* Inherit fonts for inputs and buttons */
        input,
        button,
        textarea,
        select {
          font: inherit;
        }

        /* Remove all animations and transitions for people that prefer not to see them */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
      <script src="https://extension-files.twitch.tv/helper/v1/twitch-ext.min.js"></script>
    </TwitchContext>
  )
}

export default Sentry.withProfiler(App)
