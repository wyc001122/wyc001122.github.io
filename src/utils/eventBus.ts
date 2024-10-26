import mitt from 'mitt'

interface MittTypes {
  [key: string | symbol]: any
  'global-search-toggle'?: 'menu' | 'tab'
}

export const TAKE_SCREEN_SHOT = 'TAKE_SCREEN_SHOT'

export default mitt<MittTypes>()
