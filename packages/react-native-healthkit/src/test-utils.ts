import { act } from '@testing-library/react-native'

const waitForNextUpdate = async () => {
  await act(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 0)
    })
  })
}

export default waitForNextUpdate
