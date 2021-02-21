export const SET_ACTIVE_ACCOUNT = 'SET_ACTIVE_ACCOUNT'

// TO-DO: change for a dynamic assessment of Factory Owner

export function setActiveAccount (account) {
  return {
    type: SET_ACTIVE_ACCOUNT,
    account,
  }
}