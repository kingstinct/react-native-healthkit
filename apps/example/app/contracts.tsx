import {
  getRequestStatusForAuthorization,
  isHealthDataAvailable,
  requestAuthorization,
} from '@kingstinct/react-native-healthkit'
import { AuthorizationRequestStatus } from '@kingstinct/react-native-healthkit/types/Auth'
import { useLocalSearchParams } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import {
  AllObjectTypesInApp,
  AllSampleTypesInApp,
} from '@/constants/AllUsedIdentifiersInApp'
import { clearLaunchCommand } from '@/contracts/launchCommand'
import { writeContractReport } from '@/contracts/report'
import {
  contractScenarios,
  runAllContractScenarios,
} from '@/contracts/scenarios'
import { enumKeyLookup } from '@/utils/enumKeyLookup'

const requestStatusLookup = enumKeyLookup(AuthorizationRequestStatus)

type ScenarioState = {
  readonly ok: boolean
  readonly details: readonly string[]
  readonly payload?: unknown
} | null

function stringifyPayload(value: unknown) {
  return JSON.stringify(
    value,
    (_key, currentValue) =>
      currentValue instanceof Date ? currentValue.toISOString() : currentValue,
    2,
  )
}

export default function ContractsScreen() {
  const params = useLocalSearchParams<{
    autorun?: string
    scenario?: string
  }>()
  const [authStatus, setAuthStatus] =
    useState<AuthorizationRequestStatus | null>(null)
  const [results, setResults] = useState<Record<string, ScenarioState>>({})
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState<string>('')
  const [hasAutoRunStarted, setHasAutoRunStarted] = useState(false)
  const [hasAutoRequestStarted, setHasAutoRequestStarted] = useState(false)
  const wantsAutoRun =
    params.autorun === 'all' || typeof params.scenario === 'string'

  const refreshAuthStatus = useCallback(async () => {
    const status = await getRequestStatusForAuthorization({
      toRead: AllObjectTypesInApp,
      toShare: AllSampleTypesInApp,
    })
    setAuthStatus(status)
  }, [])

  useEffect(() => {
    void refreshAuthStatus()
  }, [refreshAuthStatus])

  const requestAuth = useCallback(async () => {
    await requestAuthorization({
      toRead: AllObjectTypesInApp,
      toShare: AllSampleTypesInApp,
    })
    await refreshAuthStatus()
  }, [refreshAuthStatus])

  const runScenario = useCallback(async (scenarioId: string) => {
    const scenario = contractScenarios.find((item) => item.id === scenarioId)
    if (!scenario) {
      return
    }

    setIsRunning(true)
    try {
      const result = await scenario.run()
      setResults((current) => ({
        ...current,
        [scenario.id]: {
          ok: result.ok,
          details: result.details,
          payload: result.payload,
        },
      }))
      setOutput(stringifyPayload(result))
      writeContractReport(result)
    } finally {
      setIsRunning(false)
    }
  }, [])

  const runAll = useCallback(async () => {
    setIsRunning(true)
    try {
      const allResults = await runAllContractScenarios()
      setResults(
        Object.fromEntries(
          allResults.map((result) => [
            result.id,
            {
              ok: result.ok,
              details: result.details,
              payload: result.payload,
            },
          ]),
        ),
      )
      setOutput(stringifyPayload(allResults))
      writeContractReport(allResults)
    } finally {
      setIsRunning(false)
    }
  }, [])

  useEffect(() => {
    if (wantsAutoRun) {
      clearLaunchCommand()
    }
  }, [wantsAutoRun])

  useEffect(() => {
    if (!wantsAutoRun) {
      return
    }
    if (authStatus !== AuthorizationRequestStatus.shouldRequest) {
      return
    }
    if (hasAutoRequestStarted) {
      return
    }

    setHasAutoRequestStarted(true)
    void requestAuth()
  }, [authStatus, hasAutoRequestStarted, requestAuth, wantsAutoRun])

  useEffect(() => {
    if (authStatus !== AuthorizationRequestStatus.unnecessary) {
      return
    }
    if (hasAutoRunStarted) {
      return
    }

    if (params.autorun === 'all') {
      setHasAutoRunStarted(true)
      void runAll()
      return
    }

    if (typeof params.scenario === 'string') {
      setHasAutoRunStarted(true)
      void runScenario(params.scenario)
    }
  }, [
    authStatus,
    hasAutoRunStarted,
    params.autorun,
    params.scenario,
    runAll,
    runScenario,
  ])

  const overallStatus = useMemo(() => {
    const values = Object.values(results)
    if (values.length === 0) {
      return 'Idle'
    }
    return values.every((value) => value?.ok) ? 'PASS' : 'FAIL'
  }, [results])

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      testID="contracts.screen"
    >
      <Text style={styles.title}>HealthKit Contracts</Text>
      <Text style={styles.subtitle}>
        Runtime smoke validation for the public JS API using the example app.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Environment</Text>
        <Text testID="contracts.healthDataAvailable">
          Health data available: {isHealthDataAvailable() ? 'YES' : 'NO'}
        </Text>
        <Text testID="contracts.authStatus">
          Auth status:{' '}
          {authStatus == null ? 'LOADING' : requestStatusLookup[authStatus]}
        </Text>
        <Pressable
          onPress={() => {
            void requestAuth()
          }}
          style={styles.button}
          testID="contracts.requestAuth"
        >
          <Text style={styles.buttonLabel}>Request Authorization</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Run</Text>
        <Pressable
          onPress={() => {
            void runAll()
          }}
          style={[styles.button, isRunning && styles.disabledButton]}
          disabled={isRunning}
          testID="contracts.runAll"
        >
          <Text style={styles.buttonLabel}>
            {isRunning ? 'Running…' : 'Run All'}
          </Text>
        </Pressable>
        <Text testID="contracts.overallStatus">Overall: {overallStatus}</Text>
      </View>

      {contractScenarios.map((scenario) => {
        const result = results[scenario.id]

        return (
          <View
            key={scenario.id}
            style={styles.card}
            testID={`contracts.scenario.${scenario.id}`}
          >
            <Text style={styles.cardTitle}>{scenario.title}</Text>
            <Text testID={`contracts.scenario.${scenario.id}.status`}>
              Status: {result == null ? 'Idle' : result.ok ? 'PASS' : 'FAIL'}
            </Text>
            {result?.details?.length ? (
              <Text style={styles.details}>{result.details.join('\n')}</Text>
            ) : null}
            <Pressable
              onPress={() => {
                void runScenario(scenario.id)
              }}
              style={[styles.button, isRunning && styles.disabledButton]}
              disabled={isRunning}
              testID={`contracts.scenario.${scenario.id}.run`}
            >
              <Text style={styles.buttonLabel}>Run</Text>
            </Pressable>
          </View>
        )
      })}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Output</Text>
        <Text selectable style={styles.output} testID="contracts.output">
          {output || 'No output yet.'}
        </Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 16,
    paddingBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: '#666',
    lineHeight: 20,
  },
  card: {
    gap: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  button: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#111',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonLabel: {
    color: '#fff',
    fontWeight: '600',
  },
  details: {
    color: '#444',
    lineHeight: 20,
  },
  output: {
    fontFamily: 'Menlo',
    fontSize: 12,
    lineHeight: 18,
  },
})
