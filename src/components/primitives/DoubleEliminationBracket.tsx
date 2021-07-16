import { Bracket, RoundProps } from 'react-brackets'

const data: RoundProps[] = [
  {
    title: 'Round One',
    id: 2,
    seeds: [
      {
        id: 1,
        date: new Date().toDateString(),
        teams: [{ name: 'Team A' }, { name: 'Team B' }],
      },
      {
        id: 2,
        date: new Date().toDateString(),
        teams: [{ name: 'Team A' }, { name: 'Team B' }],
      },
    ],
  },
  {
    title: 'Round Two',
    seeds: [
      {
        id: 3,
        date: new Date().toDateString(),
        teams: [{ name: 'Team A' }, { name: 'Team B' }],
      },
    ],
  },
]

export default function DoubleEliminationBracket() {
  return <Bracket rounds={data} />
}
