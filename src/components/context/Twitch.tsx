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

const defaultConfig =
  '{"phase":"204945","link":"https://smash.gg/tournament/evo-2018/event/evo-2018-1/brackets/329220/663128?fbclid=IwAR0CXWoeO0InfeoOpFnG8mf0M0H0HhTCo5_MQT4x3z01JF2_PAU3pr1Ki_8"}'

const TwitchContextWrapper: React.FC = ({ children }) => {
  const [ctx, setCtx] = useState<Partial<TwitchContext>>({})
  const [auth, setAuth] = useState<Partial<TwitchAuth>>({})
  const [config, setConfig] = useState({ broadcaster: {} })
  const [twitch, setTwitch] = useState()
  useEffect(() => {
    const twitch = (window as any).Twitch.ext
    if (!twitch) return
    setTwitch((window as any).Twitch.ext)
    setConfig({ broadcaster: JSON.parse(twitch.configuration.broadcaster?.content || defaultConfig) })
    twitch.configuration.onChanged((_e) => {
      setConfig({ broadcaster: JSON.parse(twitch.configuration.broadcaster?.content || defaultConfig) })
    })
    twitch.onAuthorized((e: TwitchAuth) => {
      setAuth(e)
      if (!twitch.configuration.broadcaster) {
        twitch.configuration.set('broadcaster', '1.0', defaultConfig)
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
