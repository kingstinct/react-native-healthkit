import { Button, HStack, Text } from '@expo/ui/swift-ui'

export const QueryInfo = ({
  queryTime,
  anchor,
  deletedSamples,
  onFetchMore,
}: {
  onFetchMore?: () => void
  queryTime?: number
  anchor?: string
  deletedSamples?: readonly string[]
}) => {
  return (
    <HStack spacing={8}>
      <Text>{queryTime ? `Query time: ${queryTime}ms` : 'Loading...'}</Text>
      {deletedSamples && deletedSamples.length > 0 ? (
        <Text>{`Deleted samples: ${deletedSamples?.length}`}</Text>
      ) : null}
      {anchor ? <Text>{`Anchor: ${anchor.substring(0, 20)}...`}</Text> : null}
      <Button onPress={onFetchMore} variant="borderedProminent">
        Fetch More
      </Button>
    </HStack>
  )
}
