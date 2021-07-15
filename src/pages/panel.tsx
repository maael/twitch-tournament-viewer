import React, { useContext } from 'react'
import { TwitchContext } from '../components/context/Twitch';

export default function Index() {
  const { config } = useContext(TwitchContext)
  console.info(config);
  return (
    <div>
      <h2>Panel</h2>
    </div>
  )
}
