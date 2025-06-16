import { Button } from '@expo/ui/swift-ui'
import { HStack, Host, Text } from '@expo/ui/swift-ui-primitives'
import { Pressable, View } from 'react-native'
import { Spacer } from './Spacer'
import { ThemedText } from './ThemedText'

export type ListItemProps = {
  title: string
  subtitle?: string
  onPress?: () => void
}

export const ListItem = ({ title, subtitle, onPress }: ListItemProps) => (
  <HStack>
    <Text>{title}</Text>
    {onPress ? <Button onPress={onPress}> </Button> : <Spacer />}
    {subtitle && (
      <Text size={12} weight="light" design="monospaced">
        {subtitle}
      </Text>
    )}
  </HStack>
)

export const ListItemAdvanced = ({
  title,
  subtitle,
  onPress,
}: ListItemProps) => (
  <Pressable onPress={onPress} style={{ flex: 1 }}>
    <View
      style={{
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: 'red',
      }}
    >
      <ThemedText>{title}</ThemedText>
      <ThemedText>{subtitle}</ThemedText>
    </View>
  </Pressable>
)
