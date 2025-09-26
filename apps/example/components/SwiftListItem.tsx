import { Button, HStack, Text } from '@expo/ui/swift-ui'
import { frame, padding } from '@expo/ui/swift-ui/modifiers'
import { Pressable, View } from 'react-native'
import { ThemedText } from './ThemedText'

export type ListItemProps = {
  title: string
  subtitle?: string
  onPress?: () => void
}

export const ListItem = ({ title, subtitle, onPress }: ListItemProps) => (
  <HStack>
    <Text modifiers={[frame({ minWidth: 0 }), padding({ trailing: 6 })]}>
      {title}
    </Text>
    {onPress ? <Button onPress={onPress}> </Button> : null}
    {subtitle && (
      <Text
        size={12}
        weight="light"
        design="monospaced"
        modifiers={[frame({ maxWidth: Infinity, alignment: 'trailing' })]}
      >
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
