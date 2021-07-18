export enum ActivityState {
  // Activity is created
  CREATED = 1,
  // Activity is active or in progress
  ACTIVE = 2,
  // Activity is done
  COMPLETED = 3,
  // Activity is ready to be started
  READY = 4,
  // Activity is invalid
  INVALID = 5,
  // Activity, like a set, has been called to start
  CALLED = 6,
  // Activity is queued to run
  QUEUED = 7,
}

export enum BracketType {
  SINGLE_ELIMINATION = 'SINGLE_ELIMINATION',
  DOUBLE_ELIMINATION = 'DOUBLE_ELIMINATION',
  ROUND_ROBIN = 'ROUND_ROBIN',
  SWISS = 'SWISS',
  EXHIBITION = 'EXHIBITION',
  CUSTOM_SCHEDULE = 'CUSTOM_SCHEDULE',
  MATCHMAKING = 'MATCHMAKING',
  ELIMINATION_ROUNDS = 'ELIMINATION_ROUNDS',
  RACE = 'RACE',
  CIRCUIT = 'CIRCUIT',
}
