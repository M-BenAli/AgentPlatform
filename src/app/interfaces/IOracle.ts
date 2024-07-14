interface Content {
    contentType: string;
    value: string;
}

interface Message {
    role: string;
    content: Content[]
}

export default Message;
