import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useMatchRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'sapori',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  notFoundComponent: () => <p>Page not found.</p>,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const matchRoute = useMatchRoute()
  const isExplore = Boolean(matchRoute({ to: '/', fuzzy: false }))

  return (
    <html
      lang="en"
      className={
        isExplore ? 'scrollbar-none h-dvh overflow-hidden' : 'scrollbar-none'
      }
    >
      <head>
        <HeadContent />
      </head>
      <body
        className={`min-h-dvh font-sans antialiased [wrap-anywhere] ${isExplore ? 'h-dvh overflow-hidden' : ''}`}
      >
        {children}
        <TanStackDevtools
          config={{
            triggerHidden: true,
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
