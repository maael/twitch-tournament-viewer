import * as React from 'react'
import { TwitchContext } from '../components/context/Twitch'
import { getEvent } from '../util/getEvent'

export default function Index() {
  const { twitch, config: config } = React.useContext(TwitchContext)
  const [tournamentData, setTournamentData] = React.useState<any>()
  const [link, setLink] = React.useState(() => config?.broadcaster?.link || '')
  React.useEffect(() => {
    if (config?.broadcaster?.link) {
      setLink(config?.broadcaster?.link)
    }
  }, [config?.broadcaster?.link])
  const [saved, setSaved] = React.useState(false)
  return (
    <div>
      <h2>Config</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const link = (e.currentTarget.elements as any).eventLink.value.trim()
          const data = await getEvent(link)
          setTournamentData(data)
          setLink(link)
        }}
      >
        <div>
          <input type="text" placeholder="Event link..." name="eventLink" defaultValue={link} />
          <button type="submit">Fetch Brackets</button>
        </div>
        <small>
          Please enter a link to an event or bracket on <a href="https://smash.gg">https://smash.gg</a>
        </small>
      </form>
      <h1>Tournament: {tournamentData?.name || 'Please fetch brackets'}</h1>
      <h2>Event: {tournamentData?.event?.name || 'Please fetch brackets'}</h2>
      <form
        onSubmit={(e) => {
          setSaved(false)
          e.preventDefault()
          const phase = (e.currentTarget.elements as any).phase.value
          twitch.configuration.set('broadcaster', '1.0', JSON.stringify({ phase, link }))
          twitch?.rig.log('saved', { phase, link })
          setSaved(true)
        }}
      >
        {tournamentData?.event?.phases ? (
          <div style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center' }}>
            Choose the default phase to show:
            <select name="phase" className="select-css">
              {(tournamentData?.event?.phases || []).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        <div style={{ marginBottom: '0.5em' }}>
          <small>To see changes, you'll need to refresh the page after saving.</small>
        </div>
        <button disabled={!tournamentData?.event?.phases} type="submit">
          Save Config
        </button>
        <div>
          {saved ? (
            <div
              style={{
                border: '1px solid darkgreen',
                background: 'lightgreen',
                color: 'darkgreen',
                padding: '0.5em 2em',
                borderRadius: '0.4em',
                margin: '0.5em 0',
                display: 'inline-block',
              }}
            >
              Saved! Refresh to see the changes.
            </div>
          ) : null}
        </div>
      </form>
    </div>
  )
}
