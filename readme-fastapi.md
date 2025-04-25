
## Endpoints
http://localhost:8000 

### 1. Create a New Conversation
Creates a new conversation thread with the AI tutor.

**Endpoint:** `POST /conversations`

**Request Body:** None

**Response:**
```json
{
  "id": 3,
  "title": "New Conversation",
  "created_at": "2025-04-24T13:43:41.78278+00:00"
}
```

### 2. List All Conversations
Retrieves all conversations.

**Endpoint:** `GET /conversations`

**Response:**
```json
[
  {
    "id": 1,
    "title": "New Conversation",
    "created_at": "2025-04-24T13:42:29.839947+00:00"
  },
  {
    "id": 2,
    "title": "New Conversation",
    "created_at": "2025-04-24T13:43:41.78278+00:00"
  }
]
```

### 3. Get a Specific Conversation
Retrieves details of a specific conversation.

**Endpoint:** `GET /conversations/{conversation_id}`

**Path Parameters:**
- `conversation_id`: ID of the conversation

**Response:**
```json
{
  "id": 1,
  "title": "New Conversation",
  "created_at": "2025-04-24T13:42:29.839947+00:00"
}
```

### 4. Get Conversation Messages
Retrieves all messages in a conversation.

**Endpoint:** `GET /conversations/{conversation_id}/messages`

**Path Parameters:**
- `conversation_id`: ID of the conversation

**Response:**
```json
[
  {
    "id": 1,
    "conversation_id": 1,
    "role": "user",
    "content": "Hello! I want to learn Python.",
    "created_at": "2025-04-24T13:42:35.123456+00:00"
  },
  {
    "id": 2,
    "conversation_id": 1,
    "role": "assistant",
    "content": "Great! Python is a versatile programming language...",
    "created_at": "2025-04-24T13:42:40.123456+00:00"
  }
]
```

### 5. Send a Message
Sends a message to the AI tutor in a specific conversation.

**Endpoint:** `POST /conversations/{conversation_id}/messages`

**Path Parameters:**
- `conversation_id`: ID of the conversation

**Request Body:**
```json
{
  "message": "Hello! I want to learn Python."
}
```

**Response:**
```json
{
  "user_message": "Hello! I want to learn Python.",
  "ai_response": "Great! Python is a versatile programming language..."
}
```

## Frontend Integration Example

Here's a React example of how to integrate with these endpoints:

```typescript
// API Service
const API_BASE_URL = 'http://localhost:8000';

export const apiService = {
  // Create new conversation
  createConversation: async () => {
    const response = await fetch(`${API_BASE_URL}/conversations`, {
      method: 'POST',
    });
    return response.json();
  },

  // Get all conversations
  getConversations: async () => {
    const response = await fetch(`${API_BASE_URL}/conversations`);
    return response.json();
  },

  // Get conversation messages
  getMessages: async (conversationId: number) => {
    const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`);
    return response.json();
  },

  // Send message
  sendMessage: async (conversationId: number, message: string) => {
    const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    return response.json();
  },
};
```


## Error Handling

The API may return the following error responses:

```json
{
  "detail": "Message is required"
}
```
Status: 400 (Bad Request)

```json
{
  "detail": "Conversation not found"
}
```
Status: 404 (Not Found)

```json
{
  "detail": "Internal server error"
}
```
Status: 500 (Internal Server Error)

## CORS Configuration

The API is configured to accept requests from any origin (`*`) in development. In production, you should update the CORS configuration in `main.py` to specify your frontend's domain.

## Environment Setup

1. Create a `.env` file in your frontend project:
```env
REACT_APP_API_URL=http://localhost:8000
```

2. Update the `API_BASE_URL` in your frontend code to use this environment variable.

Would you like me to:
1. Add more details to any section?
2. Create a more specific example for your use case?
3. Add additional endpoints or features?