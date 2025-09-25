import {
  Button,
  ContextMenu,
  DateTimePicker,
  Host,
  HStack,
  List,
  Picker,
  Switch,
  VStack,
} from '@expo/ui/swift-ui'
import { frame } from '@expo/ui/swift-ui/modifiers'
import {
  type FilterForSamples,
  queryQuantitySamplesWithAnchor,
} from '@kingstinct/react-native-healthkit'
import { QuantityTypes } from '@kingstinct/react-native-healthkit/modules'
import type { QuantitySample } from '@kingstinct/react-native-healthkit/types/QuantitySample'
import type { QuantityTypeIdentifier } from '@kingstinct/react-native-healthkit/types/QuantityTypeIdentifier'
import { useCallback, useEffect, useState } from 'react'
import { View } from 'react-native'
import { QueryInfo } from '@/components/QueryInfo'
import { ListItem } from '@/components/SwiftListItem'
import { AllQuantityTypeIdentifierInApp } from '@/constants/AllUsedIdentifiersInApp'

const transformQuantityIdentifierToName = (
  identifier: QuantityTypeIdentifier,
) => {
  return identifier
    .replace('HKQuantityTypeIdentifier', '')
    .replace(/([A-Z])/g, ' $1')
    .trim()
}

const PICKER_OPTIONS: ['Descending', 'Ascending', 'Anchor'] = [
  'Descending',
  'Ascending',
  'Anchor',
]

export default function QuantitiesScreen() {
  const [quantitySamples, setQuantitySamples] = useState<
    readonly QuantitySample[]
  >([])

  console.log('samples', JSON.stringify(quantitySamples, null, 2))

  const [fromDate, setFromDate] = useState<Date>(
    new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * 6),
  )
  const [toDate, setToDate] = useState<Date>(new Date())
  const [includeUserEntered, setIncludeUserEntered] = useState(true)

  const [selectedQuantityType, setSelectedQuantityType] =
    useState<QuantityTypeIdentifier>(
      'HKQuantityTypeIdentifierActiveEnergyBurned',
    )

  const [selectedOption, setSelectedOption] =
    useState<(typeof PICKER_OPTIONS)[number]>('Descending')

  const [anchor, setAnchor] = useState<string | undefined>(undefined)

  const [queryTime, setQueryTime] = useState<number>()

  const queryQuantitySamples = useCallback(async () => {
    const startedAt = Date.now()
    if (selectedOption === 'Anchor') {
      queryQuantitySamplesWithAnchor(selectedQuantityType, {
        filter: {
          startDate: fromDate,
          endDate: toDate,
        },
        anchor: anchor,
      })
        .then((result) => {
          setQuantitySamples(result.samples)
          setAnchor(result.newAnchor)
          setQueryTime(Date.now() - startedAt)
        })
        .catch((error) => {
          console.error('Error querying quantity samples with anchor:', error)
        })
    } else {
      setAnchor(undefined)

      const userEnteredFilters: FilterForSamples =
        includeUserEntered === false
          ? {
              withMetadataKey: 'HKWasUserEntered',
              operatorType: 'notEqualTo',
              value: true,
            }
          : {}

      const samples = await QuantityTypes.queryQuantitySamples(
        selectedQuantityType,
        {
          filter: {
            startDate: fromDate,
            endDate: toDate,
            ...userEnteredFilters,
          },
          ascending: selectedOption === 'Ascending',
        },
      )
      setQueryTime(Date.now() - startedAt)

      setQuantitySamples(samples)
    }
  }, [
    selectedQuantityType,
    selectedOption,
    fromDate,
    toDate,
    anchor,
    includeUserEntered,
  ])

  useEffect(() => {
    queryQuantitySamples()
  }, [queryQuantitySamples])

  return (
    <View style={{ flex: 1 }}>
      <Host style={{ marginHorizontal: 16, marginTop: 16, flex: 1 }}>
        <VStack
          spacing={16}
          modifiers={[frame({ height: 200, width: 200, alignment: 'center' })]}
        >
          <DateTimePicker
            onDateSelected={(date) => {
              setFromDate(date)
            }}
            displayedComponents="dateAndTime"
            initialDate={fromDate.toISOString()}
            modifiers={[frame({ height: 100 })]}
            variant="automatic"
            title="From"
          />
          <DateTimePicker
            onDateSelected={(date) => {
              setToDate(date)
            }}
            displayedComponents="dateAndTime"
            initialDate={toDate.toISOString()}
            variant="automatic"
            title="To"
          />
        </VStack>
        <VStack>
          <Picker
            options={PICKER_OPTIONS}
            selectedIndex={PICKER_OPTIONS.indexOf(selectedOption)}
            onOptionSelected={({ nativeEvent: { index } }) => {
              // biome-ignore lint/style/noNonNullAssertion: index is always valid
              setSelectedOption(PICKER_OPTIONS[index]!)
            }}
            variant="segmented"
          />

          <QueryInfo
            queryTime={queryTime}
            anchor={anchor}
            onFetchMore={queryQuantitySamples}
          />
          <ContextMenu>
            <ContextMenu.Items>
              {AllQuantityTypeIdentifierInApp.map((quantityType) => (
                <Button
                  key={quantityType}
                  variant="bordered"
                  systemImage={
                    quantityType === selectedQuantityType
                      ? 'checkmark.circle'
                      : undefined
                  }
                  onPress={() => {
                    setSelectedQuantityType(quantityType)
                  }}
                >
                  {transformQuantityIdentifierToName(quantityType)}
                </Button>
              ))}
            </ContextMenu.Items>
            <ContextMenu.Trigger>
              <Button variant="bordered">
                {transformQuantityIdentifierToName(selectedQuantityType)}
              </Button>
            </ContextMenu.Trigger>
          </ContextMenu>

          <Switch
            value={includeUserEntered}
            onValueChange={setIncludeUserEntered}
            label="Include user entered"
            variant="switch"
          />
        </VStack>

        <VStack>
          <List scrollEnabled>
            {quantitySamples.map((item) => {
              const quantityStr = item.quantity
                ? `${Math.round(item.quantity * 100) / 100} ${item.unit}`
                : 'Unknown Quantity'
              console.log('quantityStr', quantityStr)
              return (
                <ListItem
                  key={item.uuid}
                  title={quantityStr}
                  subtitle={item.startDate.toLocaleString()}
                />
              )
            })}
            <View style={{ height: 100 }} />
          </List>
        </VStack>
      </Host>
    </View>
  )
}
