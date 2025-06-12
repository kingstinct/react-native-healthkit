import { Button, Host } from "@expo/ui/swift-ui";
import { Text, VStack } from "@expo/ui/swift-ui-primitives";

export const QueryInfo = ({
	queryTime,
	anchor,
	deletedSamples,
	onFetchMore,
}: {
	onFetchMore?: () => void;
	queryTime?: number;
	anchor?: string;
	deletedSamples?: readonly string[];
}) => {
	return (
		<Host style={{ padding: 16 }}>
			<VStack padding={16} spacing={8}>
				<Text>{queryTime ? `Query time: ${queryTime}ms` : "Loading..."}</Text>
				{deletedSamples && deletedSamples.length > 0 ? (
					<Text>{`Deleted samples: ${deletedSamples?.length}`}</Text>
				) : null}
				{anchor ? <Text>{`Anchor: ${anchor.substring(0, 20)}...`}</Text> : null}
				<Button
					onPress={onFetchMore}
					variant="borderedProminent"
					style={{ marginTop: 8 }}
				>
					Fetch More
				</Button>
			</VStack>
		</Host>
	);
};
