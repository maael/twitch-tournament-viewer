import React, { useEffect, useState, createContext } from 'react'

interface TwitchAuth {
  channelId: string
  clientId: string
  token: string
  userId: string
}

interface TwitchContext {
  game: string
  isVideoAdShowing: boolean
  language: string
  mode: string
  playbackMode: string
  theme: 'dark' | 'light'
}

export const TwitchContext = createContext<{
  ctx: Partial<TwitchContext>
  auth: Partial<TwitchAuth>
  config: { broadcaster: any }
  twitch?: any
}>({ ctx: {}, auth: {}, config: { broadcaster: {} } })

const TwitchContextWrapper: React.FC = ({ children }) => {
  const [ctx, setCtx] = useState<Partial<TwitchContext>>({})
  const [auth, setAuth] = useState<Partial<TwitchAuth>>({})
  const [config, setConfig] = useState({ broadcaster: {} })
  const [twitch, setTwitch] = useState()
  useEffect(() => {
    const twitch = (window as any).Twitch.ext
    if (!twitch) return
    setTwitch((window as any).Twitch.ext)
    console.info('loading', twitch.configuration)
    setConfig({ broadcaster: JSON.parse(twitch.configuration.broadcaster?.content || '{"phase":"966950"}') })
    twitch.configuration.onChanged((_e) => {
      setConfig({ broadcaster: JSON.parse(twitch.configuration.broadcaster?.content || '{"phase":"966950"}') })
    })
    twitch.onAuthorized((e: TwitchAuth) => {
      setAuth(e)
      if (!twitch.configuration.broadcaster) {
        twitch.configuration.set('broadcaster', '1.0', '{"phase":"966950"}')
      }
    })
    twitch.onContext((e: TwitchContext) => {
      document.body.classList.toggle('dark', e.theme === 'dark')
      setCtx(e)
    })
  }, [])
  return <TwitchContext.Provider value={{ ctx, auth, config, twitch }}>{children}</TwitchContext.Provider>
}

export default TwitchContextWrapper
