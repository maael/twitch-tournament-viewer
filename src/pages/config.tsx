import * as React from 'react'
import { TwitchContext } from '../components/context/Twitch'
import useClient from '../components/hooks/useClient'
import { getEvent } from '../util/getEvent'

export default function Index() {
  const { twitch, config, setConfig } = React.useContext(TwitchContext)
  const [tournamentData, setTournamentData] = React.useState<any>()
  const [saved, setSaved] = React.useState(false)
  const client = useClient(config?.broadcaster?.apiKey || '')
  return (
    <div>
      <h2>Config</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const apiKey = (e.currentTarget.elements as any).apiKey.value.trim()
          setConfig((c) => ({ ...c, apiKey }))
        }}
        style={{ marginBottom: '1em' }}
      >
        <div>
          <input
            style={{ padding: '0.1em 0.5em', marginRight: '0.5em', borderRadius: '0.3em' }}
            type="text"
            placeholder="API Key..."
            name="apiKey"
            defaultValue={config?.broadcaster?.apiKey || ''}
          />
          <button type="submit">Save</button>
        </div>
        <small>
          Get an API key from the{' '}
          <a
            style={{ textDecoration: 'underline', color: '#008ce0' }}
            target="_blank"
            rel="noreferrer"
            href="https://smash.gg/admin/profile/developer"
          >
            Developer Settings
          </a>
        </small>
      </form>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const link = (e.currentTarget.elements as any).link.value.trim()
          const data = await getEvent(client, link)
          setTournamentData(data)
          setConfig((c) => ({ ...c, link }))
        }}
      >
        <div>
          <input
            style={{ padding: '0.1em 0.5em', marginRight: '0.5em', borderRadius: '0.3em' }}
            type="text"
            placeholder="Event link..."
            name="link"
            defaultValue={config?.broadcaster?.link}
          />
          <button disabled={!config?.broadcaster?.apiKey} type="submit">
            Fetch Brackets
          </button>
        </div>
        <small>
          Please enter a link to an event or bracket on{' '}
          <a
            style={{ textDecoration: 'underline', color: '#008ce0' }}
            target="_blank"
            rel="noreferrer"
            href="https://smash.gg"
          >
            https://smash.gg
          </a>
        </small>
      </form>
      <h1>Tournament: {tournamentData?.name || 'Please fetch brackets'}</h1>
      <h2>Event: {tournamentData?.event?.name || 'Please fetch brackets'}</h2>
      <form
        onSubmit={(e) => {
          setSaved(false)
          e.preventDefault()
          const phase = (e.currentTarget.elements as any).phase.value
          setConfig((c) => ({ ...c, phase }))
          twitch?.rig.log('saved', { ...config?.broadcaster, phase })
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
