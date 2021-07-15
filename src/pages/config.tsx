import React, { useContext } from 'react'
import { TwitchContext } from '../components/context/Twitch'

export default function Index() {
  const { twitch, config } = useContext(TwitchContext)
  console.info(twitch, config);
  return (
    <div>
      <h2>Config</h2>
    </div>
  )
}
