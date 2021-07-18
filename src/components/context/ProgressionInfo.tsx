import * as React from 'react'
import useProgressionInfo from '../hooks/useProgressionInfo'

export const ProgressionInfoContext = React.createContext<any[]>([])

export const ProgressionInfoProvider: React.FC<{ progressionSeeds?: number[] }> = ({ progressionSeeds, children }) => {
  const progData = useProgressionInfo(progressionSeeds)
  return <ProgressionInfoContext.Provider value={progData}>{children}</ProgressionInfoContext.Provider>
}
