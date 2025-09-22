import { EventPageLayout } from "../../components/layout/EventPageLayout";
import { InputMessage } from "../../components/chat/InputMessage";
import { ChatWindow } from "../../components/chat/ChatWindows";

export const ChatEventPage = () => {
	return (
		<EventPageLayout>
			<ChatWindow />
			<InputMessage />
		</EventPageLayout>
	);
}
