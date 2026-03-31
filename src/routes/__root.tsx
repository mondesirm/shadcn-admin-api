import { type QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  // HeadContent,
  Outlet,
  // Scripts,
} from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from '@/components/ui/sonner'
import { NavigationProgress } from '@/components/navigation-progress'
import { GeneralError } from '@/features/errors/general-error'
import { NotFoundError } from '@/features/errors/not-found-error'

type RouteContextProps = {
  queryClient: QueryClient
  getTitle?: () => string
  getDescription?: () => string
}

export const Route = createRootRouteWithContext<RouteContextProps>()({
  // TODO https://tanstack.com/start/latest/docs/framework/react/migrate-from-next-js
  // head: () => ({
  //   meta: [
  //     { charSet: 'utf-8' },
  //     {
  //       name: 'viewport',
  //       content: 'width=device-width, initial-scale=1',
  //     },
  //     { title: 'TanStack Start Starter' },
  //   ],
  // }),
  component: () => {
    return (
      <>
        <NavigationProgress />
        <Outlet />
        <Toaster duration={5000} closeButton />

        {import.meta.env.MODE === 'development' && (
          <>
            <ReactQueryDevtools buttonPosition='bottom-left' />
            <TanStackRouterDevtools position='bottom-right' />
          </>
        )}
      </>
    )
  },
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
})

// TODO https://tanstack.com/start/latest/docs/framework/react/migrate-from-next-js
// export function RootLayout() {
//   return (
//     <html lang='en'>
//       <head>
//         <HeadContent />
//       </head>
//       <body>
//         <Outlet />
//         <NavigationProgress />
//         <Toaster duration={5000} closeButton />
//         <Scripts />

//         {import.meta.env.MODE === 'development' && (
//           <>
//             <ReactQueryDevtools buttonPosition='bottom-left' />
//             <TanStackRouterDevtools position='bottom-right' />
//           </>
//         )}
//       </body>
//     </html>
//   )
// }
