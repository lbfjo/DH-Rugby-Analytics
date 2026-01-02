14:24:52.307 Running build in Washington, D.C., USA (East) – iad1
14:24:52.307 Build machine configuration: 2 cores, 8 GB
14:24:52.448 Cloning github.com/lbfjo/DH-Rugby-Analytics (Branch: main, Commit: 488b7a1)
14:24:52.449 Previous build caches not available.
14:24:52.646 Cloning completed: 197.000ms
14:24:53.103 Running "vercel build"
14:24:53.526 Vercel CLI 50.1.3
14:24:53.866 Installing dependencies...
14:25:15.149 
14:25:15.149 added 439 packages in 21s
14:25:15.150 
14:25:15.150 153 packages are looking for funding
14:25:15.150   run `npm fund` for details
14:25:15.191 Detected Next.js version: 15.5.9
14:25:15.196 Running "npm run build"
14:25:15.299 
14:25:15.300 > rugby-dashboard@0.1.0 build
14:25:15.302 > next build
14:25:15.302 
14:25:16.028 Attention: Next.js now collects completely anonymous telemetry regarding usage.
14:25:16.029 This information is used to shape Next.js' roadmap and prioritize features.
14:25:16.030 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
14:25:16.030 https://nextjs.org/telemetry
14:25:16.030 
14:25:16.110    ▲ Next.js 15.5.9
14:25:16.111 
14:25:16.144    Creating an optimized production build ...
14:25:31.187  ✓ Compiled successfully in 12.7s
14:25:31.190    Linting and checking validity of types ...
14:25:35.666    Collecting page data ...
14:25:37.622    Generating static pages (0/7) ...
14:25:38.727    Generating static pages (1/7) 
14:25:38.728    Generating static pages (3/7) 
14:25:38.728    Generating static pages (5/7) 
14:25:38.745 Error occurred prerendering page "/teams". Read more: https://nextjs.org/docs/messages/prerender-error
14:25:38.745 Error [PrismaClientKnownRequestError]: 
14:25:38.746 Invalid `prisma.team.findMany()` invocation:
14:25:38.746 
14:25:38.746 
14:25:38.746 The table `main.Team` does not exist in the current database.
14:25:38.747     at async i (.next/server/app/teams/page.js:2:10753) {
14:25:38.747   code: 'P2021',
14:25:38.747   meta: [Object],
14:25:38.747   clientVersion: '6.19.1',
14:25:38.747   digest: '1492897041'
14:25:38.747 }
14:25:38.747 Export encountered an error on /teams/page: /teams, exiting the build.
14:25:38.752  ⨯ Next.js build worker exited with code: 1 and signal: null
14:25:38.792 Error: Command "npm run build" exited with 1