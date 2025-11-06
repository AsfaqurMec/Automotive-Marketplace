import { sessionStorage } from './secureStorage';

export function removeUserGlobally() {
  sessionStorage.removeUserStatus();
}

