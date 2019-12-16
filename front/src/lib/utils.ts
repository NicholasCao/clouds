import { JSEncrypt } from 'jsencrypt'

import { rsaPubKey } from '../config'

export function rsaEncrypt (key: string) {
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(rsaPubKey)
  return encrypt.encrypt(key)
}

function pad(n: number) {
  return n < 10 ? `0${n}` : n
}

export function formatDate(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}
