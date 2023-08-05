export const JUDGE_STATUS = {
  '0': {
    name: 'Pending',
    short: 'AC',
    color: 'yellow',
    type: 'warning'
  },
  '1': {
    name: 'Judging',
    short: 'Jg',
    color: 'yellow',
    type: 'warning'
  },
  '2': {
    name: 'System Error',
    short: 'SE',
    color: 'red',
    type: 'error'
  },
  '3': {
    name: 'ALL PASSED',
    short: 'AP',
    color: 'blue',
    type: 'info'
  },
  '4': {
    name: 'SOME PASSED',
    short: 'SP',
    color: 'yellow',
    type: 'warning'
  },
  '5': {
    name: 'ALL FAILED',
    short: 'AF',
    color: 'red',
    type: 'error'
  },
  '6': {
    name: 'PROGRAM TIMEOUT',
    short: 'TM',
    color: 'red',
    type: 'error'
  }
}

export const CONTEST_STATUS = {
  'NOT_START': '1',
  'UNDERWAY': '0',
  'ENDED': '-1'
}

export const CONTEST_STATUS_REVERSE = {
  '1': {
    name: 'Not Started',
    color: 'yellow'
  },
  '0': {
    name: 'Underway',
    color: 'green'
  },
  '-1': {
    name: 'Ended',
    color: 'red'
  }
}

export const RULE_TYPE = {
  ACM: 'ACM',
  OI: 'OI'
}

export const CONTEST_TYPE = {
  PUBLIC: 'Public',
  PRIVATE: 'Password Protected'
}

export const USER_TYPE = {
  REGULAR_USER: 'Regular User',
  ADMIN: 'Admin',
  SUPER_ADMIN: 'Super Admin'
}

export const PROBLEM_PERMISSION = {
  NONE: 'None',
  OWN: 'Own',
  ALL: 'All'
}

export const STORAGE_KEY = {
  AUTHED: 'authed',
  PROBLEM_CODE: 'problemCode',
  languages: 'languages'
}

export function buildProblemCodeKey (problemID, contestID = null) {
  if (contestID) {
    return `${STORAGE_KEY.PROBLEM_CODE}_${contestID}_${problemID}`
  }
  return `${STORAGE_KEY.PROBLEM_CODE}_NaN_${problemID}`
}

export const GOOGLE_ANALYTICS_ID = 'UA-111499601-1'
