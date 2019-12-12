import { JSEncrypt } from 'jsencrypt'

import { rsaPubKey } from '../config'

export const rsaEncrypt = (key: string) => {
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(rsaPubKey)
  return encrypt.encrypt(key)
}
