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
