import { SET_ACTIVE_ACCOUNT } from "../Actions/activeAccount";

export default function activeAccount(state = {}, action) {
  switch (action.type) {
    case SET_ACTIVE_ACCOUNT:
      return {
        account: action.account
      };
    default:
      return state;
  }
}
